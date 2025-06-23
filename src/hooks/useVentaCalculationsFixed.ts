
import { Venta } from '@/models/Ventas';

export const useVentaCalculationsFixed = () => {
  const calculateVentaTotal = (venta: Venta): number => {
    if (!venta.detalles || venta.detalles.length === 0) {
      console.log('⚠️ Venta sin detalles, total = 0');
      return 0;
    }

    const total = venta.detalles.reduce((acc, detalle) => {
      const subtotal = detalle.cantidad_m3 * detalle.valor_unitario;
      console.log(`Detalle: ${detalle.producto_servicio} - ${detalle.cantidad_m3} x ${detalle.valor_unitario} = ${subtotal}`);
      return acc + subtotal;
    }, 0);

    console.log(`💰 Total calculado para venta ${venta.id}: ${total}`);
    return total;
  };

  const recalculateAllVentaTotals = (ventas: Venta[]): Venta[] => {
    console.log('🔄 Recalculando totales de todas las ventas...');
    return ventas.map(venta => ({
      ...venta,
      total_venta: calculateVentaTotal(venta)
    }));
  };

  const updateVentaWithCalculatedTotal = (venta: Venta): Venta => {
    const updatedVenta = {
      ...venta,
      total_venta: calculateVentaTotal(venta)
    };
    
    // Actualizar subtotales de detalles también
    updatedVenta.detalles = venta.detalles.map(detalle => ({
      ...detalle,
      subtotal: detalle.cantidad_m3 * detalle.valor_unitario
    }));

    return updatedVenta;
  };

  return {
    calculateVentaTotal,
    recalculateAllVentaTotals,
    updateVentaWithCalculatedTotal
  };
};
