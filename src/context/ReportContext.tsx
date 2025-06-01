
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { actualizarInventarioPorViaje } from '@/utils/inventarioUtils';

export interface Report {
  id: string;
  machineId: string;
  userName: string;
  reportType: 'Viajes' | 'Combustible' | 'Lubricantes' | 'Mantenimiento' | 'Otros';
  description: string;
  value: number;
  createdAt: Date;
  reportDate: Date;
  origin?: string;
  destination?: string;
  cantidadM3?: number;
}

interface ReportContextType {
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  updateReport: (id: string, updatedReport: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportsByMachine: (machineId: string) => Report[];
  getTotalByType: (type: string) => number;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
};

interface ReportProviderProps {
  children: ReactNode;
}

export const ReportProvider: React.FC<ReportProviderProps> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      const parsedReports = JSON.parse(storedReports).map((report: any) => ({
        ...report,
        createdAt: new Date(report.createdAt),
        reportDate: report.reportDate ? new Date(report.reportDate) : new Date(report.createdAt),
      }));
      setReports(parsedReports);
    }
  }, []);

  const saveReports = (newReports: Report[]) => {
    setReports(newReports);
    localStorage.setItem('reports', JSON.stringify(newReports));
  };

  const addReport = (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    
    const updatedReports = [...reports, newReport];
    saveReports(updatedReports);
    
    // Actualizar inventario si es un viaje desde acopio
    if (newReport.reportType === 'Viajes') {
      const inventarioActualizado = actualizarInventarioPorViaje(newReport);
      if (inventarioActualizado) {
        console.log('Inventario de acopio actualizado por nuevo viaje');
      }
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

  const getReportsByMachine = (machineId: string) => {
    return reports.filter(report => report.machineId === machineId);
  };

  const getTotalByType = (type: string) => {
    return reports
      .filter(report => report.reportType === type)
      .reduce((total, report) => total + report.value, 0);
  };

  const value: ReportContextType = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportsByMachine,
    getTotalByType,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};
