
import { useState } from 'react';
import { useInventoryMaterials } from '@/context/EnhancedInventoryMaterialsContext';
import { validarOperacionInventario } from '@/utils/inventarioValidation';
import { 
  saveMovimientoInventario,
  loadMovimientosInventario
} from '@/utils/inventarioProcessing';
import { procesarReporteInventario } from '@/utils/inventarioReportProcessor';
import { esAcopio, esCargador } from '@/utils/inventarioDetection';
import { MovimientoInventario, ResultadoOperacionInventario } from '@/types/inventario';

export const useInventoryOperationsEnhanced = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { 
    inventario, 
    updateInventarioItem, 
    getItemByMaterial,
    addInventarioItem 
  } = useInventoryMaterials();

  // Procesar entrada al inventario (MEJORADO con contexto)
  const procesarEntrada = async (
    material: string,
    cantidad: number,
    origen: string,
    reporteId?: string,
    maquinaId?: string,
    maquinaNombre?: string,
    usuario?: string
  ): Promise<ResultadoOperacionInventario> => {
    setIsProcessing(true);
    try {
      const validacion = validarOperacionInventario(material, cantidad, 'entrada');
      
      if (!validacion.esValida) {
        return { exito: false, mensaje: validacion.mensaje || 'Error de validación' };
      }
      
      let cantidadAnterior = 0;
      const materialExistente = getItemByMaterial(material);
      
      if (materialExistente) {
        // Material existe, actualizar cantidad
        cantidadAnterior = materialExistente.cantidad_disponible;
        const nuevaCantidad = cantidadAnterior + cantidad;
        
        await updateInventarioItem(materialExistente.id, {
          cantidad_disponible: nuevaCantidad
        });
      } else {
        // Material nuevo, agregar al inventario
        await addInventarioItem({
          tipo_material: material,
          cantidad_disponible: cantidad,
          costo_promedio_m3: 0
        });
      }

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

      saveMovimientoInventario(movimiento);

      console.log(`✓ Inventario actualizado: +${cantidad} m³ de ${material} desde ${origen}`);
      
      return {
        exito: true,
        mensaje: `Se agregaron ${cantidad} m³ de ${material} al inventario`,
        movimientoId: movimiento.id
      };

    } catch (error) {
      console.error('Error procesando entrada al inventario:', error);
      return { exito: false, mensaje: 'Error interno al procesar la entrada' };
    } finally {
      setIsProcessing(false);
    }
  };

  // Procesar salida del inventario (MEJORADO con contexto)
  const procesarSalida = async (
    material: string,
    cantidad: number,
    destino: string,
    reporteId?: string,
    maquinaId?: string,
    maquinaNombre?: string,
    usuario?: string
  ): Promise<ResultadoOperacionInventario> => {
    setIsProcessing(true);
    try {
      console.log('=== PROCESANDO SALIDA DE INVENTARIO (ENHANCED) ===');
      
      const validacion = validarOperacionInventario(material, cantidad, 'salida');
      
      if (!validacion.esValida) {
        console.log('❌ Validación fallida:', validacion.mensaje);
        return { exito: false, mensaje: validacion.mensaje || 'Error de validación' };
      }
      
      const materialExistente = getItemByMaterial(material);
      
      if (!materialExistente) {
        console.log('❌ Material no encontrado en inventario');
        return { exito: false, mensaje: `Material "${material}" no encontrado en inventario` };
      }

      const cantidadAnterior = materialExistente.cantidad_disponible;
      const cantidadPosterior = Math.max(0, cantidadAnterior - cantidad);
      
      console.log(`📊 Cantidad anterior: ${cantidadAnterior}, Cantidad a descontar: ${cantidad}, Cantidad posterior: ${cantidadPosterior}`);
      
      await updateInventarioItem(materialExistente.id, {
        cantidad_disponible: cantidadPosterior
      });

      // Crear registro de movimiento
      const movimiento: MovimientoInventario = {
        id: Date.now().toString(),
        fecha: new Date(),
        tipo: 'salida',
        material,
        cantidad,
        cantidadAnterior,
        cantidadPosterior,
        destino,
        reporteId,
        maquinaId,
        maquinaNombre,
        usuario,
        observaciones: `Salida de material hacia ${destino}`
      };

      saveMovimientoInventario(movimiento);

      console.log(`✅ Inventario actualizado exitosamente: -${cantidad} m³ de ${material} hacia ${destino}`);
      
      return {
        exito: true,
        mensaje: `Se descontaron ${cantidad} m³ de ${material} del inventario`,
        movimientoId: movimiento.id
      };

    } catch (error) {
      console.error('❌ Error procesando salida del inventario:', error);
      return { exito: false, mensaje: 'Error interno al procesar la salida' };
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    // Estados
    isProcessing,
    
    // Funciones principales (mejoradas)
    procesarEntrada,
    procesarSalida,
    procesarReporteInventario,
    validarOperacion: validarOperacionInventario,
    
    // Funciones de utilidad
    loadMovimientos: loadMovimientosInventario,
    saveMovimiento: saveMovimientoInventario,
    
    // Funciones auxiliares
    isAcopio: esAcopio,
    esCargador
  };
};
