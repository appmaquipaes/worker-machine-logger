
import { Report } from '@/types/report';
import { useInventarioOperations } from '@/hooks/useInventarioOperations';
import { toast } from "sonner";

export const useReportInventoryProcessing = () => {
  const { procesarReporteInventario } = useInventarioOperations();

  const processInventoryForReport = (report: Report) => {
    if (report.reportType === 'Viajes' && (report.origin || report.destination)) {
      console.log('🏭 Iniciando procesamiento de inventario...');
      try {
        const resultadoInventario = procesarReporteInventario(report);
        console.log('📊 Resultado procesamiento inventario:', resultadoInventario);
        
        if (resultadoInventario.exito) {
          console.log('✅ Inventario actualizado exitosamente');
          toast.success(`✅ Inventario actualizado: ${resultadoInventario.mensaje}`, {
            duration: 4000,
            style: {
              fontSize: '14px',
              backgroundColor: '#22c55e',
              color: 'white'
            }
          });
        } else {
          console.log('⚠ No se procesó inventario:', resultadoInventario.mensaje);
        }
      } catch (error) {
        console.error('❌ Error procesando inventario:', error);
      }
    }
  };

  return {
    processInventoryForReport
  };
};
