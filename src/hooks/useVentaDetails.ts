
import { Report } from '@/types/report';
import { DetalleVenta, createDetalleVenta } from '@/models/Ventas';

export const useVentaDetails = () => {
  const crearDetallesVenta = (report: Report, cliente: string, destino: string): DetalleVenta[] => {
    console.log('🔧 Creando detalles de venta para:', {
      reportType: report.reportType,
      machineName: report.machineName,
      hours: report.hours,
      value: report.value,
      trips: report.trips
    });

    const detalles: DetalleVenta[] = [];
    
    // HORAS TRABAJADAS - Condición corregida para reconocer el tipo de reporte
    if (report.reportType === 'Horas Trabajadas' && report.hours && report.value && report.value > 0) {
      console.log('⏰ Procesando horas trabajadas con valor:', {
        horas: report.hours,
        valorTotal: report.value,
        valorPorHora: report.value / report.hours
      });

      // El valor del reporte es el TOTAL, no el valor por hora
      const valorPorHora = report.value / report.hours;
      
      const detalleHoras = createDetalleVenta(
        'Alquiler',
        `Alquiler ${report.machineName} - Horas trabajadas`,
        report.hours, // Cantidad = horas trabajadas
        valorPorHora  // Valor unitario = valor por hora
      );

      console.log('📋 Detalle de horas trabajadas creado:', {
        producto: detalleHoras.producto_servicio,
        cantidad: detalleHoras.cantidad_m3,
        valorUnitario: detalleHoras.valor_unitario,
        subtotal: detalleHoras.subtotal,
        verificacion: `${report.hours} × ${valorPorHora} = ${detalleHoras.subtotal}`
      });

      detalles.push(detalleHoras);
    }
    
    // HORAS EXTRAS
    else if (report.reportType === 'Horas Extras' && report.hours && report.value && report.value > 0) {
      console.log('⏰ Procesando horas extras:', {
        horas: report.hours,
        valorTotal: report.value,
        valorPorHora: report.value / report.hours
      });

      const valorPorHora = report.value / report.hours;
      
      const detalleHorasExtras = createDetalleVenta(
        'Alquiler',
        `Alquiler ${report.machineName} - Horas extras`,
        report.hours,
        valorPorHora
      );

      console.log('📋 Detalle de horas extras creado:', {
        producto: detalleHorasExtras.producto_servicio,
        cantidad: detalleHorasExtras.cantidad_m3,
        valorUnitario: detalleHorasExtras.valor_unitario,
        subtotal: detalleHorasExtras.subtotal
      });

      detalles.push(detalleHorasExtras);
    }
    
    // VIAJES
    else if (report.reportType === 'Viajes' && report.trips && report.value && report.value > 0) {
      console.log('🚛 Procesando viajes:', {
        viajes: report.trips,
        valorTotal: report.value,
        valorPorViaje: report.value / report.trips
      });

      const valorPorViaje = report.value / report.trips;
      
      const detalleViajes = createDetalleVenta(
        'Flete',
        `${report.machineName} - Transporte ${report.origin || 'Origen'} a ${destino}`,
        report.trips,
        valorPorViaje
      );

      console.log('📋 Detalle de viajes creado:', {
        producto: detalleViajes.producto_servicio,
        cantidad: detalleViajes.cantidad_m3,
        valorUnitario: detalleViajes.valor_unitario,
        subtotal: detalleViajes.subtotal
      });

      detalles.push(detalleViajes);
    }
    
    // RECEPCIÓN ESCOMBRERA
    else if (report.reportType === 'Recepción Escombrera' && report.value && report.value > 0) {
      const detalleEscombrera = createDetalleVenta(
        'Servicio',
        `Recepción escombrera - ${report.machineName}`,
        1,
        report.value
      );

      detalles.push(detalleEscombrera);
    }
    
    // CASOS SIN VALOR O CON VALOR 0
    else {
      console.log('⚠️ Reporte sin valor válido o tipo no reconocido:', {
        reportType: report.reportType,
        value: report.value,
        hours: report.hours,
        trips: report.trips
      });
      
      // Solo crear detalle genérico si hay algún valor
      if (report.value && report.value > 0) {
        const detalleGenerico = createDetalleVenta(
          'Servicio',
          `${report.reportType} - ${report.machineName}`,
          1,
          report.value
        );
        
        detalles.push(detalleGenerico);
      } else {
        console.log('❌ No se creará detalle de venta porque el valor es 0 o no existe');
      }
    }

    const totalCalculado = detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
    console.log('💰 Total de detalles calculado:', totalCalculado);
    console.log('📊 Detalles creados:', detalles.length);
    console.log('🔍 Detalles completos:', detalles);

    return detalles;
  };

  return {
    crearDetallesVenta
  };
};
