
// Model for material providers and their associated products

export interface Proveedor {
  id: string;
  nombre: string;
  ciudad: string;
  contacto: string;
  correo_electronico: string;
  nit: string;
  tipo_proveedor: 'Materiales' | 'Lubricantes' | 'Repuestos' | 'Servicios' | 'Otros';
  forma_pago: string;
  fecha_registro: Date;
  observaciones?: string;
}

export interface ProductoProveedor {
  id: string;
  proveedor_id: string;
  tipo_insumo: 'Material' | 'Lubricante' | 'Repuesto' | 'Servicio';
  nombre_producto: string;
  unidad: string;
  precio_unitario: number;
  observaciones?: string;
}

// Load providers from localStorage
export const loadProveedores = (): Proveedor[] => {
  const proveedoresString = localStorage.getItem('proveedores');
  if (!proveedoresString) return [];

  try {
    return JSON.parse(proveedoresString).map((proveedor: any) => ({
      ...proveedor,
      fecha_registro: new Date(proveedor.fecha_registro)
    }));
  } catch (error) {
    console.error('Error loading providers:', error);
    return [];
  }
};

// Save providers to localStorage
export const saveProveedores = (proveedores: Proveedor[]): void => {
  localStorage.setItem('proveedores', JSON.stringify(proveedores));
};

// Load products from localStorage
export const loadProductosProveedores = (): ProductoProveedor[] => {
  const productosString = localStorage.getItem('productos_proveedores');
  if (!productosString) return [];

  try {
    return JSON.parse(productosString);
  } catch (error) {
    console.error('Error loading provider products:', error);
    return [];
  }
};

// Save products to localStorage
export const saveProductosProveedores = (productos: ProductoProveedor[]): void => {
  localStorage.setItem('productos_proveedores', JSON.stringify(productos));
};

// Create a new provider
export const createProveedor = (
  nombre: string,
  ciudad: string,
  contacto: string,
  correo_electronico: string,
  nit: string,
  tipo_proveedor: 'Materiales' | 'Lubricantes' | 'Repuestos' | 'Servicios' | 'Otros',
  forma_pago: string,
  observaciones?: string
): Proveedor => {
  return {
    id: Date.now().toString(),
    nombre,
    ciudad,
    contacto,
    correo_electronico,
    nit,
    tipo_proveedor,
    forma_pago,
    fecha_registro: new Date(),
    observaciones
  };
};

// Create a new product for a provider
export const createProductoProveedor = (
  proveedor_id: string,
  tipo_insumo: 'Material' | 'Lubricante' | 'Repuesto' | 'Servicio',
  nombre_producto: string,
  unidad: string,
  precio_unitario: number,
  observaciones?: string
): ProductoProveedor => {
  return {
    id: Date.now().toString(),
    proveedor_id,
    tipo_insumo,
    nombre_producto,
    unidad,
    precio_unitario,
    observaciones
  };
};

// Get provider names for dropdown
export const getProveedoresNames = (): string[] => {
  return loadProveedores().map(proveedor => proveedor.nombre);
};

// Get products by provider ID
export const getProductosByProveedorId = (proveedorId: string): ProductoProveedor[] => {
  return loadProductosProveedores().filter(producto => producto.proveedor_id === proveedorId);
};

// Get unique material types from provider products
export const getUniqueProviderMaterialTypes = (): string[] => {
  const productos = loadProductosProveedores();
  const materialTypes = productos
    .filter(producto => producto.tipo_insumo === 'Material')
    .map(producto => producto.nombre_producto);
  return [...new Set(materialTypes)];
};
