
export interface InventarioAcopio {
  id: string;
  nombre: string;
  tipo_material: string;
  categoria: string;
  cantidad: number;
  cantidad_disponible: number;
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
  inventario: InventarioAcopio[],
  compra: {
    tipo_material: string;
    cantidad_m3: number;
    costo_unitario_total: number;
  }
): InventarioAcopio[] => {
  const inventarioActualizado = [...inventario];
  const materialIndex = inventarioActualizado.findIndex(item => item.tipo_material === compra.tipo_material);
  
  if (materialIndex >= 0) {
    const item = inventarioActualizado[materialIndex];
    const cantidadAnterior = item.cantidad_disponible;
    const costoAnterior = item.costo_promedio_m3 || 0;
    
    const nuevaCantidad = cantidadAnterior + compra.cantidad_m3;
    const nuevoCostoPromedio = ((cantidadAnterior * costoAnterior) + (compra.cantidad_m3 * compra.costo_unitario_total)) / nuevaCantidad;
    
    inventarioActualizado[materialIndex] = {
      ...item,
      cantidad_disponible: nuevaCantidad,
      cantidad: nuevaCantidad,
      costo_promedio_m3: nuevoCostoPromedio
    };
  } else {
    const nuevoItem: InventarioAcopio = {
      id: Date.now().toString(),
      nombre: compra.tipo_material,
      tipo_material: compra.tipo_material,
      categoria: 'Material',
      cantidad: compra.cantidad_m3,
      cantidad_disponible: compra.cantidad_m3,
      unidadMedida: 'm³',
      precioUnitario: compra.costo_unitario_total,
      costo_promedio_m3: compra.costo_unitario_total,
      stockMinimo: 0,
      fechaRegistro: new Date().toISOString()
    };
    inventarioActualizado.push(nuevoItem);
  }
  
  return inventarioActualizado;
};

export const updateInventarioAfterVenta = (
  inventario: InventarioAcopio[],
  venta: {
    tipo_material: string;
    cantidad_m3: number;
  }
): InventarioAcopio[] => {
  const inventarioActualizado = [...inventario];
  const materialIndex = inventarioActualizado.findIndex(item => item.tipo_material === venta.tipo_material);
  
  if (materialIndex >= 0) {
    const item = inventarioActualizado[materialIndex];
    const nuevaCantidad = Math.max(0, item.cantidad_disponible - venta.cantidad_m3);
    
    inventarioActualizado[materialIndex] = {
      ...item,
      cantidad_disponible: nuevaCantidad,
      cantidad: nuevaCantidad
    };
  }
  
  return inventarioActualizado;
};
