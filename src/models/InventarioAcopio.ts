
export interface InventarioAcopio {
  id: string;
  nombre: string;
  tipo_material: string; // Nombre del material/tipo
  categoria: string;
  cantidad: number;
  cantidad_disponible: number; // Alias para compatibilidad
  unidadMedida: string;
  precioUnitario: number;
  costo_promedio_m3?: number;
  stockMinimo: number;
  fechaRegistro: string;
}

export const loadInventarioAcopio = (): InventarioAcopio[] => {
  try {
    const stored = localStorage.getItem('inventario_acopio');
    const inventario = stored ? JSON.parse(stored) : [];
    // Asegurar compatibilidad de nombres
    return inventario.map((item: any) => ({
      ...item,
      tipo_material: item.tipo_material || item.nombre,
      cantidad_disponible: item.cantidad_disponible !== undefined ? item.cantidad_disponible : item.cantidad
    }));
  } catch (error) {
    console.error('Error loading inventory:', error);
    return [];
  }
};

export const saveInventarioAcopio = (inventario: InventarioAcopio[]): void => {
  try {
    localStorage.setItem('inventario_acopio', JSON.stringify(inventario));
  } catch (error) {
    console.error('Error saving inventory:', error);
  }
};

export const updateInventarioAfterCompra = (
  materialId: string,
  cantidadComprada: number,
  costoUnitario: number
): boolean => {
  try {
    const inventario = loadInventarioAcopio();
    const materialIndex = inventario.findIndex(item => item.id === materialId);
    
    if (materialIndex >= 0) {
      const item = inventario[materialIndex];
      const cantidadAnterior = item.cantidad_disponible;
      const costoAnterior = item.costo_promedio_m3 || 0;
      
      // Calcular nuevo costo promedio ponderado
      const nuevaCantidad = cantidadAnterior + cantidadComprada;
      const nuevoCostoPromedio = ((cantidadAnterior * costoAnterior) + (cantidadComprada * costoUnitario)) / nuevaCantidad;
      
      inventario[materialIndex] = {
        ...item,
        cantidad_disponible: nuevaCantidad,
        cantidad: nuevaCantidad,
        costo_promedio_m3: nuevoCostoPromedio
      };
      
      saveInventarioAcopio(inventario);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating inventory after purchase:', error);
    return false;
  }
};

export const updateInventarioAfterVenta = (
  materialId: string,
  cantidadVendida: number
): boolean => {
  try {
    const inventario = loadInventarioAcopio();
    const materialIndex = inventario.findIndex(item => item.id === materialId);
    
    if (materialIndex >= 0) {
      const item = inventario[materialIndex];
      const nuevaCantidad = Math.max(0, item.cantidad_disponible - cantidadVendida);
      
      inventario[materialIndex] = {
        ...item,
        cantidad_disponible: nuevaCantidad,
        cantidad: nuevaCantidad
      };
      
      saveInventarioAcopio(inventario);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating inventory after sale:', error);
    return false;
  }
};
