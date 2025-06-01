
// Define el tipo para el inventario de acopio
export type InventarioAcopio = {
  id: string;
  tipo_material: string;
  cantidad_disponible: number;
  costo_promedio_m3: number;
};

// Función para guardar inventario en localStorage
export const saveInventarioAcopio = (inventario: InventarioAcopio[]): void => {
  localStorage.setItem('inventario_acopio', JSON.stringify(inventario));
};

// Función para cargar inventario desde localStorage
export const loadInventarioAcopio = (): InventarioAcopio[] => {
  const storedInventario = localStorage.getItem('inventario_acopio');
  return storedInventario ? JSON.parse(storedInventario) : [];
};

// Función para actualizar el inventario después de una compra
export const updateInventarioAfterCompra = (
  inventario: InventarioAcopio[],
  compra: {
    tipo_material: string;
    cantidad_m3: number;
    costo_unitario_total: number;
  }
): InventarioAcopio[] => {
  // Buscar si ya existe el material en el inventario
  const existingItemIndex = inventario.findIndex(
    item => item.tipo_material === compra.tipo_material
  );

  if (existingItemIndex >= 0) {
    // Si el material ya existe, actualizar cantidad y costo promedio
    const existingItem = inventario[existingItemIndex];
    const totalCantidadAnterior = existingItem.cantidad_disponible;
    const totalCostoAnterior = totalCantidadAnterior * existingItem.costo_promedio_m3;
    
    const nuevaCantidad = totalCantidadAnterior + compra.cantidad_m3;
    const nuevoCostoTotal = totalCostoAnterior + (compra.cantidad_m3 * compra.costo_unitario_total);
    const nuevoCostoPromedio = nuevoCostoTotal / nuevaCantidad;

    const updatedInventario = [...inventario];
    updatedInventario[existingItemIndex] = {
      ...existingItem,
      cantidad_disponible: nuevaCantidad,
      costo_promedio_m3: nuevoCostoPromedio
    };

    return updatedInventario;
  } else {
    // Si el material no existe, agregar como nuevo
    const newItem: InventarioAcopio = {
      id: Date.now().toString(),
      tipo_material: compra.tipo_material,
      cantidad_disponible: compra.cantidad_m3,
      costo_promedio_m3: compra.costo_unitario_total
    };

    return [...inventario, newItem];
  }
};

// Función para actualizar el inventario después de una venta
export const updateInventarioAfterVenta = (
  inventario: InventarioAcopio[],
  venta: {
    tipo_material: string;
    cantidad_m3: number;
  }
): InventarioAcopio[] => {
  return inventario.map(item => {
    if (item.tipo_material === venta.tipo_material) {
      return {
        ...item,
        cantidad_disponible: Math.max(0, item.cantidad_disponible - venta.cantidad_m3)
      };
    }
    return item;
  });
};

// Función para actualizar el inventario después de un viaje desde acopio
export const updateInventarioAfterViaje = (
  inventario: InventarioAcopio[],
  viaje: {
    material: string;
    cantidad_m3: number;
  }
): InventarioAcopio[] => {
  return inventario.map(item => {
    if (item.tipo_material === viaje.material) {
      return {
        ...item,
        cantidad_disponible: Math.max(0, item.cantidad_disponible - viaje.cantidad_m3)
      };
    }
    return item;
  });
};
