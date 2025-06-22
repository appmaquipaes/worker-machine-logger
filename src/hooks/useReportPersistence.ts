
import { useState, useEffect } from 'react';
import { Report } from '@/types/report';
import { parseStoredReports, filterReports } from '@/utils/reportUtils';

export const useReportPersistence = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      const parsedReports = parseStoredReports(storedReports);
      setReports(parsedReports);
    }
  }, []);

  const saveReports = (newReports: Report[]) => {
    setReports(newReports);
    localStorage.setItem('reports', JSON.stringify(newReports));
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

  const getFilteredReports = (filters: any) => {
    return filterReports(reports, filters);
  };

  return {
    reports,
    saveReports,
    updateReport,
    deleteReport,
    getFilteredReports
  };
};
