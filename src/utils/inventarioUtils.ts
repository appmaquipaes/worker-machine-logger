
import { InventarioAcopio, loadInventarioAcopio, saveInventarioAcopio, updateInventarioAfterVenta } from '@/models/InventarioAcopio';

export const updateInventarioAfterViaje = (
  tipo_material: string,
  cantidad_m3: number
): boolean => {
  try {
    const inventario = loadInventarioAcopio();
    const inventarioActualizado = updateInventarioAfterVenta(inventario, {
      tipo_material,
      cantidad_m3
    });
    
    saveInventarioAcopio(inventarioActualizado);
    return true;
  } catch (error) {
    console.error('Error updating inventory after viaje:', error);
    return false;
  }
};

export const getMaterialesDisponibles = (): InventarioAcopio[] => {
  const inventario = loadInventarioAcopio();
  return inventario.filter(item => item.cantidad_disponible > 0);
};

export const verificarDisponibilidad = (tipo_material: string, cantidad_requerida: number): boolean => {
  const inventario = loadInventarioAcopio();
  const material = inventario.find(item => item.tipo_material === tipo_material);
  return material ? material.cantidad_disponible >= cantidad_requerida : false;
};
