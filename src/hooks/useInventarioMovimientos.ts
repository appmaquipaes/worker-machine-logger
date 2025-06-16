
import { useCallback } from 'react';
import { MovimientoInventario } from '@/types/inventario';

export const useInventarioMovimientos = () => {
  // Función para guardar movimientos en localStorage
  const saveMovimiento = useCallback((movimiento: MovimientoInventario): void => {
    const movimientos = JSON.parse(localStorage.getItem('movimientos_inventario') || '[]');
    movimientos.push(movimiento);
    localStorage.setItem('movimientos_inventario', JSON.stringify(movimientos));
  }, []);

  // Función para cargar movimientos desde localStorage
  const loadMovimientos = useCallback((): MovimientoInventario[] => {
    const movimientos = localStorage.getItem('movimientos_inventario');
    if (!movimientos) return [];
    
    return JSON.parse(movimientos).map((mov: any) => ({
      ...mov,
      fecha: new Date(mov.fecha)
    }));
  }, []);

  return {
    saveMovimiento,
    loadMovimientos
  };
};
