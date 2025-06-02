import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { actualizarInventarioPorViaje } from '@/utils/inventarioUtils';
import { findTarifaCliente } from '@/models/TarifasCliente';
import { calcularValorHorasTrabajadas, calcularValorViajes } from '@/utils/reportValueCalculator';

export type ReportType = 'Horas Trabajadas' | 'Horas Extras' | 'Combustible' | 'Mantenimiento' | 'Novedades' | 'Viajes';

export interface Report {
  id: string;
  machineId: string;
  machineName: string;
  userName: string;
  userId?: string;
  reportType: ReportType;
  description: string;
  value: number;
  createdAt: Date;
  reportDate: Date;
  origin?: string;
  destination?: string;
  cantidadM3?: number;
  trips?: number;
  hours?: number;
  workSite?: string;
  proveedor?: string;
  kilometraje?: number;
  detalleCalculo?: string; // Nuevo campo para mostrar cómo se calculó el valor
  tarifaEncontrada?: boolean; // Indica si se encontró tarifa para el cálculo
}

interface ReportContextType {
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
    cantidadM3?: number,
    proveedor?: string,
    kilometraje?: number
  ) => void;
  updateReport: (id: string, updatedReport: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportsByMachine: (machineId: string) => Report[];
  getTotalByType: (type: string) => number;
  getFilteredReports: (filters: any) => Report[];
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const useReport = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReport debe ser utilizado dentro de un ReportProvider');
  }
  return context;
};

// Keep useReports for backward compatibility
export const useReports = useReport;

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
    let calculatedValue = value || 0;
    let detalleCalculo = '';
    let tarifaEncontrada = false;

    // Calcular valor automáticamente basado en tarifas
    if (reportType === 'Horas Trabajadas' && workSite && hours) {
      const calculo = calcularValorHorasTrabajadas(
        workSite,
        undefined, // Por ahora no manejamos finca específica en horas trabajadas
        machineId,
        hours
      );
      calculatedValue = calculo.valorCalculado;
      detalleCalculo = calculo.detalleCalculo;
      tarifaEncontrada = calculo.tarifaEncontrada;
    }
    
    if (reportType === 'Viajes' && destination && origin && cantidadM3) {
      const calculo = calcularValorViajes(
        destination.split(' - ')[0] || '', // Cliente del destino
        destination.split(' - ')[1], // Finca del destino
        origin,
        destination,
        cantidadM3
      );
      calculatedValue = calculo.valorCalculado;
      detalleCalculo = calculo.detalleCalculo;
      tarifaEncontrada = calculo.tarifaEncontrada;
    }

    // Si no se pudo calcular automáticamente, usar valor manual si se proporcionó
    if (!tarifaEncontrada && value !== undefined) {
      calculatedValue = value;
      detalleCalculo = 'Valor ingresado manualmente';
    }

    const newReport: Report = {
      id: Date.now().toString(),
      machineId,
      machineName,
      userName: 'Current User', // This should come from auth context
      reportType,
      description,
      reportDate,
      createdAt: new Date(),
      value: calculatedValue,
      trips,
      hours,
      workSite,
      origin,
      destination,
      cantidadM3,
      proveedor,
      kilometraje,
      detalleCalculo,
      tarifaEncontrada,
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

    // Log para debugging
    console.log('Nuevo reporte creado:', {
      tipo: reportType,
      valor: calculatedValue,
      detalleCalculo,
      tarifaEncontrada
    });
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

  // Helper functions to extract cliente and finca from destination
  const extractClienteFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[0] || '';
  };

  const extractFincaFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[1] || '';
  };

  const getFilteredReports = (filters: any) => {
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

    // Filter by cliente
    if (filters.cliente && filters.cliente !== 'all') {
      filtered = filtered.filter(report => {
        const reportCliente = report.workSite || extractClienteFromDestination(report.destination);
        return reportCliente === filters.cliente;
      });
    }

    // Filter by finca
    if (filters.finca && filters.finca !== 'all') {
      filtered = filtered.filter(report => {
        const reportFinca = extractFincaFromDestination(report.destination);
        return reportFinca === filters.finca;
      });
    }
    
    if (filters.startDate) {
      filtered = filtered.filter(report => report.reportDate >= new Date(filters.startDate));
    }
    
    if (filters.endDate) {
      filtered = filtered.filter(report => report.reportDate <= new Date(filters.endDate));
    }
    
    return filtered;
  };

  const value: ReportContextType = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportsByMachine,
    getTotalByType,
    getFilteredReports,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};
