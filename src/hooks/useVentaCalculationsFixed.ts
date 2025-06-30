
import { Venta } from '@/models/Ventas';

export const useVentaCalculationsFixed = () => {
  const calculateVentaTotal = (venta: Venta): number => {
    if (!venta.detalles || venta.detalles.length === 0) {
      console.log('⚠️ Venta sin detalles, total = 0');
      return 0;
    }

    console.log('💰 Calculando total para venta:', venta.id);
    console.log('📋 Detalles a procesar:', venta.detalles.length);

    const total = venta.detalles.reduce((acc, detalle, index) => {
      // CORRECCIÓN: Recalcular subtotal para asegurar consistencia  
      const subtotalCalculado = detalle.cantidad_m3 * detalle.valor_unitario;
      
      console.log(`💡 Detalle ${index + 1}: ${detalle.producto_servicio}`);
      console.log(`   - Cantidad: ${detalle.cantidad_m3}`);
      console.log(`   - Valor unitario: ${detalle.valor_unitario}`);
      console.log(`   - Subtotal original: ${detalle.subtotal}`);
      console.log(`   - Subtotal calculado: ${subtotalCalculado}`);
      console.log(`   - Cálculo: ${detalle.cantidad_m3} × ${detalle.valor_unitario} = ${subtotalCalculado}`);
      
      return acc + subtotalCalculado;
    }, 0);

    console.log(`💰 Total calculado para venta ${venta.id}: ${total}`);
    return total;
  };

  const recalculateAllVentaTotals = (ventas: Venta[]): Venta[] => {
    console.log('🔄 Recalculando totales de todas las ventas...');
    return ventas.map((venta, index) => {
      console.log(`🔍 Procesando venta ${index + 1}/${ventas.length}: ${venta.id}`);
      
      const nuevoTotal = calculateVentaTotal(venta);
      
      // Actualizar también los subtotales de los detalles
      const detallesActualizados = venta.detalles.map(detalle => {
        const subtotalCorregido = detalle.cantidad_m3 * detalle.valor_unitario;
        return {
          ...detalle,
          subtotal: subtotalCorregido
        };
      });

      console.log(`✅ Venta ${venta.id} actualizada: ${venta.total_venta} → ${nuevoTotal}`);

      return {
        ...venta,
        detalles: detallesActualizados,
        total_venta: nuevoTotal
      };
    });
  };

  const updateVentaWithCalculatedTotal = (venta: Venta): Venta => {
    console.log('🎯 Actualizando venta con total calculado:', venta.id);
    
    // Actualizar subtotales de detalles primero
    const detallesCorregidos = venta.detalles.map(detalle => {
      const subtotalCorregido = detalle.cantidad_m3 * detalle.valor_unitario;
      console.log(`🔧 Corrigiendo detalle:`, {
        producto: detalle.producto_servicio,
        cantidad: detalle.cantidad_m3,
        valorUnitario: detalle.valor_unitario,
        subtotalAnterior: detalle.subtotal,
        subtotalNuevo: subtotalCorregido
      });
      
      return {
        ...detalle,
        subtotal: subtotalCorregido
      };
    });

    const ventaConDetallesCorregidos = {
      ...venta,
      detalles: detallesCorregidos
    };

    const totalCalculado = calculateVentaTotal(ventaConDetallesCorregidos);
    
    const ventaFinal = {
      ...ventaConDetallesCorregidos,
      total_venta: totalCalculado
    };

    console.log('✅ Venta final actualizada:', {
      id: ventaFinal.id,
      totalAnterior: venta.total_venta,
      totalNuevo: ventaFinal.total_venta,
      detalles: ventaFinal.detalles.length
    });

    return ventaFinal;
  };

  return {
    calculateVentaTotal,
    recalculateAllVentaTotals,
    updateVentaWithCalculatedTotal
  };
};
