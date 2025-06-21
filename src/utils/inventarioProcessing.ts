
import { MovimientoInventario, ResultadoOperacionInventario } from '@/types/inventario';
import { InventarioAcopio, loadInventarioAcopio, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { validarOperacionInventario } from './inventarioValidation';

// Función para guardar movimientos en localStorage
export const saveMovimientoInventario = (movimiento: MovimientoInventario): void => {
  const movimientos = JSON.parse(localStorage.getItem('movimientos_inventario') || '[]');
  movimientos.push(movimiento);
  localStorage.setItem('movimientos_inventario', JSON.stringify(movimientos));
};

// Función para cargar movimientos desde localStorage
export const loadMovimientosInventario = (): MovimientoInventario[] => {
  const movimientos = localStorage.getItem('movimientos_inventario');
  if (!movimientos) return [];
  
  return JSON.parse(movimientos).map((mov: any) => ({
    ...mov,
    fecha: new Date(mov.fecha)
  }));
};

// Procesar entrada al inventario
export const procesarEntradaInventario = (
  material: string,
  cantidad: number,
  origen: string,
  reporteId?: string,
  maquinaId?: string,
  maquinaNombre?: string,
  usuario?: string
): ResultadoOperacionInventario => {
  const validacion = validarOperacionInventario(material, cantidad, 'entrada');
  
  if (!validacion.esValida) {
    return { exito: false, mensaje: validacion.mensaje || 'Error de validación' };
  }
  
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

    saveMovimientoInventario(movimiento);

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
  }
};

// Procesar salida del inventario
export const procesarSalidaInventario = (
  material: string,
  cantidad: number,
  destino: string,
  reporteId?: string,
  maquinaId?: string,
  maquinaNombre?: string,
  usuario?: string
): ResultadoOperacionInventario => {
  console.log('=== PROCESANDO SALIDA DE INVENTARIO ===');
  console.log('Material:', material, 'Cantidad:', cantidad, 'Destino:', destino);
  
  const validacion = validarOperacionInventario(material, cantidad, 'salida');
  
  if (!validacion.esValida) {
    console.log('❌ Validación fallida:', validacion.mensaje);
    return { exito: false, mensaje: validacion.mensaje || 'Error de validación' };
  }
  
  try {
    const inventario = loadInventarioAcopio();
    console.log('📦 Inventario actual:', inventario);
    
    const materialIndex = inventario.findIndex(item => item.tipo_material === material);
    
    if (materialIndex === -1) {
      console.log('❌ Material no encontrado en inventario');
      return { exito: false, mensaje: `Material "${material}" no encontrado en inventario` };
    }

    const cantidadAnterior = inventario[materialIndex].cantidad_disponible;
    const cantidadPosterior = Math.max(0, cantidadAnterior - cantidad);
    
    console.log(`📊 Cantidad anterior: ${cantidadAnterior}, Cantidad a descontar: ${cantidad}, Cantidad posterior: ${cantidadPosterior}`);
    
    const inventarioActualizado = [...inventario];
    inventarioActualizado[materialIndex] = {
      ...inventario[materialIndex],
      cantidad_disponible: cantidadPosterior
    };

    saveInventarioAcopio(inventarioActualizado);
    console.log('✅ Inventario guardado exitosamente');

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
      movimientoId: movimiento.id,
      inventarioActualizado
    };

  } catch (error) {
    console.error('❌ Error procesando salida del inventario:', error);
    return { exito: false, mensaje: 'Error interno al procesar la salida' };
  }
};
