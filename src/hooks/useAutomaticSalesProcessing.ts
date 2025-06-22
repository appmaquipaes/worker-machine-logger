
import { Report } from '@/types/report';
import { useVentaCreation } from './useVentaCreation';
import { loadVentas, saveVentas } from '@/models/Ventas';
import { toast } from "sonner";

export const useAutomaticSalesProcessing = () => {
  const { crearVentaAutomatica } = useVentaCreation();

  const processAutomaticSales = (report: Report) => {
    const tiposQueGeneranVenta = ['Viajes', 'Horas Trabajadas', 'Horas Extras'];
    
    if (tiposQueGeneranVenta.includes(report.reportType)) {
      try {
        console.log('💼 Evaluando generación de venta automática para:', report.reportType);
        console.log('📋 Datos del reporte completos:', {
          tipo: report.reportType,
          maquina: report.machineName,
          origen: report.origin,
          destino: report.destination,
          descripcion: report.description,
          cantidad: report.cantidadM3,
          valor: report.value,
          proveedor: report.proveedorNombre,
          proveedorId: report.proveedorId
        });
        
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
          
          console.log('📋 Análisis de máquina para lógica de ventas:');
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
            console.log('📋 Venta generada exitosamente:', {
              id: ventaAutomatica.id,
              cliente: ventaAutomatica.cliente,
              tipo: ventaAutomatica.tipo_venta,
              total: ventaAutomatica.total_venta,
              detalles: ventaAutomatica.detalles.length
            });
            
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
              toast.error('❌ Error guardando la venta automática: ' + error.message);
            }
          } else {
            console.log('⚠️ No se pudo crear la venta automática');
            console.log('💡 Posibles causas:');
            console.log('- Cliente no encontrado en base de datos');
            console.log('- Falta información de precios/tarifas');
            console.log('- Error en validación de datos');
            
            toast.warning('⚠️ No se pudo generar la venta automática - revisa que el cliente exista y tenga tarifas configuradas', {
              duration: 6000
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
        console.error('📋 Stack trace:', error.stack);
        toast.error('❌ Error procesando venta automática: ' + error.message);
      }
    }
  };

  return {
    processAutomaticSales
  };
};
