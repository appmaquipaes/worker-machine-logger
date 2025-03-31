
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "@/components/ui/sonner";
import { Machine } from './MachineContext';

// Tipos para los reportes
export type ReportType = 'Horas Extras' | 'Horas Trabajadas' | 'Mantenimiento' | 'Combustible' | 'Novedades';

export type Report = {
  id: string;
  userId: string;
  userName: string;
  machineId: string;
  machineName: string;
  reportType: ReportType;
  description: string;
  createdAt: Date;
};

// Tipo para el contexto de reportes
type ReportContextType = {
  reports: Report[];
  addReport: (machineId: string, machineName: string, reportType: ReportType, description: string) => void;
  getFilteredReports: (filters: {
    userId?: string;
    machineId?: string;
    reportType?: ReportType;
  }) => Report[];
};

// Crear el contexto
const ReportContext = createContext<ReportContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport debe ser utilizado dentro de un ReportProvider');
  }
  return context;
};

// Proveedor del contexto de reportes
export const ReportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const { user } = useAuth();

  // Cargar reportes del almacenamiento local al iniciar
  useEffect(() => {
    const storedReports = localStorage.getItem('reports');
    if (storedReports) {
      // Convertir las fechas de string a Date
      const parsedReports = JSON.parse(storedReports).map((report: any) => ({
        ...report,
        createdAt: new Date(report.createdAt),
      }));
      setReports(parsedReports);
    }
  }, []);

  // Función para agregar un nuevo reporte
  const addReport = (machineId: string, machineName: string, reportType: ReportType, description: string) => {
    if (!user) {
      toast.error("Debe iniciar sesión para enviar reportes");
      return;
    }

    const newReport: Report = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      machineId,
      machineName,
      reportType,
      description,
      createdAt: new Date(),
    };

    const updatedReports = [...reports, newReport];
    setReports(updatedReports);
    localStorage.setItem('reports', JSON.stringify(updatedReports));
    toast.success("Reporte enviado correctamente");
  };

  // Función para obtener reportes filtrados
  const getFilteredReports = (filters: {
    userId?: string;
    machineId?: string;
    reportType?: ReportType;
  }) => {
    return reports.filter((report) => {
      if (filters.userId && report.userId !== filters.userId) return false;
      if (filters.machineId && report.machineId !== filters.machineId) return false;
      if (filters.reportType && report.reportType !== filters.reportType) return false;
      return true;
    });
  };

  const value = {
    reports,
    addReport,
    getFilteredReports,
  };

  return <ReportContext.Provider value={value}>{children}</ReportContext.Provider>;
};
