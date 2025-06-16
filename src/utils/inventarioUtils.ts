
import { loadInventarioAcopio, updateInventarioAfterViaje, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { Report } from '@/types/report';
import { isAcopio } from '@/constants/inventario';
import { useInventarioOperations } from '@/hooks/useInventarioOperations';

// Función para actualizar inventario cuando se registra un viaje desde acopio (MANTENER COMPATIBILIDAD)
export const actualizarInventarioPorViaje = (report: Report): boolean => {
  try {
    console.log('=== VERIFICANDO VIAJE PARA INVENTARIO (FUNCIÓN LEGACY) ===');
    console.log('Origen del viaje:', report.origin);
    console.log('Cantidad M3:', report.cantidadM3);
    console.log('Material (description):', report.description);
    console.log('Tipo de reporte:', report.reportType);
    
    // Verificar si el origen es acopio y tiene cantidad de material
    if (isAcopio(report.origin || '') && report.cantidadM3 && report.cantidadM3 > 0 && report.description) {
      console.log('✓ Viaje desde Acopio detectado (función legacy)');
      
      const inventario = loadInventarioAcopio();
      console.log('Inventario actual antes del descuento:', inventario);
      
      // Buscar el material exacto en el inventario
      const materialEncontrado = inventario.find(item => item.tipo_material === report.description);
      
      if (!materialEncontrado) {
        console.log('✗ Material no encontrado en inventario:', report.description);
        console.log('Materiales disponibles:', inventario.map(item => item.tipo_material));
        return false;
      }
      
      if (materialEncontrado.cantidad_disponible < report.cantidadM3) {
        console.log('✗ Cantidad insuficiente en inventario');
        console.log(`Solicitado: ${report.cantidadM3} m³, Disponible: ${materialEncontrado.cantidad_disponible} m³`);
        return false;
      }
      
      const inventarioActualizado = updateInventarioAfterViaje(inventario, {
        material: report.description,
        cantidad_m3: report.cantidadM3
      });
      
      console.log('Inventario después del descuento:', inventarioActualizado);
      
      saveInventarioAcopio(inventarioActualizado);
      console.log(`✓ Inventario actualizado: descontados ${report.cantidadM3} m³ de ${report.description}`);
      return true;
    } else {
      console.log('✗ Viaje no aplica para descuento de inventario (función legacy)');
      console.log('- Origen correcto?', isAcopio(report.origin || ''));
      console.log('- Cantidad válida?', report.cantidadM3 && report.cantidadM3 > 0);
      console.log('- Material especificado?', !!report.description);
    }
    return false;
  } catch (error) {
    console.error('Error actualizando inventario por viaje (función legacy):', error);
    return false;
  }
};

// Nueva función que usa el sistema mejorado de inventario
export const procesarMovimientoInventario = async (report: Report): Promise<boolean> => {
  try {
    console.log('=== PROCESANDO MOVIMIENTO CON SISTEMA MEJORADO ===');
    
    // Importar dinámicamente el hook para usar fuera de componente React
    const { useInventarioOperations } = await import('@/hooks/useInventarioOperations');
    
    // Nota: Esta función será llamada desde useReportOperations donde sí tenemos acceso a hooks
    // Por ahora, usar la función legacy para mantener compatibilidad
    return actualizarInventarioPorViaje(report);
  } catch (error) {
    console.error('Error procesando movimiento de inventario:', error);
    return false;
  }
};
