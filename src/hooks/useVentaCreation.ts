
import { Report } from '@/types/report';
import { Venta, createVenta, createDetalleVenta, updateVentaTotal } from '@/models/Ventas';
import { getClienteByName } from '@/models/Clientes';
import { useVentaCalculations } from './useVentaCalculations';

export const useVentaCreation = () => {
  const {
    extractClienteFromDestination,
    determinarTipoVenta,
    extraerTipoMaterial,
    calcularPrecioMaterial,
    calcularPrecioFlete
  } = useVentaCalculations();

  const crearVentaAutomatica = (report: Report): Venta | null => {
    try {
      console.log('🔄 Creando venta automática con nueva lógica simplificada');
      console.log('📋 Reporte:', {
        machine: report.machineName,
        tipo: report.reportType,
        origen: report.origin,
        destino: report.destination,
        cantidad: report.cantidadM3
      });

      // Procesar reportes de tipo "Viajes" y "Recepción Escombrera"
      if (report.reportType !== 'Viajes' && report.reportType !== 'Recepción Escombrera') {
        console.log('❌ Tipo de reporte no válido para venta automática');
        return null;
      }

      let cliente = '';
      let destino = '';
      
      if (report.reportType === 'Recepción Escombrera') {
        cliente = report.clienteEscombrera || report.destination || '';
        destino = 'Escombrera MAQUIPAES';
      } else {
        cliente = extractClienteFromDestination(report.destination || '');
        destino = report.destination || '';
      }
      
      if (!cliente) {
        console.log('❌ No se pudo extraer cliente del reporte');
        return null;
      }

      // Verificar que el cliente existe
      const clienteData = getClienteByName(cliente);
      if (!clienteData) {
        console.log('❌ Cliente no encontrado en la base de datos:', cliente);
        return null;
      }

      const tipoVenta = determinarTipoVenta(report);
      const fechaVenta = report.reportDate;
      
      // Para escombrera, usar cantidad de volquetas como cantidad
      const cantidad = report.reportType === 'Recepción Escombrera' 
        ? (report.cantidadVolquetas || 0) 
        : (report.cantidadM3 || 0);

      console.log('💰 Datos para venta:', {
        cliente,
        tipoVenta,
        cantidad,
        fechaVenta
      });

      // Crear la venta base
      let nuevaVenta = createVenta(
        fechaVenta,
        cliente,
        clienteData.ciudad,
        tipoVenta,
        report.origin || '',
        destino,
        'Efectivo',
        `Venta automática generada desde reporte de ${report.machineName} (Nueva lógica simplificada)`
      );

      const detalles = [];

      // Para escombrera, solo agregar servicio de recepción
      if (report.reportType === 'Recepción Escombrera') {
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
        }
      } else {
        // Si incluye material, agregar detalle de material
        if (tipoVenta === 'Solo material' || tipoVenta === 'Material + transporte') {
          const tipoMaterial = extraerTipoMaterial(report);
          const precioMaterial = calcularPrecioMaterial(tipoMaterial, report.proveedorId);
          
          if (precioMaterial > 0 && cantidad > 0) {
            const detalleMaterial = createDetalleVenta(
              'Material',
              tipoMaterial,
              cantidad,
              precioMaterial
            );
            detalles.push(detalleMaterial);
            
            console.log('💰 Precio material calculado:', {
              material: tipoMaterial,
              proveedor: report.proveedorNombre || 'Genérico',
              precio: precioMaterial
            });
          }
        }

        // Si incluye transporte, agregar detalle de flete
        if (tipoVenta === 'Solo transporte' || tipoVenta === 'Material + transporte') {
          const precioFlete = calcularPrecioFlete(report, cantidad);

          if (precioFlete > 0 && cantidad > 0) {
            const detalleFlete = createDetalleVenta(
              'Flete',
              `Transporte ${report.origin} → ${report.destination}`,
              cantidad,
              precioFlete
            );
            detalles.push(detalleFlete);
          }
        }
      }

      // Agregar detalles a la venta
      nuevaVenta.detalles = detalles;
      
      // Calcular total
      nuevaVenta = updateVentaTotal(nuevaVenta);

      // Solo crear la venta si tiene valor mayor a 0
      if (nuevaVenta.total_venta > 0) {
        console.log('✅ Venta automática creada exitosamente:', {
          cliente,
          tipo: tipoVenta,
          total: nuevaVenta.total_venta,
          detalles: detalles.length,
          proveedorUsado: report.proveedorNombre || 'No específico'
        });
        
        console.log('💾 Guardando venta en localStorage...');
        return nuevaVenta;
      }

      console.log('❌ Venta no creada - total es 0');
      return null;
    } catch (error) {
      console.error('❌ Error creando venta automática:', error);
      return null;
    }
  };

  return {
    crearVentaAutomatica
  };
};
