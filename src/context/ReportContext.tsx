import React, { createContext, useContext, ReactNode } from 'react';
import { Report, ReportType, ReportContextType } from '@/types/report';
import { extraerInfoProveedor } from '@/utils/proveedorUtils';
import { useReportOperations } from '@/hooks/useReportOperations';
import { useReportPersistence } from '@/hooks/useReportPersistence';
import { useReportAutoProcessing } from '@/hooks/useReportAutoProcessing';

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
  const { reports, saveReports, updateReport, deleteReport, getFilteredReports } = useReportPersistence();
  const { createReport, getReportsByMachine, getTotalByType } = useReportOperations();
  const { 
    processInventoryUpdate, 
    processAutomaticSales, 
    processEscombreraReport, 
    validateInventoryOperation 
  } = useReportAutoProcessing();

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
    console.log('🚛 Máquina:', machineName, '(ID:', machineId, ')');
    console.log('📋 Tipo:', reportType, 'Material:', description, 'Cantidad:', cantidadM3);
    console.log('📍 Origen:', origin, 'Destino:', destination);

    // Extraer información del proveedor si aplica
    const { proveedorId, proveedorNombre } = extraerInfoProveedor(origin || '');
    
    if (proveedorId) {
      console.log('🏭 Proveedor identificado:', proveedorNombre, '(ID:', proveedorId, ')');
    }

    // Validar inventario antes de crear el reporte
    if (!validateInventoryOperation(reportType, origin, destination, cantidadM3, description, machineName)) {
      return;
    }

    // Crear el reporte con información de proveedor mejorada
    console.log('📝 Creando reporte...');
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
    
    // Agregar información del proveedor al reporte
    if (proveedorId && proveedorNombre) {
      newReport.proveedorId = proveedorId;
      newReport.proveedorNombre = proveedorNombre;
      console.log('📋 Información de proveedor agregada al reporte');
    }
    
    console.log('✅ Reporte creado:', newReport);
    const updatedReports = [...reports, newReport];
    saveReports(updatedReports);

    // Procesar inventario
    processInventoryUpdate(newReport);

    // Procesar ventas automáticas
    processAutomaticSales(newReport);

    // Procesar escombrera
    processEscombreraReport(newReport);
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
