
import { Report } from '@/types/report';
import { 
  gestionarOperacionComercial, 
  marcarOperacionProcesada,
  extraerClienteDelDestino,
  esOperacionDesdeAcopio,
  esOperacionCompletaParaVenta,
  loadOperacionesComerciales
} from '@/models/OperacionesComerciales';

export const useOperacionesComerciales = () => {
  
  const registrarReporteEnOperacion = (report: Report): {
    debeGenerarVenta: boolean;
    esOperacionCompleta: boolean;
    operacionId: string;
  } => {
    // Solo procesar reportes de viajes que involucren clientes
    if (report.reportType !== 'Viajes' || !report.destination) {
      return { debeGenerarVenta: false, esOperacionCompleta: false, operacionId: '' };
    }

    const cliente = extraerClienteDelDestino(report.destination);
    if (!cliente) {
      return { debeGenerarVenta: false, esOperacionCompleta: false, operacionId: '' };
    }

    const material = report.description || 'Material';
    const esDesdeAcopio = esOperacionDesdeAcopio(report.origin);
    const cantidad = report.cantidadM3 || 0;
    
    console.log('=== PROCESANDO OPERACIÓN COMERCIAL ===');
    console.log('Cliente:', cliente, 'Material:', material, 'Desde Acopio:', esDesdeAcopio);
    console.log('Cantidad:', cantidad, 'Máquina:', report.machineName);
    
    // Gestionar la operación comercial
    const operacion = gestionarOperacionComercial(
      report.id,
      report.reportDate,
      cliente,
      material,
      esDesdeAcopio,
      cantidad
    );

    console.log('Operación gestionada:', operacion);

    // Verificar si la operación está completa para generar venta
    const operacionCompleta = esOperacionCompletaParaVenta(operacion);
    
    if (operacionCompleta) {
      console.log('→ Operación completa - generando venta');
      return { 
        debeGenerarVenta: true, 
        esOperacionCompleta: true, 
        operacionId: operacion.id 
      };
    }

    // Si no está completa, esperar más reportes
    console.log('→ Esperando reportes complementarios para operación completa');
    console.log('Reportes actuales:', operacion.reportes_asociados.length);
    
    return { 
      debeGenerarVenta: false, 
      esOperacionCompleta: false, 
      operacionId: operacion.id 
    };
  };

  const marcarVentaGenerada = (operacionId: string, ventaId: string) => {
    marcarOperacionProcesada(operacionId, ventaId);
    console.log('✓ Operación marcada como procesada:', operacionId);
  };

  const obtenerReportesDeOperacion = (operacionId: string): string[] => {
    const operaciones = loadOperacionesComerciales();
    const operacion = operaciones.find(op => op.id === operacionId);
    return operacion?.reportes_asociados || [];
  };

  const obtenerOperacionPorId = (operacionId: string) => {
    const operaciones = loadOperacionesComerciales();
    return operaciones.find(op => op.id === operacionId);
  };

  return {
    registrarReporteEnOperacion,
    marcarVentaGenerada,
    obtenerReportesDeOperacion,
    obtenerOperacionPorId
  };
};
