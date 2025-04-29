
// Define el tipo para las compras de material
export type CompraMaterial = {
  id: string;
  fecha: Date;
  punto_cargue: string;
  tipo_material: string;
  cantidad_m3: number;
  valor_por_m3: number;
  transporte_flete: number;
  costo_total: number;
  costo_unitario_total: number;
};

// Función para crear una nueva compra
export const createCompraMaterial = (
  fecha: Date,
  punto_cargue: string,
  tipo_material: string,
  cantidad_m3: number,
  valor_por_m3: number,
  transporte_flete: number
): CompraMaterial => {
  const costo_total = cantidad_m3 * valor_por_m3;
  const costo_unitario_total = (costo_total + transporte_flete) / cantidad_m3;
  
  return {
    id: Date.now().toString(),
    fecha,
    punto_cargue,
    tipo_material,
    cantidad_m3,
    valor_por_m3,
    transporte_flete,
    costo_total,
    costo_unitario_total
  };
};

// Función para guardar compras en localStorage
export const saveComprasMaterial = (compras: CompraMaterial[]): void => {
  localStorage.setItem('compras_material', JSON.stringify(compras));
};

// Función para cargar compras desde localStorage
export const loadComprasMaterial = (): CompraMaterial[] => {
  const storedCompras = localStorage.getItem('compras_material');
  if (!storedCompras) return [];
  
  return JSON.parse(storedCompras).map((compra: any) => ({
    ...compra,
    fecha: new Date(compra.fecha)
  }));
};
