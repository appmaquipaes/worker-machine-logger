
import { Report } from '@/types/report';
import { loadVentas, saveVentas } from '@/models/Ventas';
import { useVentaCreation } from './useVentaCreation';

export const useVentaProcessing = () => {
  const { crearVentaAutomatica } = useVentaCreation();

  const procesarReporteParaVenta = (report: Report): boolean => {
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
    procesarReporteParaVenta
  };
};
