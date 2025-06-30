
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
    
    if (report.reportType === 'Horas Trabajadas' && report.hours && report.value) {
      console.log('⏰ Procesando horas trabajadas:', {
        horas: report.hours,
        valorTotal: report.value,
        valorPorHora: report.value / report.hours
      });

      // CORRECCIÓN: Usar las horas reportadas y el valor total del reporte
      const valorPorHora = report.value / report.hours;
      
      const detalleHoras = createDetalleVenta(
        'Alquiler',
        `Alquiler ${report.machineName} - Horas trabajadas`,
        report.hours, // Cantidad = horas trabajadas
        valorPorHora  // Valor unitario = valor total / horas
      );

      console.log('📋 Detalle creado:', {
        producto: detalleHoras.producto_servicio,
        cantidad: detalleHoras.cantidad_m3,
        valorUnitario: detalleHoras.valor_unitario,
        subtotal: detalleHoras.subtotal,
        calculoVerificacion: report.hours * valorPorHora
      });

      detalles.push(detalleHoras);
    }
    
    else if (report.reportType === 'Viajes' && report.trips && report.value) {
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
    
    else if (report.reportType === 'Recepción Escombrera' && report.value) {
      const detalleEscombrera = createDetalleVenta(
        'Servicio',
        `Recepción escombrera - ${report.machineName}`,
        1,
        report.value
      );

      detalles.push(detalleEscombrera);
    }
    
    else {
      console.log('⚠️ Tipo de reporte no reconocido o datos insuficientes');
      // Crear detalle genérico con el valor del reporte
      const detalleGenerico = createDetalleVenta(
        'Servicio',
        `${report.reportType} - ${report.machineName}`,
        1,
        report.value || 0
      );
      
      detalles.push(detalleGenerico);
    }

    const totalCalculado = detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
    console.log('💰 Total de detalles calculado:', totalCalculado);
    console.log('📊 Detalles creados:', detalles.length);

    return detalles;
  };

  return {
    crearDetallesVenta
  };
};
