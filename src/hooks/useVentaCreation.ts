
import { Report } from '@/types/report';
import { createVenta, determinarTipoVentaPorActividad } from '@/models/Ventas';
import { useVentaCalculations } from '@/hooks/useVentaCalculations';
import { useVentaDetails } from '@/hooks/useVentaDetails';
import { getActividadGeneradora } from '@/utils/ventaActivities';

export const useVentaCreation = () => {
  const { 
    extractClienteFromDestination, 
    extractFincaFromDestination 
  } = useVentaCalculations();
  
  const { crearDetallesVenta } = useVentaDetails();

  const crearVentaAutomatica = (report: Report) => {
    console.log('🔥 Creando venta automática desde reporte:', report.reportType, report.machineName);
    
    try {
      // Determinar cliente y destino
      let cliente = '';
      let destino = '';
      
      if (report.reportType === 'Horas Trabajadas') {
        cliente = report.workSite || 'Cliente no especificado';
        destino = `${cliente} - Sitio de trabajo`;
      } else if (report.destination) {
        cliente = extractClienteFromDestination(report.destination);
        const finca = extractFincaFromDestination(report.destination);
        destino = report.destination;
      } else {
        console.log('❌ No se puede determinar cliente/destino');
        return null;
      }

      // Determinar actividad generadora
      const actividadGeneradora = getActividadGeneradora(report);
      
      // Determinar tipo de venta usando la función actualizada
      const tipoVenta = determinarTipoVentaPorActividad(
        actividadGeneradora,
        report.reportType,
        report.machineName
      );
      
      console.log('📋 Datos de venta:', {
        cliente,
        destino,
        tipoVenta,
        actividadGeneradora,
        reportValue: report.value,
        reportHours: report.hours
      });

      // Crear venta base
      const ventaBase = createVenta(
        report.reportDate,
        cliente,
        'Villavicencio',
        tipoVenta,
        report.origin || 'Origen no especificado',
        destino,
        'Crédito',
        `Venta automática generada desde reporte ${report.reportType} - ${report.machineName}`,
        actividadGeneradora
      );

      // Agregar campos adicionales
      ventaBase.maquina_utilizada = report.machineName;
      if (report.hours) ventaBase.horas_trabajadas = report.hours;
      if (report.trips) ventaBase.viajes_realizados = report.trips;
      if (report.cantidadM3) ventaBase.cantidad_material_m3 = report.cantidadM3;

      // Crear detalles de venta
      const detalles = crearDetallesVenta(report, cliente, destino);

      // Asignar detalles y calcular total
      ventaBase.detalles = detalles;
      ventaBase.total_venta = detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
      
      console.log('✅ Venta creada:', {
        totalDetalles: detalles.length,
        totalVenta: ventaBase.total_venta,
        detalles: detalles.map(d => ({
          producto: d.producto_servicio,
          cantidad: d.cantidad_m3,
          valorUnitario: d.valor_unitario,
          subtotal: d.subtotal
        }))
      });
      
      return ventaBase;
      
    } catch (error) {
      console.error('❌ Error creando venta automática:', error);
      return null;
    }
  };

  return {
    crearVentaAutomatica
  };
};
