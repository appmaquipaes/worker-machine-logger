
import { useEffect } from 'react';
import { Report } from '@/types/report';
import { Venta, createVenta, createDetalleVenta, updateVentaTotal, saveVentas, loadVentas } from '@/models/Ventas';
import { getPrecioVentaMaterial } from '@/models/Materiales';
import { loadTarifas } from '@/models/Tarifas';
import { getClienteByName } from '@/models/Clientes';

export const useAutoVentas = () => {
  
  const extractClienteFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[0] || '';
  };

  const extractFincaFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[1] || '';
  };

  const determinarTipoVenta = (report: Report): 'Solo material' | 'Solo transporte' | 'Material + transporte' => {
    // Cargador siempre es "Solo material" desde Acopio
    if (report.machineName.toLowerCase().includes('cargador')) {
      return 'Solo material';
    }
    
    // Volquetas desde Acopio es "Material + transporte"
    if (report.origin && report.origin.toLowerCase().includes('acopio')) {
      return 'Material + transporte';
    }
    
    // Volquetas desde otros orígenes es "Solo transporte"
    return 'Solo transporte';
  };

  const crearVentaAutomatica = (report: Report): Venta | null => {
    try {
      // Solo procesar reportes de tipo "Viajes"
      if (report.reportType !== 'Viajes') {
        return null;
      }

      // Extraer información del reporte
      const cliente = extractClienteFromDestination(report.destination || '');
      const finca = extractFincaFromDestination(report.destination || '');
      
      if (!cliente) {
        console.log('No se pudo extraer cliente del destino:', report.destination);
        return null;
      }

      // Verificar que el cliente existe
      const clienteData = getClienteByName(cliente);
      if (!clienteData) {
        console.log('Cliente no encontrado en la base de datos:', cliente);
        return null;
      }

      const tipoVenta = determinarTipoVenta(report);
      const fechaVenta = report.reportDate;
      const cantidadM3 = report.cantidadM3 || 0;

      // Crear la venta base
      let nuevaVenta = createVenta(
        fechaVenta,
        cliente,
        clienteData.ciudad,
        tipoVenta,
        report.origin || '',
        report.destination || '',
        'Efectivo', // Forma de pago por defecto
        `Venta automática generada desde reporte de ${report.machineName}`
      );

      // Agregar detalles según el tipo de venta
      const detalles = [];

      // Si incluye material, agregar detalle de material
      if (tipoVenta === 'Solo material' || tipoVenta === 'Material + transporte') {
        // Para cargador, el tipo de material viene del description o se asume
        let tipoMaterial = 'Material'; // Por defecto
        
        if (report.description) {
          // Intentar extraer tipo de material de la descripción
          const materialMatch = report.description.match(/(arena|recebo|gravilla|material)/i);
          if (materialMatch) {
            tipoMaterial = materialMatch[1];
          }
        }

        const precioMaterial = getPrecioVentaMaterial(tipoMaterial);
        
        if (precioMaterial > 0 && cantidadM3 > 0) {
          const detalleMaterial = createDetalleVenta(
            'Material',
            tipoMaterial,
            cantidadM3,
            precioMaterial
          );
          detalles.push(detalleMaterial);
        }
      }

      // Si incluye transporte, agregar detalle de flete
      if (tipoVenta === 'Solo transporte' || tipoVenta === 'Material + transporte') {
        const tarifas = loadTarifas();
        const tarifaFlete = tarifas.find(t => 
          t.origen.toLowerCase() === (report.origin || '').toLowerCase() &&
          t.destino.toLowerCase() === (report.destination || '').toLowerCase()
        );

        let precioFlete = 0;
        if (tarifaFlete) {
          precioFlete = tarifaFlete.valor_por_m3;
        } else if (report.value) {
          // Si no hay tarifa pero el reporte tiene valor, usar ese valor
          precioFlete = cantidadM3 > 0 ? report.value / cantidadM3 : 0;
        }

        if (precioFlete > 0 && cantidadM3 > 0) {
          const detalleFlete = createDetalleVenta(
            'Flete',
            `Transporte ${report.origin} → ${report.destination}`,
            cantidadM3,
            precioFlete
          );
          detalles.push(detalleFlete);
        }
      }

      // Agregar detalles a la venta
      nuevaVenta.detalles = detalles;
      
      // Calcular total
      nuevaVenta = updateVentaTotal(nuevaVenta);

      // Solo crear la venta si tiene valor mayor a 0
      if (nuevaVenta.total_venta > 0) {
        console.log('Venta automática creada:', {
          cliente,
          tipo: tipoVenta,
          total: nuevaVenta.total_venta,
          detalles: detalles.length
        });
        
        return nuevaVenta;
      }

      return null;
    } catch (error) {
      console.error('Error creando venta automática:', error);
      return null;
    }
  };

  const procesarReporteParaVenta = (report: Report) => {
    const ventaAutomatica = crearVentaAutomatica(report);
    
    if (ventaAutomatica) {
      // Cargar ventas existentes
      const ventasExistentes = loadVentas();
      
      // Verificar que no exista ya una venta para este reporte
      const ventaExistente = ventasExistentes.find(v => 
        v.observaciones?.includes(`reporte de ${report.machineName}`) &&
        Math.abs(new Date(v.fecha).getTime() - report.reportDate.getTime()) < 60000 // Diferencia menor a 1 minuto
      );

      if (!ventaExistente) {
        // Agregar la nueva venta
        const nuevasVentas = [...ventasExistentes, ventaAutomatica];
        saveVentas(nuevasVentas);
        
        console.log('Venta automática guardada exitosamente');
        return true;
      } else {
        console.log('Ya existe una venta para este reporte, no se duplica');
      }
    }
    
    return false;
  };

  return {
    procesarReporteParaVenta,
    crearVentaAutomatica,
    determinarTipoVenta,
    extractClienteFromDestination,
    extractFincaFromDestination
  };
};
