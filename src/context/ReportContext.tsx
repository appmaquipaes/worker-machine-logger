
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Report, ReportType, ReportContextType } from '@/types/report';
import { parseStoredReports, filterReports } from '@/utils/reportUtils';
import { extraerInfoProveedor } from '@/utils/proveedorUtils';
import { useReportOperations } from '@/hooks/useReportOperations';
import { useAutoVentas } from '@/hooks/useAutoVentas';
import { useInventarioOperations } from '@/hooks/useInventarioOperations';
import { useOperacionesComerciales } from '@/hooks/useOperacionesComerciales';
import { useVentaCreationEnhanced } from '@/hooks/useVentaCreationEnhanced';
import { loadVentas, saveVentas } from '@/models/Ventas';
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
  const { registrarReporteEnOperacion, marcarVentaGenerada } = useOperacionesComerciales();
  const { crearVentaDesdeOperacion } = useVentaCreationEnhanced();

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
    console.log('🚛 Máquina:', machineName, '(ID:', machineId, ')');
    console.log('📋 Tipo:', reportType, 'Material:', description, 'Cantidad:', cantidadM3);
    console.log('📍 Origen:', origin, 'Destino:', destination);

    // Extraer información del proveedor si aplica
    const { proveedorId, proveedorNombre } = extraerInfoProveedor(origin || '');
    
    if (proveedorId) {
      console.log('🏭 Proveedor identificado:', proveedorNombre, '(ID:', proveedorId, ')');
    }

    // Solo validar inventario para viajes con cantidad y desde acopio
    if (reportType === 'Viajes' && origin && destination && cantidadM3 && description) {
      const esOrigenAcopio = origin.toLowerCase().includes('acopio');
      
      console.log('🔍 Validando inventario:');
      console.log('- Es origen acopio:', esOrigenAcopio);
      console.log('- Origen original:', origin);
      
      if (esOrigenAcopio) {
        console.log('→ Validando stock para salida desde acopio');
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
        console.log('✅ Validación de stock exitosa');
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
    if (newReport.reportType === 'Viajes' && (newReport.origin || newReport.destination)) {
      console.log('🏭 Iniciando procesamiento de inventario...');
      try {
        const resultadoInventario = procesarReporteInventario(newReport);
        console.log('📊 Resultado procesamiento inventario:', resultadoInventario);
        
        if (resultadoInventario.exito) {
          console.log('✅ Inventario actualizado exitosamente');
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
        console.error('❌ Error procesando inventario:', error);
      }
    }

    // SISTEMA DE OPERACIONES COMERCIALES (NUEVO - para evitar duplicación de ventas)
    if (newReport.reportType === 'Viajes' && newReport.destination) {
      try {
        console.log('💼 Procesando operación comercial...');
        const resultadoOperacion = registrarReporteEnOperacion(newReport);
        
        if (resultadoOperacion.debeGenerarVenta) {
          console.log('💰 Generando venta automática...');
          const ventaAutomatica = crearVentaDesdeOperacion(newReport, resultadoOperacion.operacionId);
          
          if (ventaAutomatica) {
            // Guardar la venta
            const ventasExistentes = loadVentas();
            const nuevasVentas = [...ventasExistentes, ventaAutomatica];
            saveVentas(nuevasVentas);
            
            // Marcar operación como procesada
            marcarVentaGenerada(resultadoOperacion.operacionId, ventaAutomatica.id);
            
            console.log('✓ Venta automática creada y guardada');
            toast.success('💰 Venta automática generada exitosamente', {
              duration: 4000,
              style: {
                fontSize: '14px',
                backgroundColor: '#059669',
                color: 'white'
              }
            });
          }
        } else if (!resultadoOperacion.esOperacionCompleta) {
          console.log('⏳ Operación registrada - esperando reportes complementarios');
          toast.info('⏳ Operación registrada - esperando reporte complementario', {
            duration: 3000,
            style: {
              fontSize: '14px'
            }
          });
        }
      } catch (error) {
        console.error('Error procesando operación comercial:', error);
      }
    }

    // PROCESAR ESCOMBRERA (mantener funcionalidad existente)
    if (newReport.reportType === 'Recepción Escombrera') {
      console.log('🏗 Procesando recepción de escombrera...');
      const ventaGenerada = procesarReporteParaVenta(newReport);
      if (ventaGenerada) {
        toast.success('💰 Venta de escombrera generada', {
          duration: 3000,
          style: {
            fontSize: '14px',
            backgroundColor: '#059669',
            color: 'white'
          }
        });
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
