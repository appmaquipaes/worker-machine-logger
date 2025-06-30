
import React, { createContext, useContext, useEffect } from 'react';
import { useEnhancedReportManager } from '@/hooks/useEnhancedReportManager';
import { Report, ReportType, ReportContextType } from '@/types/report';

const EnhancedReportContext = createContext<ReportContextType | undefined>(undefined);

export const useEnhancedReport = () => {
  const context = useContext(EnhancedReportContext);
  if (!context) {
    throw new Error('useEnhancedReport debe ser utilizado dentro de un EnhancedReportProvider');
  }
  return context;
};

export const EnhancedReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    reports,
    isLoading,
    loadReports,
    addReport: enhancedAddReport,
    updateReport: enhancedUpdateReport,
    deleteReport: enhancedDeleteReport
  } = useEnhancedReportManager();

  useEffect(() => {
    loadReports();
  }, []);

  const addReport = (
    machineId: string,
    machineName: string,
    reportType: ReportType,
    description: string,
    reportDate: Date,
    trips?: number,
    hours?: number,
    value?: number,
    workSite?: string,
    origin?: string,
    destination?: string,
    cantidadM3?: number,
    proveedor?: string,
    kilometraje?: number
  ) => {
    const newReport: Omit<Report, 'id'> = {
      machineId,
      machineName,
      userName: 'Usuario', // Esto debería venir del contexto de auth
      userId: 'user-id', // Esto debería venir del contexto de auth
      reportType,
      description,
      value: value || 0,
      createdAt: new Date(),
      reportDate,
      origin,
      destination,
      cantidadM3,
      trips,
      hours,
      workSite,
      proveedor,
      kilometraje
    };

    enhancedAddReport(newReport);
  };

  const updateReport = (id: string, updatedReport: Partial<Report>) => {
    enhancedUpdateReport(id, updatedReport);
  };

  const deleteReport = (id: string) => {
    enhancedDeleteReport(id);
  };

  const getReportsByMachine = (machineId: string): Report[] => {
    return reports.filter(report => report.machineId === machineId);
  };

  const getTotalByType = (type: string): number => {
    return reports
      .filter(report => report.reportType === type)
      .reduce((total, report) => total + (report.value || 0), 0);
  };

  const getFilteredReports = (filters: any): Report[] => {
    let filtered = [...reports];
    
    if (filters.reportType && filters.reportType !== 'all') {
      filtered = filtered.filter(report => report.reportType === filters.reportType);
    }
    
    if (filters.machineId && filters.machineId !== 'all') {
      filtered = filtered.filter(report => report.machineId === filters.machineId);
    }

    if (filters.userId && filters.userId !== 'all') {
      filtered = filtered.filter(report => report.userId === filters.userId);
    }
    
    if (filters.startDate) {
      const startDate = new Date(filters.startDate);
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.reportDate);
        return reportDate >= startDate;
      });
    }
    
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.reportDate);
        return reportDate <= endDate;
      });
    }
    
    return filtered;
  };

  const value = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportsByMachine,
    getTotalByType,
    getFilteredReports,
  };

  return (
    <EnhancedReportContext.Provider value={value}>
      {children}
    </EnhancedReportContext.Provider>
  );
};
