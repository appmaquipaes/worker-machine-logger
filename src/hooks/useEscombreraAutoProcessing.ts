
import { Report } from '@/types/report';
import { useAutoVentas } from './useAutoVentas';
import { toast } from "sonner";

export const useEscombreraAutoProcessing = () => {
  const { procesarReporteParaVenta } = useAutoVentas();

  const processEscombreraReport = (report: Report) => {
    if (report.reportType === 'Recepción Escombrera') {
      console.log('🏗 Procesando recepción de escombrera...');
      const ventaGenerada = procesarReporteParaVenta(report);
      if (ventaGenerada) {
        toast.success('💰 Venta de escombrera generada', {
          duration: 3000,
          style: {
            fontSize: '14px',
            backgroundColor: '#059669',
            color: 'white'
          }
        });
      }
    }
  };

  return {
    processEscombreraReport
  };
};
