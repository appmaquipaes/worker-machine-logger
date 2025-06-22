
import { Report } from '@/types/report';
import { Venta, createVenta, updateVentaTotal } from '@/models/Ventas';
import { useVentaCalculations } from './useVentaCalculations';
import { useVentaValidation } from './useVentaValidation';
import { useVentaDetailsCreation } from './useVentaDetailsCreation';

export const useVentaBaseCreation = () => {
  const { determinarTipoVenta } = useVentaCalculations();
  const { validateClienteExists, extractClienteInfo } = useVentaValidation();
  const { createVentaDetails } = useVentaDetailsCreation();

  const createBaseVenta = (report: Report, clienteData: any): Venta => {
    const { cliente, destino } = extractClienteInfo(report);
    
    let tipoVenta = '';
    const fechaVenta = report.reportDate;
    
    // Determinar tipo de venta según el tipo de reporte
    if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
      tipoVenta = 'Solo transporte'; // Las horas se cobran como servicio de transporte
    } else {
      tipoVenta = determinarTipoVenta(report);
    }
    
    console.log('💰 Datos para venta:', {
      cliente,
      tipoVenta,
      fechaVenta,
      tipoReporte: report.reportType
    });

    // Crear la venta base
    const nuevaVenta = createVenta(
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
    return nuevaVenta;
  };

  const finalizeVenta = (venta: Venta, report: Report): Venta | null => {
    // Crear detalles
    const detalles = createVentaDetails(report);
    
    // Agregar detalles a la venta
    venta.detalles = detalles;
    
    console.log('📋 Detalles agregados a la venta:', detalles.length);

    // Calcular total
    const ventaConTotal = updateVentaTotal(venta);

    console.log('💰 Total calculado:', ventaConTotal.total_venta);

    // Solo crear la venta si tiene valor mayor a 0
    if (ventaConTotal.total_venta > 0) {
      console.log('✅ Venta automática creada exitosamente:', {
        id: ventaConTotal.id,
        cliente: ventaConTotal.cliente,
        tipo: ventaConTotal.tipo_venta,
        total: ventaConTotal.total_venta,
        detalles: detalles.length,
        tipoReporte: report.reportType
      });
      
      return ventaConTotal;
    }

    console.log('❌ Venta no creada - total es 0');
    return null;
  };

  return {
    createBaseVenta,
    finalizeVenta
  };
};
