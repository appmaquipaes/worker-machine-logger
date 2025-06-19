import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Report, ReportType, ReportContextType } from '@/types/report';
import { parseStoredReports, filterReports } from '@/utils/reportUtils';
import { useReportOperations } from '@/hooks/useReportOperations';
import { useAutoVentas } from '@/hooks/useAutoVentas';
import { useInventarioOperations } from '@/hooks/useInventarioOperations';
import { toast } from "sonner";

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
  const { createReport, getReportsByMachine, getTotalByType } = useReportOperations();
  const { procesarReporteParaVenta } = useAutoVentas();
  const { procesarReporteInventario, validarOperacion } = useInventarioOperations();

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
    console.log('=== INICIANDO PROCESO DE CREACIÓN DE REPORTE ===');
    console.log('Tipo:', reportType, 'Material:', description, 'Cantidad:', cantidadM3);

    // Solo validar inventario sin procesarlo aquí
    if (reportType === 'Viajes' && origin && destination && cantidadM3 && description) {
      const tempReport: Report = {
        id: 'temp',
        machineId,
        machineName,
        userName: 'Current User',
        reportType,
        description,
        reportDate,
        createdAt: new Date(),
        value: 0,
        origin,
        destination,
        cantidadM3
      };

      // Solo validar, no procesar todavía
      const validacion = validarOperacion(description, cantidadM3, 'salida');
      if (!validacion.esValida) {
        toast.error(`❌ ${validacion.mensaje}`, {
          duration: 6000,
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
          }
        });
        return;
      }
    }

    // Crear el reporte
    const newReport = createReport(
      reports,
      machineId,
      machineName,
      reportType,
      description,
      reportDate,
      trips,
      hours,
      value,
      workSite,
      origin,
      destination,
      cantidadM3,
      proveedor,
      kilometraje
    );
    
    const updatedReports = [...reports, newReport];
    saveReports(updatedReports);

    // Ahora SÍ procesar para inventario si es un viaje (una sola vez)
    if (newReport.reportType === 'Viajes') {
      try {
        console.log('→ Procesando inventario para reporte:', newReport.id);
        const resultadoInventario = procesarReporteInventario(newReport);
        if (resultadoInventario.exito) {
          console.log('✓ Inventario actualizado exitosamente');
          toast.success(`✅ Inventario actualizado: ${resultadoInventario.mensaje}`, {
            duration: 4000,
            style: {
              fontSize: '14px',
              backgroundColor: '#22c55e',
              color: 'white'
            }
          });
        } else {
          console.log('⚠ No se procesó inventario:', resultadoInventario.mensaje);
        }
      } catch (error) {
        console.error('Error procesando inventario:', error);
      }
    }

    // Procesar para ventas automáticas si es un viaje a cliente
    if (newReport.reportType === 'Viajes' && newReport.destination) {
      try {
        procesarReporteParaVenta(newReport);
      } catch (error) {
        console.error('Error procesando reporte para venta automática:', error);
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

  const getFilteredReports = (filters: any) => {
    return filterReports(reports, filters);
  };

  const value: ReportContextType = {
    reports,
    addReport,
    updateReport,
    deleteReport,
    getReportsByMachine: (machineId: string) => getReportsByMachine(reports, machineId),
    getTotalByType: (type: string) => getTotalByType(reports, type),
    getFilteredReports,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
};
