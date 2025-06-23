
import { useState, useEffect } from 'react';
import { Report } from '@/types/report';
import { parseStoredReports } from '@/utils/reportUtils';
import { useDataPersistence } from '@/hooks/useDataPersistence';
import { toast } from "sonner";

export const useReportPersistence = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const { saveToLocalStorage, loadFromLocalStorage } = useDataPersistence();

  useEffect(() => {
    const storedReports = loadFromLocalStorage('reports', []);
    if (storedReports && storedReports.length > 0) {
      const parsedReports = parseStoredReports(JSON.stringify(storedReports));
      setReports(parsedReports);
      console.log('📋 Reportes cargados:', parsedReports.length);
    }
  }, [loadFromLocalStorage]);

  const saveReports = (newReports: Report[]) => {
    console.log('💾 Guardando reportes:', newReports.length);
    setReports(newReports);
    const guardadoExitoso = saveToLocalStorage('reports', newReports);
    if (!guardadoExitoso) {
      toast.error('Error guardando reportes');
    }
  };

  const updateReport = (id: string, updatedReport: Partial<Report>) => {
    const updatedReports = reports.map(report =>
      report.id === id ? { ...report, ...updatedReport } : report
    );
    saveReports(updatedReports);
  };

  const deleteReport = (id: string) => {
    const updatedReports = reports.filter(report => report.id !== id);
    saveReports(updatedReports);
  };

  return {
    reports,
    saveReports,
    updateReport,
    deleteReport
  };
};
