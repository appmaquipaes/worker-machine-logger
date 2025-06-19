import { useState, useCallback } from 'react';
import { MovimientoInventario, TipoMovimientoInventario, ValidacionInventario, ResultadoOperacionInventario } from '@/types/inventario';
import { InventarioAcopio, loadInventarioAcopio, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { isAcopio, MACHINE_INVENTORY_CONFIG } from '@/constants/inventario';
import { Report } from '@/types/report';

export const useInventarioOperations = () => {
  const [isProcessing, setIsProcessing] = useState(false);

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

  // Función mejorada para detectar si es acopio
  const esAcopio = useCallback((ubicacion?: string): boolean => {
    if (!ubicacion) return false;
    const ubicacionNorm = ubicacion.toLowerCase().trim();
    return ubicacionNorm.includes('acopio') || ubicacionNorm === 'acopio maquipaes';
  }, []);

  // Validar si una operación es válida
  const validarOperacion = useCallback((
    material: string,
    cantidad: number,
    tipo: TipoMovimientoInventario,
    maquinaTipo?: string
  ): ValidacionInventario => {
    const inventario = loadInventarioAcopio();
    
    if (cantidad <= 0) {
      return { esValida: false, mensaje: 'La cantidad debe ser mayor a 0' };
    }

    // Para salidas, verificar stock disponible
    if (tipo === 'salida') {
      const materialInventario = inventario.find(item => item.tipo_material === material);
      
      if (!materialInventario) {
        return { 
          esValida: false, 
          mensaje: `El material "${material}" no existe en el inventario`,
          cantidadDisponible: 0
        };
      }

      if (materialInventario.cantidad_disponible < cantidad) {
        return { 
          esValida: false, 
          mensaje: `Stock insuficiente. Disponible: ${materialInventario.cantidad_disponible} m³`,
          cantidadDisponible: materialInventario.cantidad_disponible
        };
      }
    }

    // Validar configuración de máquina
    if (maquinaTipo && MACHINE_INVENTORY_CONFIG[maquinaTipo as keyof typeof MACHINE_INVENTORY_CONFIG]) {
      const config = MACHINE_INVENTORY_CONFIG[maquinaTipo as keyof typeof MACHINE_INVENTORY_CONFIG];
      
      if (tipo === 'entrada' && !config.canEnter) {
        return { 
          esValida: false, 
          mensaje: `Las máquinas tipo "${maquinaTipo}" no pueden realizar entradas al inventario`
        };
      }

      if (tipo === 'salida' && !config.canExit) {
        return { 
          esValida: false, 
          mensaje: `Las máquinas tipo "${maquinaTipo}" no pueden realizar salidas del inventario`
        };
      }
    }

    return { esValida: true };
  }, []);

  // Procesar entrada al inventario
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

  // Procesar salida del inventario (corregida)
  const procesarSalida = useCallback((
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
    
    const validacion = validarOperacion(material, cantidad, 'salida');
    
    if (!validacion.esValida) {
      console.log('❌ Validación fallida:', validacion.mensaje);
      return { exito: false, mensaje: validacion.mensaje || 'Error de validación' };
    }

    setIsProcessing(true);
    
    try {
      const inventario = loadInventarioAcopio();
      console.log('Inventario actual:', inventario);
      
      const materialIndex = inventario.findIndex(item => item.tipo_material === material);
      
      if (materialIndex === -1) {
        console.log('❌ Material no encontrado en inventario');
        return { exito: false, mensaje: `Material "${material}" no encontrado en inventario` };
      }

      const cantidadAnterior = inventario[materialIndex].cantidad_disponible;
      const cantidadPosterior = Math.max(0, cantidadAnterior - cantidad);
      
      console.log(`Cantidad anterior: ${cantidadAnterior}, Cantidad a descontar: ${cantidad}, Cantidad posterior: ${cantidadPosterior}`);
      
      const inventarioActualizado = [...inventario];
      inventarioActualizado[materialIndex] = {
        ...inventario[materialIndex],
        cantidad_disponible: cantidadPosterior
      };

      saveInventarioAcopio(inventarioActualizado);
      console.log('✓ Inventario guardado exitosamente');

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

  // Detectar y procesar automáticamente según el reporte (CORREGIDA)
  const procesarReporteInventario = useCallback((report: Report): ResultadoOperacionInventario => {
    console.log('=== PROCESANDO REPORTE PARA INVENTARIO ===');
    console.log('Reporte:', report);

    // Solo procesar reportes de viajes con cantidad de m³
    if (report.reportType !== 'Viajes' || !report.cantidadM3 || report.cantidadM3 <= 0) {
      console.log('→ Reporte no aplica para inventario (no es viaje o sin cantidad)');
      return { exito: false, mensaje: 'Reporte no aplica para inventario' };
    }

    const esOrigenAcopio = esAcopio(report.origin);
    const esDestinoAcopio = esAcopio(report.destination);
    
    console.log('Origen:', report.origin, '- Es acopio:', esOrigenAcopio);
    console.log('Destino:', report.destination, '- Es acopio:', esDestinoAcopio);

    // Determinar el material a procesar
    const material = report.description || 'Material sin especificar';

    if (esDestinoAcopio && !esOrigenAcopio) {
      // ENTRADA: El destino es acopio
      console.log('→ Procesando ENTRADA al acopio');
      return procesarEntrada(
        material,
        report.cantidadM3,
        report.origin || 'Origen no especificado',
        report.id,
        report.machineId,
        report.machineName,
        report.userName
      );
    } else if (esOrigenAcopio && !esDestinoAcopio) {
      // SALIDA: El origen es acopio
      console.log('→ Procesando SALIDA del acopio');
      return procesarSalida(
        material,
        report.cantidadM3,
        report.destination || 'Destino no especificado',
        report.id,
        report.machineId,
        report.machineName,
        report.userName
      );
    } else {
      console.log('→ No aplica para inventario (ni entrada ni salida válida)');
      return { exito: false, mensaje: 'El reporte no representa movimiento de inventario válido' };
    }
  }, [esAcopio, procesarEntrada, procesarSalida]);

  return {
    // Estados
    isProcessing,
    
    // Funciones principales
    procesarEntrada,
    procesarSalida,
    procesarReporteInventario,
    validarOperacion,
    
    // Funciones de utilidad
    loadMovimientos,
    saveMovimiento,
    
    // Funciones auxiliares
    isAcopio: esAcopio
  };
};
