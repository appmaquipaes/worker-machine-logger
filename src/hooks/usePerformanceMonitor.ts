
import { useEffect, useRef, useState, useCallback } from 'react';
import { PerformanceMetrics } from '@/types/validation';
import { devLogger } from '@/utils/testUtils';

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    networkRequests: 0
  });

  const startTimeRef = useRef<number>(Date.now());
  const renderCountRef = useRef<number>(0);

  useEffect(() => {
    const loadTime = Date.now() - startTimeRef.current;
    renderCountRef.current += 1;

    setMetrics(prev => ({
      ...prev,
      loadTime,
      renderTime: renderCountRef.current
    }));

    devLogger.info(`${componentName} rendered`, {
      loadTime,
      renderCount: renderCountRef.current
    });
  });

  const trackNetworkRequest = useCallback(() => {
    setMetrics(prev => ({
      ...prev,
      networkRequests: prev.networkRequests + 1
    }));
  }, []);

  const logMetrics = useCallback(() => {
    devLogger.info(`Performance metrics for ${componentName}`, metrics);
  }, [componentName, metrics]);

  return {
    metrics,
    trackNetworkRequest,
    logMetrics
  };
};
