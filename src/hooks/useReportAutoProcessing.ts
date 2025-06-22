
import { Report } from '@/types/report';
import { useInventoryAutoProcessing } from './useInventoryAutoProcessing';
import { useAutomaticSalesProcessing } from './useAutomaticSalesProcessing';
import { useEscombreraAutoProcessing } from './useEscombreraAutoProcessing';

export const useReportAutoProcessing = () => {
  const { processInventoryUpdate, validateInventoryOperation } = useInventoryAutoProcessing();
  const { processAutomaticSales } = useAutomaticSalesProcessing();
  const { processEscombreraReport } = useEscombreraAutoProcessing();

  return {
    processInventoryUpdate,
    processAutomaticSales,
    processEscombreraReport,
    validateInventoryOperation
  };
};
