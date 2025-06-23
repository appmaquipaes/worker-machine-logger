import React, { createContext, useContext, ReactNode } from 'react';
import { Report, ReportType, ReportContextType } from '@/types/report';
import { filterReports } from '@/utils/reportUtils';
import { extraerInfoProveedor } from '@/utils/proveedorUtils';
import { useReportOperations } from '@/hooks/useReportOperations';
import { useInventarioOperations } from '@/hooks/useInventarioOperations';
import { useReportPersistence } from '@/hooks/useReportPersistence';
import { useReportInventoryProcessing } from '@/hooks/useReportInventoryProcessing';
import { useReportSalesProcessing } from '@/hooks/useReportSalesProcessing';
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
  const { createReport, getReportsByMachine, getTotalByType } = useReportOperations();
  const { validarOperacion } = useInventarioOperations();
  const { reports, saveReports, updateReport, deleteReport } = useReportPersistence();
  const { processInventoryForReport } = useReportInventoryProcessing();
  const { processSalesForReport } = useReportSalesProcessing();

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

    // VALIDACIÓN DE INVENTARIO MEJORADA: Solo para cargadores
    if (reportType === 'Viajes' && origin && destination && cantidadM3 && description) {
      const esOrigenAcopio = origin.toLowerCase().includes('acopio');
      const esCargador = machineName.toLowerCase().includes('cargador');
      
      console.log('🔍 Validando inventario:');
      console.log('- Es origen acopio:', esOrigenAcopio);
      console.log('- Es cargador:', esCargador);
      console.log('- Origen original:', origin);
      
      // Solo validar stock si es cargador saliendo del acopio
      if (esOrigenAcopio && esCargador) {
        console.log('→ Validando stock para cargador saliendo del acopio');
        const validacion = validarOperacion(description, cantidadM3, 'salida');
        if (!validacion.esValida) {
          console.log('❌ Validación de stock fallida:', validacion.mensaje);
          toast.error(`❌ ${validacion.mensaje}`, {
            duration: 6000,
            style: {
              fontSize: '16px',
              fontWeight: 'bold',
            }
          });
          return;
        }
        console.log('✅ Validación de stock exitosa para cargador');
      } else if (esOrigenAcopio && !esCargador) {
        console.log('ℹ️ Volqueta desde acopio - sin validación de stock (no descuenta inventario)');
      }
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

    // PROCESAR INVENTARIO PRIMERO (para todas las máquinas)
    processInventoryForReport(newReport);

    // PROCESAR VENTAS AUTOMÁTICAS
    processSalesForReport(newReport);
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
