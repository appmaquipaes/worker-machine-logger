
import { useState, useCallback } from 'react';
import { ResultadoOperacionInventario, MovimientoInventario } from '@/types/inventario';
import { loadInventarioAcopio, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { useInventarioValidation } from './useInventarioValidation';
import { useInventarioMovimientos } from './useInventarioMovimientos';

export const useInventarioSalidas = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { validarOperacion } = useInventarioValidation();
  const { saveMovimiento } = useInventarioMovimientos();

  const procesarSalida = useCallback((
    material: string,
    cantidad: number,
    destino: string,
    reporteId?: string,
    maquinaId?: string,
    maquinaNombre?: string,
    usuario?: string
  ): ResultadoOperacionInventario => {
    const validacion = validarOperacion(material, cantidad, 'salida');
    
    if (!validacion.esValida) {
      return { exito: false, mensaje: validacion.mensaje || 'Error de validación' };
    }

    setIsProcessing(true);
    
    try {
      const inventario = loadInventarioAcopio();
      const materialIndex = inventario.findIndex(item => item.tipo_material === material);
      
      if (materialIndex === -1) {
        return { exito: false, mensaje: `Material "${material}" no encontrado en inventario` };
      }

      const cantidadAnterior = inventario[materialIndex].cantidad_disponible;
      const inventarioActualizado = [...inventario];
      
      inventarioActualizado[materialIndex] = {
        ...inventario[materialIndex],
        cantidad_disponible: Math.max(0, cantidadAnterior - cantidad)
      };

      saveInventarioAcopio(inventarioActualizado);

      // Crear registro de movimiento
      const movimiento: MovimientoInventario = {
        id: Date.now().toString(),
        fecha: new Date(),
        tipo: 'salida',
        material,
        cantidad,
        cantidadAnterior,
        cantidadPosterior: cantidadAnterior - cantidad,
        destino,
        reporteId,
        maquinaId,
        maquinaNombre,
        usuario,
        observaciones: `Salida de material hacia ${destino}`
      };

      saveMovimiento(movimiento);

      console.log(`✓ Inventario actualizado: -${cantidad} m³ de ${material} hacia ${destino}`);
      
      return {
        exito: true,
        mensaje: `Se descontaron ${cantidad} m³ de ${material} del inventario`,
        movimientoId: movimiento.id,
        inventarioActualizado
      };

    } catch (error) {
      console.error('Error procesando salida del inventario:', error);
      return { exito: false, mensaje: 'Error interno al procesar la salida' };
    } finally {
      setIsProcessing(false);
    }
  }, [validarOperacion, saveMovimiento]);

  return {
    isProcessing,
    procesarSalida
  };
};
