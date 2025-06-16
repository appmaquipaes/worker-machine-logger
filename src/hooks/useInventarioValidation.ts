
import { useCallback } from 'react';
import { TipoMovimientoInventario, ValidacionInventario } from '@/types/inventario';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';
import { MACHINE_INVENTORY_CONFIG } from '@/constants/inventario';

export const useInventarioValidation = () => {
  const validarOperacion = useCallback((
    material: string,
    cantidad: number,
    tipo: TipoMovimientoInventario,
    maquinaTipo?: string
  ): ValidacionInventario => {
    const inventario = loadInventarioAcopio();
    
    if (cantidad <= 0) {
      return { esValida: false, mensaje: 'La cantidad debe ser mayor a 0' };
    }

    // Para salidas, verificar stock disponible
    if (tipo === 'salida') {
      const materialInventario = inventario.find(item => item.tipo_material === material);
      
      if (!materialInventario) {
        return { 
          esValida: false, 
          mensaje: `El material "${material}" no existe en el inventario`,
          cantidadDisponible: 0
        };
      }

      if (materialInventario.cantidad_disponible < cantidad) {
        return { 
          esValida: false, 
          mensaje: `Stock insuficiente. Disponible: ${materialInventario.cantidad_disponible} m³`,
          cantidadDisponible: materialInventario.cantidad_disponible
        };
      }
    }

    // Validar configuración de máquina
    if (maquinaTipo && MACHINE_INVENTORY_CONFIG[maquinaTipo as keyof typeof MACHINE_INVENTORY_CONFIG]) {
      const config = MACHINE_INVENTORY_CONFIG[maquinaTipo as keyof typeof MACHINE_INVENTORY_CONFIG];
      
      if (tipo === 'entrada' && !config.canEnter) {
        return { 
          esValida: false, 
          mensaje: `Las máquinas tipo "${maquinaTipo}" no pueden realizar entradas al inventario`
        };
      }

      if (tipo === 'salida' && !config.canExit) {
        return { 
          esValida: false, 
          mensaje: `Las máquinas tipo "${maquinaTipo}" no pueden realizar salidas del inventario`
        };
      }
    }

    return { esValida: true };
  }, []);

  return { validarOperacion };
};
