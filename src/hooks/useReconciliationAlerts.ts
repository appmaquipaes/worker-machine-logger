
import { useState, useEffect, useCallback } from 'react';
import { useDataReconciliation } from './useDataReconciliation';
import { toast } from 'sonner';

export const useReconciliationAlerts = () => {
  const { reconciliationResults } = useDataReconciliation();
  const [lastAlertCount, setLastAlertCount] = useState(0);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  const showCriticalAlerts = useCallback(() => {
    if (!alertsEnabled) return;

    const criticalDiscrepancies = [
      ...reconciliationResults.inventoryDiscrepancies,
      ...reconciliationResults.salesDiscrepancies,
      ...reconciliationResults.reportDiscrepancies
    ].filter(d => d.severity === 'high');

    if (criticalDiscrepancies.length > lastAlertCount) {
      const newAlerts = criticalDiscrepancies.length - lastAlertCount;
      
      toast.error(`${newAlerts} nuevo(s) problema(s) crítico(s) detectado(s)`, {
        description: 'Revisar dashboard de reconciliación',
        duration: 8000
      });

      // Mostrar detalle del primer problema crítico
      if (criticalDiscrepancies.length > 0) {
        const firstAlert = criticalDiscrepancies[0];
        toast.error(firstAlert.description, {
          description: firstAlert.suggestedAction,
          duration: 10000
        });
      }
    }

    setLastAlertCount(criticalDiscrepancies.length);
  }, [reconciliationResults, lastAlertCount, alertsEnabled]);

  const showSummaryNotification = useCallback(() => {
    if (!alertsEnabled) return;

    const totalDiscrepancies = reconciliationResults.totalDiscrepancies;
    
    if (totalDiscrepancies === 0) {
      toast.success('✅ Reconciliación completada', {
        description: 'Todos los datos están consistentes',
        duration: 3000
      });
    } else {
      const criticalCount = reconciliationResults.inventoryDiscrepancies.filter(d => d.severity === 'high').length +
                           reconciliationResults.salesDiscrepancies.filter(d => d.severity === 'high').length +
                           reconciliationResults.reportDiscrepancies.filter(d => d.severity === 'high').length;
      
      if (criticalCount > 0) {
        toast.warning(`⚠️ ${totalDiscrepancies} problema(s) encontrado(s)`, {
          description: `${criticalCount} crítico(s) requieren atención inmediata`,
          duration: 6000
        });
      } else {
        toast.info(`ℹ️ ${totalDiscrepancies} problema(s) menores encontrado(s)`, {
          description: 'Revisar cuando sea conveniente',
          duration: 4000
        });
      }
    }
  }, [reconciliationResults, alertsEnabled]);

  // Ejecutar alertas cuando cambien los resultados
  useEffect(() => {
    if (reconciliationResults.totalDiscrepancies >= 0) {
      showCriticalAlerts();
    }
  }, [reconciliationResults, showCriticalAlerts]);

  const toggleAlerts = useCallback(() => {
    setAlertsEnabled(prev => !prev);
  }, []);

  const resetAlertCount = useCallback(() => {
    setLastAlertCount(0);
  }, []);

  return {
    alertsEnabled,
    toggleAlerts,
    resetAlertCount,
    showSummaryNotification
  };
};
