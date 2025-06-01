
import { loadInventarioAcopio, updateInventarioAfterViaje, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { Report } from '@/context/ReportContext';

// Función para actualizar inventario cuando se registra un viaje desde acopio
export const actualizarInventarioPorViaje = (report: Report): boolean => {
  try {
    // Verificar si el origen es "Acopio Maquipaes" y tiene cantidad de material
    if (report.origin === 'Acopio Maquipaes' && report.cantidadM3 && report.cantidadM3 > 0 && report.description) {
      const inventario = loadInventarioAcopio();
      
      const inventarioActualizado = updateInventarioAfterViaje(inventario, {
        material: report.description,
        cantidad_m3: report.cantidadM3
      });
      
      saveInventarioAcopio(inventarioActualizado);
      console.log(`Inventario actualizado: descontados ${report.cantidadM3} m³ de ${report.description}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error actualizando inventario por viaje:', error);
    return false;
  }
};
