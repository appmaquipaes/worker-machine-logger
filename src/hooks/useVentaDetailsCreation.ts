
import { Report } from '@/types/report';
import { createDetalleVenta, DetalleVenta } from '@/models/Ventas';
import { useVentaCalculations } from './useVentaCalculations';

export const useVentaDetailsCreation = () => {
  const {
    determinarTipoVenta,
    extraerTipoMaterial,
    calcularPrecioMaterial,
    calcularPrecioFlete
  } = useVentaCalculations();

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
    
    console.log('🚛 Procesando viaje - Tipo de venta:', tipoVenta);
    
    // Crear detalle de material si aplica
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

    // Crear detalle de flete si aplica
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
    
    return detalles;
  };

  const createVentaDetails = (report: Report): DetalleVenta[] => {
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
