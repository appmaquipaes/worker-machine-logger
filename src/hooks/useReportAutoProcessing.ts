
import { Report } from '@/types/report';
import { useAutoVentas } from './useAutoVentas';
import { useInventarioOperations } from './useInventarioOperations';
import { useVentaCreation } from './useVentaCreation';
import { loadVentas, saveVentas } from '@/models/Ventas';
import { toast } from "sonner";

export const useReportAutoProcessing = () => {
  const { procesarReporteParaVenta } = useAutoVentas();
  const { procesarReporteInventario, validarOperacion } = useInventarioOperations();
  const { crearVentaAutomatica } = useVentaCreation();

  const processInventoryUpdate = (report: Report) => {
    if (report.reportType === 'Viajes' && (report.origin || report.destination)) {
      console.log('🏭 Iniciando procesamiento de inventario...');
      try {
        const resultadoInventario = procesarReporteInventario(report);
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
  };

  const processAutomaticSales = (report: Report) => {
    const tiposQueGeneranVenta = ['Viajes', 'Horas Trabajadas', 'Horas Extras'];
    
    if (tiposQueGeneranVenta.includes(report.reportType)) {
      try {
        console.log('💼 Evaluando generación de venta automática para:', report.reportType);
        
        let debeGenerarVenta = false;
        let razonDecision = '';
        
        if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
          if (report.workSite || report.destination) {
            debeGenerarVenta = true;
            razonDecision = `${report.reportType} - generar venta automática por horas`;
          } else {
            debeGenerarVenta = false;
            razonDecision = `${report.reportType} - falta información del cliente`;
          }
        } else if (report.reportType === 'Viajes' && report.destination) {
          const esCargador = report.machineName.toLowerCase().includes('cargador');
          const esVolquetaOCamion = report.machineName.toLowerCase().includes('volqueta') || 
                                   report.machineName.toLowerCase().includes('camión');
          const origenEsAcopio = report.origin?.toLowerCase().includes('acopio maquipaes') || false;
          
          console.log('📋 Análisis de máquina para nueva lógica:');
          console.log('- Es cargador:', esCargador);
          console.log('- Es volqueta/camión:', esVolquetaOCamion);
          console.log('- Origen es Acopio Maquipaes:', origenEsAcopio);
          
          if (esCargador) {
            debeGenerarVenta = true;
            razonDecision = 'Cargador - siempre genera venta automática';
          } else if (esVolquetaOCamion && origenEsAcopio) {
            debeGenerarVenta = false;
            razonDecision = 'Volqueta/Camión desde Acopio Maquipaes - NO generar venta (evitar duplicación)';
          } else if (esVolquetaOCamion && !origenEsAcopio) {
            debeGenerarVenta = true;
            razonDecision = 'Volqueta/Camión desde origen distinto a Acopio Maquipaes - generar venta automática';
          } else {
            debeGenerarVenta = true;
            razonDecision = 'Otra máquina con destino válido - generar venta automática';
          }
        }
        
        console.log('🎯 Decisión final:', debeGenerarVenta ? 'GENERAR VENTA' : 'NO GENERAR VENTA');
        console.log('📝 Razón:', razonDecision);
        
        if (debeGenerarVenta) {
          console.log('💰 Generando venta automática...');
          const ventaAutomatica = crearVentaAutomatica(report);
          
          if (ventaAutomatica) {
            console.log('💾 Guardando venta en localStorage...');
            try {
              const ventasExistentes = loadVentas();
              console.log('📋 Ventas existentes cargadas:', ventasExistentes.length);
              
              const ventaExistente = ventasExistentes.find(v => 
                v.cliente === ventaAutomatica.cliente &&
                new Date(v.fecha).toDateString() === new Date(ventaAutomatica.fecha).toDateString() &&
                v.observaciones?.includes('Venta automática') &&
                Math.abs(v.total_venta - ventaAutomatica.total_venta) < 100
              );

              if (ventaExistente) {
                console.log('⚠️ Venta similar ya existe, no se duplica:', ventaExistente);
                toast.info('ℹ️ Venta similar ya registrada, no se duplicó', {
                  duration: 3000
                });
              } else {
                const nuevasVentas = [...ventasExistentes, ventaAutomatica];
                console.log('📋 Nuevas ventas a guardar:', nuevasVentas.length);
                
                saveVentas(nuevasVentas);
                console.log('✅ Venta guardada exitosamente en localStorage');
                
                const ventasVerificacion = loadVentas();
                console.log('🔍 Verificación - Total ventas después de guardar:', ventasVerificacion.length);
                
                const ventaGuardada = ventasVerificacion.find(v => v.id === ventaAutomatica.id);
                if (ventaGuardada) {
                  console.log('✓ Venta automática creada y guardada exitosamente');
                  toast.success('💰 Venta automática generada y guardada exitosamente', {
                    duration: 5000,
                    style: {
                      fontSize: '14px',
                      backgroundColor: '#059669',
                      color: 'white'
                    }
                  });
                } else {
                  console.error('❌ Error: Venta no se encontró después del guardado');
                  toast.error('❌ Error guardando la venta automática');
                }
              }
            } catch (error) {
              console.error('❌ Error guardando venta:', error);
              toast.error('❌ Error guardando la venta automática');
            }
          } else {
            console.log('⚠️ No se pudo crear la venta automática');
            toast.warning('⚠️ No se pudo generar la venta automática - revisa los datos', {
              duration: 4000
            });
          }
        } else {
          console.log('ℹ️ Venta no generada por lógica de negocio');
          toast.info(`ℹ️ ${razonDecision}`, {
            duration: 3000,
            style: {
              fontSize: '14px'
            }
          });
        }
      } catch (error) {
        console.error('❌ Error procesando venta automática:', error);
        toast.error('❌ Error procesando venta automática: ' + error.message);
      }
    }
  };

  const processEscombreraReport = (report: Report) => {
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

  const validateInventoryOperation = (
    reportType: string,
    origin: string | undefined,
    destination: string | undefined,
    cantidadM3: number | undefined,
    description: string,
    machineName: string
  ): boolean => {
    if (reportType === 'Viajes' && origin && destination && cantidadM3 && description) {
      const esOrigenAcopio = origin.toLowerCase().includes('acopio');
      const esCargador = machineName.toLowerCase().includes('cargador');
      
      console.log('🔍 Validando inventario:');
      console.log('- Es origen acopio:', esOrigenAcopio);
      console.log('- Es cargador:', esCargador);
      console.log('- Origen original:', origin);
      
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
          return false;
        }
        console.log('✅ Validación de stock exitosa para cargador');
      } else if (esOrigenAcopio && !esCargador) {
        console.log('ℹ️ Volqueta desde acopio - sin validación de stock (no descuenta inventario)');
      }
    }
    return true;
  };

  return {
    processInventoryUpdate,
    processAutomaticSales,
    processEscombreraReport,
    validateInventoryOperation
  };
};
