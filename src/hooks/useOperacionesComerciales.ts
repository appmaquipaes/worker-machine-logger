
import { Report } from '@/types/report';
import { 
  gestionarOperacionComercial, 
  marcarOperacionProcesada,
  extraerClienteDelDestino,
  esOperacionDesdeAcopio,
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
    
    console.log('=== PROCESANDO OPERACIÓN COMERCIAL ===');
    console.log('Cliente:', cliente, 'Material:', material, 'Desde Acopio:', esDesdeAcopio);
    
    // Gestionar la operación comercial
    const operacion = gestionarOperacionComercial(
      report.id,
      report.reportDate,
      cliente,
      material,
      esDesdeAcopio
    );

    console.log('Operación gestionada:', operacion);

    // Si NO es desde Acopio (cantera/proveedor), generar venta inmediatamente
    if (!esDesdeAcopio) {
      console.log('→ Operación desde cantera/proveedor - generando venta inmediata');
      return { 
        debeGenerarVenta: true, 
        esOperacionCompleta: true, 
        operacionId: operacion.id 
      };
    }

    // Si es desde Acopio, verificar si ya se generó la venta
    if (operacion.venta_generada) {
      console.log('→ Ya se generó venta para esta operación');
      return { 
        debeGenerarVenta: false, 
        esOperacionCompleta: true, 
        operacionId: operacion.id 
      };
    }

    // Si es desde Acopio y tenemos 2 reportes (Cargador + Volqueta), generar venta completa
    if (operacion.reportes_asociados.length >= 2) {
      console.log('→ Operación completa (Cargador + Volqueta) - generando venta');
      return { 
        debeGenerarVenta: true, 
        esOperacionCompleta: true, 
        operacionId: operacion.id 
      };
    }

    // Si solo tenemos 1 reporte, esperar al segundo
    console.log('→ Esperando reporte complementario para operación completa');
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

  return {
    registrarReporteEnOperacion,
    marcarVentaGenerada,
    obtenerReportesDeOperacion
  };
};
