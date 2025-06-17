
// Define el tipo para las ventas de material
export type VentaMaterial = {
  id: string;
  fecha: Date;
  tipo_material: string;
  cantidad_m3: number;
  costo_base_m3: number;
  flete_aplicado_m3: number;
  margen_ganancia_m3: number;
  precio_venta_m3: number;
  total_venta: number;
  cliente: string;
};

// Función para crear una nueva venta
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
    fecha,
    tipo_material,
    cantidad_m3,
    costo_base_m3,
    flete_aplicado_m3,
    margen_ganancia_m3,
    precio_venta_m3,
    total_venta,
    cliente
  };
};

// Función para guardar ventas en localStorage
export const saveVentasMaterial = (ventas: VentaMaterial[]): void => {
  localStorage.setItem('ventas_material', JSON.stringify(ventas));
};

// Función para cargar ventas desde localStorage
export const loadVentasMaterial = (): VentaMaterial[] => {
  const storedVentas = localStorage.getItem('ventas_material');
  if (!storedVentas) return [];
  
  return JSON.parse(storedVentas).map((venta: any) => ({
    ...venta,
    fecha: new Date(venta.fecha)
  }));
};
