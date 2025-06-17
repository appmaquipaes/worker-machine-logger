
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
    usuario?: string,
    maquinaTipo?: string
  ): ResultadoOperacionInventario => {
    const validacion = validarOperacion(material, cantidad, 'entrada', maquinaTipo);
    
    if (!validacion.esValida) {
      return { exito: false, mensaje: validacion.mensaje || 'Error de validación' };
    }

    setIsProcessing(true);
    
    try {
      const inventario = loadInventarioAcopio();
      let inventarioActualizado = [...inventario];
      let cantidadAnterior = 0;
      
      const materialIndex = inventario.findIndex(item => item.tipo_material === material);
      
      if (materialIndex >= 0) {
        cantidadAnterior = inventario[materialIndex].cantidad_disponible;
        inventarioActualizado[materialIndex] = {
          ...inventario[materialIndex],
          cantidad_disponible: cantidadAnterior + cantidad,
          cantidad: cantidadAnterior + cantidad
        };
      } else {
        const nuevoItem: InventarioAcopio = {
          id: Date.now().toString(),
          nombre: material,
          tipo_material: material,
          categoria: 'Material',
          cantidad: cantidad,
          cantidad_disponible: cantidad,
          unidadMedida: 'm³',
          precioUnitario: 0,
          costo_promedio_m3: 0,
          stockMinimo: 0,
          fechaRegistro: new Date().toISOString()
        };
        inventarioActualizado.push(nuevoItem);
      }

      saveInventarioAcopio(inventarioActualizado);

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
        observaciones: `Entrada de material desde ${origen}${maquinaTipo ? ` (${maquinaTipo})` : ''}`
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
