
import { useState, useCallback } from 'react';
import { ResultadoOperacionInventario, MovimientoInventario } from '@/types/inventario';
import { InventarioAcopio, loadInventarioAcopio, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { useInventarioValidation } from './useInventarioValidation';
import { useInventarioMovimientos } from './useInventarioMovimientos';

export const useInventarioEntradas = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { validarOperacion } = useInventarioValidation();
  const { saveMovimiento } = useInventarioMovimientos();

  const procesarEntrada = useCallback((
    material: string,
    cantidad: number,
    origen: string,
    reporteId?: string,
    maquinaId?: string,
    maquinaNombre?: string,
    usuario?: string
  ): ResultadoOperacionInventario => {
    const validacion = validarOperacion(material, cantidad, 'entrada');
    
    if (!validacion.esValida) {
      return { exito: false, mensaje: validacion.mensaje || 'Error de validación' };
    }

    setIsProcessing(true);
    
    try {
      const inventario = loadInventarioAcopio();
      let inventarioActualizado = [...inventario];
      let cantidadAnterior = 0;
      
      // Buscar si el material ya existe
      const materialIndex = inventario.findIndex(item => item.tipo_material === material);
      
      if (materialIndex >= 0) {
        // Material existe, actualizar cantidad
        cantidadAnterior = inventario[materialIndex].cantidad_disponible;
        inventarioActualizado[materialIndex] = {
          ...inventario[materialIndex],
          cantidad_disponible: cantidadAnterior + cantidad
        };
      } else {
        // Material nuevo, agregar al inventario
        const nuevoItem: InventarioAcopio = {
          id: Date.now().toString(),
          tipo_material: material,
          cantidad_disponible: cantidad,
          costo_promedio_m3: 0 // Se puede actualizar después
        };
        inventarioActualizado.push(nuevoItem);
      }

      // Guardar inventario actualizado
      saveInventarioAcopio(inventarioActualizado);

      // Crear registro de movimiento
      const movimiento: MovimientoInventario = {
        id: Date.now().toString(),
        fecha: new Date(),
        tipo: 'entrada',
        material,
        cantidad,
        cantidadAnterior,
        cantidadPosterior: cantidadAnterior + cantidad,
        origen,
        reporteId,
        maquinaId,
        maquinaNombre,
        usuario,
        observaciones: `Entrada de material desde ${origen}`
      };

      saveMovimiento(movimiento);

      console.log(`✓ Inventario actualizado: +${cantidad} m³ de ${material} desde ${origen}`);
      
      return {
        exito: true,
        mensaje: `Se agregaron ${cantidad} m³ de ${material} al inventario`,
        movimientoId: movimiento.id,
        inventarioActualizado
      };

    } catch (error) {
      console.error('Error procesando entrada al inventario:', error);
      return { exito: false, mensaje: 'Error interno al procesar la entrada' };
    } finally {
      setIsProcessing(false);
    }
  }, [validarOperacion, saveMovimiento]);

  return {
    isProcessing,
    procesarEntrada
  };
};
