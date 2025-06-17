
export interface VentaMaterial {
  id: string;
  fecha: string;
  tipo_material: string;
  cantidad_m3: number;
  costo_base_m3: number;
  flete_aplicado_m3: number;
  margen_ganancia_m3: number;
  precio_venta_m3: number;
  total_venta: number;
  cliente: string;
  fechaRegistro: string;
}

export const createVentaMaterial = (
  fecha: Date,
  tipo_material: string,
  cantidad_m3: number,
  costo_base_m3: number,
  flete_aplicado_m3: number,
  margen_ganancia_m3: number,
  cliente: string
): VentaMaterial => {
  const precio_venta_m3 = costo_base_m3 + flete_aplicado_m3 + margen_ganancia_m3;
  const total_venta = precio_venta_m3 * cantidad_m3;

  return {
    id: Date.now().toString(),
    fecha: fecha.toISOString(),
    tipo_material,
    cantidad_m3,
    costo_base_m3,
    flete_aplicado_m3,
    margen_ganancia_m3,
    precio_venta_m3,
    total_venta,
    cliente,
    fechaRegistro: new Date().toISOString()
  };
};

export const loadVentasMaterial = (): VentaMaterial[] => {
  try {
    const stored = localStorage.getItem('ventas_material');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading ventas material:', error);
    return [];
  }
};

export const saveVentasMaterial = (ventas: VentaMaterial[]): void => {
  try {
    localStorage.setItem('ventas_material', JSON.stringify(ventas));
  } catch (error) {
    console.error('Error saving ventas material:', error);
  }
};
