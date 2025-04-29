
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "sonner";
import { Machine } from './MachineContext';
import { loadTarifas } from '../models/Tarifas';

// Tipos para los reportes
export type ReportType = 'Horas Extras' | 'Horas Trabajadas' | 'Mantenimiento' | 'Combustible' | 'Novedades' | 'Viajes';

export type Report = {
  id: string;
  userId: string;
  userName: string;
  machineId: string;
  machineName: string;
  reportType: ReportType;
  description: string;
  createdAt: Date;
  reportDate: Date; // Fecha del reporte que puede ser diferente a la fecha de creación
  trips?: number; // Campo opcional para número de viajes
  hours?: number; // Campo opcional para número de horas
  value?: number; // This can now represent fuel or maintenance value or viaje total value
  workSite?: string; // Campo opcional para el sitio de trabajo
  origin?: string; // Campo opcional para el origen del viaje
  destination?: string; // Campo opcional para el destino del viaje
  cantidadM3?: number; // Nueva: cantidad en m³ para viajes de volqueta
};

// Tipo para el contexto de reportes
type ReportContextType = {
  reports: Report[];
  addReport: (
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
    cantidadM3?: number
  ) => void;
  getFilteredReports: (filters: {
    userId?: string;
    machineId?: string;
    reportType?: ReportType;
    startDate?: Date;
    endDate?: Date;
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
        reportDate: report.reportDate ? new Date(report.reportDate) : new Date(report.createdAt),
      }));
      setReports(parsedReports);
    }
  }, []);

  // Función para agregar un nuevo reporte
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
    cantidadM3?: number
  ) => {
    if (!user) {
      toast.error("Debe iniciar sesión para enviar reportes");
      return;
    }

    // Para reportes de viajes, calcular el valor total basado en la tarifa y m³
    let reportValue = value;
    
    if (reportType === 'Viajes' && origin && destination && cantidadM3) {
      // Buscar la tarifa correspondiente
      const tarifas = loadTarifas();
      const tarifa = tarifas.find(t => 
        t.origen.toLowerCase() === origin.toLowerCase() && 
        t.destino.toLowerCase() === destination.toLowerCase()
      );
      
      if (tarifa) {
        // Calcular valor_flete_total = valor_por_m3 × m³
        reportValue = tarifa.valor_por_m3 * cantidadM3;
      }
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
      reportDate: reportDate,
      ...(trips !== undefined && { trips }),
      ...(hours !== undefined && { hours }),
      ...(reportValue !== undefined && { value: reportValue }),
      ...(workSite !== undefined && { workSite }),
      ...(origin !== undefined && { origin }),
      ...(destination !== undefined && { destination }),
      ...(cantidadM3 !== undefined && { cantidadM3 }),
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
    startDate?: Date;
    endDate?: Date;
  }) => {
    return reports.filter((report) => {
      if (filters.userId && report.userId !== filters.userId) return false;
      if (filters.machineId && report.machineId !== filters.machineId) return false;
      if (filters.reportType && report.reportType !== filters.reportType) return false;
      if (filters.startDate && report.reportDate < filters.startDate) return false;
      if (filters.endDate) {
        // Ajustar la fecha de fin para incluir todo el día
        const endDateAdjusted = new Date(filters.endDate);
        endDateAdjusted.setHours(23, 59, 59, 999);
        if (report.reportDate > endDateAdjusted) return false;
      }
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
