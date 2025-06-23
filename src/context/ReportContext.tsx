import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Report, ReportType, ReportContextType } from '@/types/report';
import { parseStoredReports, filterReports } from '@/utils/reportUtils';
import { extraerInfoProveedor } from '@/utils/proveedorUtils';
import { useReportOperations } from '@/hooks/useReportOperations';
import { useAutoVentas } from '@/hooks/useAutoVentas';
import { useInventarioOperations } from '@/hooks/useInventarioOperations';
import { useVentaCreation } from '@/hooks/useVentaCreation';
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
  const { crearVentaAutomatica } = useVentaCreation();

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

    // NUEVA LÓGICA SIMPLIFICADA DE VENTAS
    if (newReport.reportType === 'Viajes' && newReport.destination) {
      try {
        console.log('💼 Aplicando NUEVA LÓGICA SIMPLIFICADA de ventas...');
        
        const esCargador = newReport.machineName.toLowerCase().includes('cargador');
        const esVolqueta = newReport.machineName.toLowerCase().includes('volqueta') || 
                         newReport.machineName.toLowerCase().includes('camión');
        const origenEsAcopio = newReport.origin?.toLowerCase().includes('acopio') || false;
        
        console.log('📋 Análisis de máquina:');
        console.log('- Es cargador:', esCargador);
        console.log('- Es volqueta/camión:', esVolqueta);
        console.log('- Origen es acopio:', origenEsAcopio);
        
        let debeGenerarVenta = false;
        let razonDecision = '';
        
        // REGLAS SIMPLIFICADAS:
        if (esCargador) {
          // CARGADORES: SIEMPRE generan venta
          debeGenerarVenta = true;
          razonDecision = 'Cargador SIEMPRE genera venta (nueva lógica simplificada)';
        } else if (esVolqueta && !origenEsAcopio) {
          // VOLQUETAS: Solo si NO vienen del acopio
          debeGenerarVenta = true;
          razonDecision = 'Volqueta desde origen DISTINTO al acopio - genera venta';
        } else if (esVolqueta && origenEsAcopio) {
          // VOLQUETAS desde acopio: NO generar venta
          debeGenerarVenta = false;
          razonDecision = 'Volqueta desde acopio - NO generar venta (nueva lógica simplificada)';
        } else {
          // Otras máquinas: mantener lógica actual
          debeGenerarVenta = true;
          razonDecision = 'Otra máquina - generar venta';
        }
        
        console.log('🎯 DECISIÓN FINAL (LÓGICA SIMPLIFICADA):', debeGenerarVenta ? 'GENERAR VENTA' : 'NO GENERAR VENTA');
        console.log('📝 Razón:', razonDecision);
        
        if (debeGenerarVenta) {
          console.log('💰 Generando venta automática con nueva lógica...');
          const ventaAutomatica = crearVentaAutomatica(newReport);
          
          if (ventaAutomatica) {
            // ASEGURAR GUARDADO DE LA VENTA
            console.log('💾 Guardando venta en localStorage...');
            try {
              const ventasExistentes = loadVentas();
              console.log('📋 Ventas existentes cargadas:', ventasExistentes.length);
              
              const nuevasVentas = [...ventasExistentes, ventaAutomatica];
              console.log('📋 Nuevas ventas a guardar:', nuevasVentas.length);
              
              saveVentas(nuevasVentas);
              console.log('✅ Venta guardada exitosamente en localStorage');
              
              // Verificar que se guardó correctamente
              const ventasVerificacion = loadVentas();
              console.log('🔍 Verificación - Total ventas después de guardar:', ventasVerificacion.length);
              
              console.log('✓ Venta automática creada y guardada con NUEVA LÓGICA SIMPLIFICADA');
              toast.success('💰 Venta automática generada exitosamente (Lógica Simplificada)', {
                duration: 4000,
                style: {
                  fontSize: '14px',
                  backgroundColor: '#059669',
                  color: 'white'
                }
              });
            } catch (error) {
              console.error('❌ Error guardando venta:', error);
              toast.error('Error guardando la venta automática');
            }
          } else {
            console.log('⚠️ No se pudo crear la venta automática');
          }
        } else {
          console.log('ℹ️ Venta NO generada por nueva lógica simplificada');
          toast.info(`ℹ️ ${razonDecision}`, {
            duration: 3000,
            style: {
              fontSize: '14px'
            }
          });
        }
      } catch (error) {
        console.error('Error procesando venta automática:', error);
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
