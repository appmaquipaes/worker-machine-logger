
import { Report } from '@/types/report';
import { createDetalleVenta, DetalleVenta } from '@/models/Ventas';
import { useVentaCalculations } from './useVentaCalculations';
import { useVentaValidation } from './useVentaValidation';

export const useVentaDetailsCreation = () => {
  const {
    determinarTipoVenta,
    extraerTipoMaterial,
    calcularPrecioMaterial,
    calcularPrecioFlete,
    extractFincaFromDestination
  } = useVentaCalculations();
  
  const { extractClienteInfo } = useVentaValidation();

  const createEscombreraDetails = (report: Report): DetalleVenta[] => {
    const detalles = [];
    const tipoVolqueta = report.tipoVolqueta || 'Sencilla';
    const cantidadVolquetas = report.cantidadVolquetas || 0;
    const valorTotal = report.value || 0;
    const valorUnitario = cantidadVolquetas > 0 ? valorTotal / cantidadVolquetas : 0;
    
    if (valorUnitario > 0 && cantidadVolquetas > 0) {
      const detalleRecepcion = createDetalleVenta(
        'Flete',
        `Recepción Escombrera - Volqueta ${tipoVolqueta}`,
        cantidadVolquetas,
        valorUnitario
      );
      detalles.push(detalleRecepcion);
      console.log('🏗 Detalle escombrera creado:', detalleRecepcion);
    }
    
    return detalles;
  };

  const createHorasDetails = (report: Report): DetalleVenta[] => {
    const detalles = [];
    
    if (report.hours && report.hours > 0) {
      const valorPorHora = report.value && report.value > 0 
        ? report.value / report.hours 
        : 50000; // Valor por defecto si no hay tarifa
      
      const detalleHoras = createDetalleVenta(
        'Flete',
        `${report.reportType} - ${report.machineName}`,
        report.hours,
        valorPorHora
      );
      detalles.push(detalleHoras);
      
      console.log('⏰ Detalle de horas creado:', {
        horas: report.hours,
        valorPorHora,
        subtotal: detalleHoras.subtotal
      });
    }
    
    return detalles;
  };

  const createViajesDetails = (report: Report): DetalleVenta[] => {
    const detalles = [];
    const tipoVenta = determinarTipoVenta(report);
    const cantidad = report.cantidadM3 || 0;
    
    // Extraer información del cliente para tarifas específicas
    const { cliente } = extractClienteInfo(report);
    const finca = extractFincaFromDestination(report.destination || '');
    
    console.log('🚛 Procesando viaje - Información del cliente:', { cliente, finca, tipoVenta });
    
    // Crear detalle de material si aplica
    if (tipoVenta === 'Solo material' || tipoVenta === 'Material + transporte') {
      const tipoMaterial = extraerTipoMaterial(report);
      const precioMaterial = calcularPrecioMaterial(
        tipoMaterial, 
        report.proveedorId, 
        cliente, 
        finca, 
        report.origin
      );
      
      console.log('📦 Material:', { tipoMaterial, precioMaterial, cantidad, fuente: 'cliente/proveedor/genérico' });
      
      if (precioMaterial > 0 && cantidad > 0) {
        const detalleMaterial = createDetalleVenta(
          'Material',
          tipoMaterial,
          cantidad,
          precioMaterial
        );
        detalles.push(detalleMaterial);
        console.log('💰 Detalle material creado:', detalleMaterial);
      } else {
        console.log('⚠️ Material no agregado - precio o cantidad es 0');
      }
    }

    // Crear detalle de flete si aplica
    if (tipoVenta === 'Solo transporte' || tipoVenta === 'Material + transporte') {
      const precioFlete = calcularPrecioFlete(report, cantidad, cliente, finca);
      
      console.log('🚚 Flete:', { precioFlete, cantidad, fuente: 'cliente/genérico' });

      if (precioFlete > 0 && cantidad > 0) {
        const detalleFlete = createDetalleVenta(
          'Flete',
          `Transporte ${report.origin} → ${report.destination}`,
          cantidad,
          precioFlete
        );
        detalles.push(detalleFlete);
        console.log('🚚 Detalle flete creado:', detalleFlete);
      } else {
        console.log('⚠️ Flete no agregado - precio o cantidad es 0');
      }
    }
    
    return detalles;
  };

  const createVentaDetails = (report: Report): DetalleVenta[] => {
    console.log('📋 Creando detalles de venta para reporte:', {
      tipo: report.reportType,
      maquina: report.machineName,
      origen: report.origin,
      destino: report.destination,
      descripcion: report.description,
      cantidad: report.cantidadM3
    });

    if (report.reportType === 'Recepción Escombrera') {
      return createEscombreraDetails(report);
    } else if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
      return createHorasDetails(report);
    } else {
      return createViajesDetails(report);
    }
  };

  return {
    createVentaDetails
  };
};
