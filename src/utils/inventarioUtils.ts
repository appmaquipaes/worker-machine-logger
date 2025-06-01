
import { loadInventarioAcopio, updateInventarioAfterViaje, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { Report } from '@/context/ReportContext';

// Función para actualizar inventario cuando se registra un viaje desde acopio
export const actualizarInventarioPorViaje = (report: Report): boolean => {
  try {
    console.log('=== VERIFICANDO VIAJE PARA INVENTARIO ===');
    console.log('Origen del viaje:', report.origin);
    console.log('Cantidad M3:', report.cantidadM3);
    console.log('Material (description):', report.description);
    console.log('Tipo de reporte:', report.reportType);
    
    // Verificar si el origen es "Acopio Maquipaes" y tiene cantidad de material
    if (report.origin === 'Acopio Maquipaes' && report.cantidadM3 && report.cantidadM3 > 0 && report.description) {
      console.log('✓ Viaje desde Acopio Maquipaes detectado');
      
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
      console.log('✗ Viaje no aplica para descuento de inventario');
      console.log('- Origen correcto?', report.origin === 'Acopio Maquipaes');
      console.log('- Cantidad válida?', report.cantidadM3 && report.cantidadM3 > 0);
      console.log('- Material especificado?', !!report.description);
    }
    return false;
  } catch (error) {
    console.error('Error actualizando inventario por viaje:', error);
    return false;
  }
};
