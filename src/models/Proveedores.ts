
export interface Proveedor {
  id: string;
  nombre: string;
  ciudad?: string;
  contacto?: string;
  correo_electronico?: string;
  nit?: string;
  tipo_proveedor?: 'Materiales' | 'Lubricantes' | 'Repuestos' | 'Servicios' | 'Otros';
  forma_pago?: string;
  observaciones?: string;
  fechaRegistro: string;
}

export interface ProductoProveedor {
  id: string;
  proveedor_id: string;
  nombre_producto: string;
  tipo_insumo: 'Material' | 'Lubricante' | 'Repuesto' | 'Servicio';
  unidad: string;
  precio_unitario: number;
  observaciones?: string;
  fechaRegistro: string;
}

export const loadProveedores = (): Proveedor[] => {
  try {
    const stored = localStorage.getItem('proveedores');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading proveedores:', error);
    return [];
  }
};

export const saveProveedores = (proveedores: Proveedor[]): void => {
  try {
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
  } catch (error) {
    console.error('Error saving proveedores:', error);
  }
};

export const createProveedor = (
  nombre: string,
  ciudad: string,
  contacto: string,
  correo_electronico: string,
  nit: string,
  tipo_proveedor: string,
  forma_pago: string,
  observaciones: string
): Proveedor => {
  return {
    id: Date.now().toString(),
    nombre,
    ciudad,
    contacto,
    correo_electronico,
    nit,
    tipo_proveedor: tipo_proveedor as 'Materiales' | 'Lubricantes' | 'Repuestos' | 'Servicios' | 'Otros',
    forma_pago,
    observaciones,
    fechaRegistro: new Date().toISOString()
  };
};

export const loadProductosProveedores = (): ProductoProveedor[] => {
  try {
    const stored = localStorage.getItem('productos_proveedores');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading productos proveedores:', error);
    return [];
  }
};

export const saveProductosProveedores = (productos: ProductoProveedor[]): void => {
  try {
    localStorage.setItem('productos_proveedores', JSON.stringify(productos));
  } catch (error) {
    console.error('Error saving productos proveedores:', error);
  }
};

export const createProductoProveedor = (
  proveedor_id: string,
  tipo_insumo: string,
  nombre_producto: string,
  unidad: string,
  precio_unitario: number,
  observaciones: string
): ProductoProveedor => {
  return {
    id: Date.now().toString(),
    proveedor_id,
    nombre_producto,
    tipo_insumo: tipo_insumo as 'Material' | 'Lubricante' | 'Repuesto' | 'Servicio',
    unidad,
    precio_unitario,
    observaciones,
    fechaRegistro: new Date().toISOString()
  };
};

export const getUniqueProviderMaterialTypes = (): string[] => {
  const productos = loadProductosProveedores();
  const tipos = [...new Set(productos.map(p => p.tipo_insumo))];
  return tipos.filter(tipo => tipo && tipo.trim() !== '');
};
