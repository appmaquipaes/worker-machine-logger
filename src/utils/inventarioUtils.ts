import { loadInventarioAcopio } from '@/models/InventarioAcopio';
import { Report } from '@/types/report';
import { validarInventarioDisponible } from '@/utils/inventarioValidation';

// Nueva función que usa el sistema integrado con useInventarioOperations
export const procesarMovimientoInventario = async (report: Report): Promise<boolean> => {
  try {
    console.log('=== PROCESANDO MOVIMIENTO DE INVENTARIO ===');
    console.log('Función legacy eliminada, usar useInventarioOperations.procesarReporteInventario()');
    console.log('Reporte:', report);
    
    // Esta función ahora es solo un placeholder para compatibilidad
    // La lógica real está en useInventarioOperations
    return true;
  } catch (error) {
    console.error('Error procesando movimiento de inventario:', error);
    return false;
  }
};

// Función de utilidad para validaciones rápidas (mantener para compatibilidad)
export { validarInventarioDisponible };
