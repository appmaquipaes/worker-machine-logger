
// Model for material providers

export interface Proveedor {
  id: string;
  nombre_proveedor: string;
  tipo_material: string;
  cantidad: number;
  valor_unitario: number;
  ciudad: string;
  fecha_compra: Date;
  observaciones?: string;
}

// Load providers from localStorage
export const loadProveedores = (): Proveedor[] => {
  const proveedoresString = localStorage.getItem('proveedores_material');
  if (!proveedoresString) return [];

  try {
    return JSON.parse(proveedoresString).map((proveedor: any) => ({
      ...proveedor,
      fecha_compra: new Date(proveedor.fecha_compra)
    }));
  } catch (error) {
    console.error('Error loading providers:', error);
    return [];
  }
};

// Save providers to localStorage
export const saveProveedores = (proveedores: Proveedor[]): void => {
  localStorage.setItem('proveedores_material', JSON.stringify(proveedores));
};

// Create a new provider
export const createProveedor = (
  nombre_proveedor: string,
  tipo_material: string,
  cantidad: number,
  valor_unitario: number,
  ciudad: string,
  fecha_compra: Date,
  observaciones?: string
): Proveedor => {
  return {
    id: Date.now().toString(),
    nombre_proveedor,
    tipo_material,
    cantidad,
    valor_unitario,
    ciudad,
    fecha_compra,
    observaciones
  };
};

// Get provider names for dropdown
export const getProveedoresNames = (): string[] => {
  return loadProveedores().map(proveedor => proveedor.nombre_proveedor);
};

// Get unique material types from providers
export const getUniqueProviderMaterialTypes = (): string[] => {
  const providers = loadProveedores();
  const materialTypes = providers.map(provider => provider.tipo_material);
  return [...new Set(materialTypes)];
};
