
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
      console.log('🔄 Creando venta automática con lógica ampliada');
      console.log('📋 Reporte:', {
        machine: report.machineName,
        tipo: report.reportType,
        origen: report.origin,
        destino: report.destination,
        cantidad: report.cantidadM3,
        horas: report.hours,
        workSite: report.workSite
      });

      // Procesar reportes de tipo "Viajes", "Recepción Escombrera", "Horas Trabajadas" y "Horas Extras"
      const tiposValidos = ['Viajes', 'Recepción Escombrera', 'Horas Trabajadas', 'Horas Extras'];
      if (!tiposValidos.includes(report.reportType)) {
        console.log('❌ Tipo de reporte no válido para venta automática');
        return null;
      }

      let cliente = '';
      let destino = '';
      
      if (report.reportType === 'Recepción Escombrera') {
        cliente = report.clienteEscombrera || report.destination || '';
        destino = 'Escombrera MAQUIPAES';
      } else if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
        // Para horas trabajadas, extraer cliente del workSite
        cliente = extractClienteFromDestination(report.workSite || '');
        destino = report.workSite || '';
      } else {
        cliente = extractClienteFromDestination(report.destination || '');
        destino = report.destination || '';
      }
      
      console.log('👤 Cliente extraído:', cliente);
      console.log('📍 Destino asignado:', destino);
      
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

      console.log('✅ Cliente encontrado:', clienteData);

      let tipoVenta = '';
      const fechaVenta = report.reportDate;
      
      // Determinar tipo de venta según el tipo de reporte
      if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
        tipoVenta = 'Solo transporte'; // Las horas se cobran como servicio de transporte
      } else {
        tipoVenta = determinarTipoVenta(report);
      }
      
      // Para horas trabajadas, usar las horas como cantidad
      const cantidad = (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') 
        ? (report.hours || 0)
        : report.reportType === 'Recepción Escombrera' 
          ? (report.cantidadVolquetas || 0) 
          : (report.cantidadM3 || 0);

      console.log('💰 Datos para venta:', {
        cliente,
        tipoVenta,
        cantidad,
        fechaVenta,
        tipoReporte: report.reportType
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
        `Venta automática generada desde reporte de ${report.machineName} - ${report.reportType}`
      );

      console.log('📋 Venta base creada:', nuevaVenta);

      const detalles = [];

      // Procesar según el tipo de reporte
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
          console.log('🏗 Detalle escombrera creado:', detalleRecepcion);
        }
      } else if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
        // Generar detalle de venta para horas trabajadas
        if (report.hours && report.hours > 0) {
          // Usar el valor calculado del reporte o una tarifa base
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
      } else {
        // Lógica existente para viajes
        console.log('🚛 Procesando viaje - Tipo de venta:', tipoVenta);
        
        if (tipoVenta === 'Solo material' || tipoVenta === 'Material + transporte') {
          const tipoMaterial = extraerTipoMaterial(report);
          const precioMaterial = calcularPrecioMaterial(tipoMaterial, report.proveedorId);
          
          console.log('📦 Material:', { tipoMaterial, precioMaterial, cantidad });
          
          if (precioMaterial > 0 && cantidad > 0) {
            const detalleMaterial = createDetalleVenta(
              'Material',
              tipoMaterial,
              cantidad,
              precioMaterial
            );
            detalles.push(detalleMaterial);
            
            console.log('💰 Detalle material creado:', detalleMaterial);
          }
        }

        if (tipoVenta === 'Solo transporte' || tipoVenta === 'Material + transporte') {
          const precioFlete = calcularPrecioFlete(report, cantidad);
          
          console.log('🚚 Flete:', { precioFlete, cantidad });

          if (precioFlete > 0 && cantidad > 0) {
            const detalleFlete = createDetalleVenta(
              'Flete',
              `Transporte ${report.origin} → ${report.destination}`,
              cantidad,
              precioFlete
            );
            detalles.push(detalleFlete);
            
            console.log('🚚 Detalle flete creado:', detalleFlete);
          }
        }
      }

      // Agregar detalles a la venta
      nuevaVenta.detalles = detalles;
      
      console.log('📋 Detalles agregados a la venta:', detalles.length);

      // Calcular total
      nuevaVenta = updateVentaTotal(nuevaVenta);

      console.log('💰 Total calculado:', nuevaVenta.total_venta);

      // Solo crear la venta si tiene valor mayor a 0
      if (nuevaVenta.total_venta > 0) {
        console.log('✅ Venta automática creada exitosamente:', {
          id: nuevaVenta.id,
          cliente,
          tipo: tipoVenta,
          total: nuevaVenta.total_venta,
          detalles: detalles.length,
          tipoReporte: report.reportType
        });
        
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
