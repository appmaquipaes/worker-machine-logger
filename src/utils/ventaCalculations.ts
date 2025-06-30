
import { Venta, DetalleVenta } from '@/types/venta';

// Función para calcular el total de una venta
export const calculateVentaTotal = (detalles: DetalleVenta[]): number => {
  return detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
};

// Función para actualizar el total de una venta
export const updateVentaTotal = (venta: Venta): Venta => {
  return {
    ...venta,
    total_venta: calculateVentaTotal(venta.detalles)
  };
};
