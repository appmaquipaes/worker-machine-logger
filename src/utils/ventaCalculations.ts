
import { Venta, DetalleVenta } from '@/types/venta';

// Función para calcular el total de una venta - CORREGIDA
export const calculateVentaTotal = (detalles: DetalleVenta[]): number => {
  if (!detalles || detalles.length === 0) {
    console.log('⚠️ No hay detalles para calcular');
    return 0;
  }

  console.log('💰 Calculando total de venta con', detalles.length, 'detalles:');
  
  const total = detalles.reduce((acumulado, detalle, index) => {
    // Recalcular subtotal para asegurar precisión
    const subtotalCalculado = detalle.cantidad_m3 * detalle.valor_unitario;
    
    console.log(`📋 Detalle ${index + 1}:`, {
      producto: detalle.producto_servicio,
      cantidad: detalle.cantidad_m3,
      valorUnitario: detalle.valor_unitario,
      subtotalOriginal: detalle.subtotal,
      subtotalCalculado: subtotalCalculado,
      sonIguales: detalle.subtotal === subtotalCalculado
    });
    
    // Usar el subtotal calculado para mayor precisión
    return acumulado + subtotalCalculado;
  }, 0);

  console.log('🎯 Total final calculado:', total);
  return total;
};

// Función para actualizar el total de una venta - CORREGIDA
export const updateVentaTotal = (venta: Venta): Venta => {
  console.log('🔄 Actualizando total de venta:', venta.id);
  
  // Recalcular subtotales de todos los detalles
  const detallesActualizados = venta.detalles.map(detalle => ({
    ...detalle,
    subtotal: detalle.cantidad_m3 * detalle.valor_unitario
  }));
  
  const nuevoTotal = calculateVentaTotal(detallesActualizados);
  
  console.log('📊 Venta actualizada:', {
    ventaId: venta.id,
    totalAnterior: venta.total_venta,
    totalNuevo: nuevoTotal,
    detalles: detallesActualizados.length
  });

  return {
    ...venta,
    detalles: detallesActualizados,
    total_venta: nuevoTotal
  };
};
