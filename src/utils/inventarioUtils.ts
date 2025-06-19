import { loadInventarioAcopio, updateInventarioAfterViaje, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { Report } from '@/types/report';
import { isAcopio } from '@/constants/inventario';

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
export const validarInventarioDisponible = (material: string, cantidad: number) => {
  const inventario = loadInventarioAcopio();
  const materialEncontrado = inventario.find(item => item.tipo_material === material);
  
  if (!materialEncontrado) {
    return { esValido: false, mensaje: `Material "${material}" no encontrado en inventario` };
  }
  
  if (materialEncontrado.cantidad_disponible < cantidad) {
    return { 
      esValido: false, 
      mensaje: `Stock insuficiente. Disponible: ${materialEncontrado.cantidad_disponible} m³, Solicitado: ${cantidad} m³` 
    };
  }
  
  return { esValido: true, mensaje: 'Stock disponible' };
};
