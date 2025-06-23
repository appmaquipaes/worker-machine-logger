
import { Report } from '@/types/report';
import { useVentaCreation } from '@/hooks/useVentaCreation';
import { useAutoVentas } from '@/hooks/useAutoVentas';
import { loadVentas } from '@/models/Ventas';
import { useDataPersistence } from '@/hooks/useDataPersistence';
import { toast } from "sonner";

export const useReportSalesProcessing = () => {
  const { crearVentaAutomatica } = useVentaCreation();
  const { procesarReporteParaVenta } = useAutoVentas();
  const { saveToLocalStorage } = useDataPersistence();

  const processSalesForReport = (report: Report) => {
    // NUEVA LÓGICA SIMPLIFICADA DE VENTAS AUTOMÁTICAS
    if (report.reportType === 'Viajes' && report.destination) {
      try {
        console.log('💼 Aplicando NUEVA LÓGICA SIMPLIFICADA de ventas...');
        
        const esCargador = report.machineName.toLowerCase().includes('cargador');
        const esVolqueta = report.machineName.toLowerCase().includes('volqueta') || 
                         report.machineName.toLowerCase().includes('camión');
        const origenEsAcopio = report.origin?.toLowerCase().includes('acopio') || false;
        
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
          generateAutomaticSale(report);
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

    // NUEVO: GENERAR VENTAS AUTOMÁTICAS PARA HORAS TRABAJADAS
    if (report.reportType === 'Horas Trabajadas' && report.workSite && report.hours) {
      try {
        console.log('⏰ Generando venta automática para HORAS TRABAJADAS...');
        generateAutomaticSale(report);
      } catch (error) {
        console.error('❌ Error generando venta para horas trabajadas:', error);
      }
    }

    // PROCESAR ESCOMBRERA (mantener funcionalidad existente)
    if (report.reportType === 'Recepción Escombrera') {
      console.log('🏗 Procesando recepción de escombrera...');
      const ventaGenerada = procesarReporteParaVenta(report);
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

  const generateAutomaticSale = (report: Report) => {
    console.log('💰 Generando venta automática...');
    const ventaAutomatica = crearVentaAutomatica(report);
    
    if (ventaAutomatica) {
      // ASEGURAR GUARDADO DE LA VENTA
      console.log('💾 Guardando venta en localStorage...');
      try {
        const ventasExistentes = loadVentas();
        console.log('📋 Ventas existentes cargadas:', ventasExistentes.length);
        
        const nuevasVentas = [...ventasExistentes, ventaAutomatica];
        console.log('📋 Nuevas ventas a guardar:', nuevasVentas.length);
        
        const guardadoExitoso = saveToLocalStorage('ventas', nuevasVentas);
        if (guardadoExitoso) {
          console.log('✅ Venta guardada exitosamente en localStorage');
          
          // Verificar que se guardó correctamente
          const ventasVerificacion = loadVentas();
          console.log('🔍 Verificación - Total ventas después de guardar:', ventasVerificacion.length);
          
          console.log('✓ Venta automática creada y guardada');
          toast.success('💰 Venta automática generada exitosamente', {
            duration: 4000,
            style: {
              fontSize: '14px',
              backgroundColor: '#059669',
              color: 'white'
            }
          });
        } else {
          console.error('❌ Error guardando venta en localStorage');
          toast.error('Error guardando la venta automática');
        }
      } catch (error) {
        console.error('❌ Error guardando venta:', error);
        toast.error('Error guardando la venta automática');
      }
    } else {
      console.log('⚠️ No se pudo crear la venta automática');
    }
  };

  return {
    processSalesForReport
  };
};
