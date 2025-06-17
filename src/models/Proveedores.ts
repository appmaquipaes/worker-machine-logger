
export interface Proveedor {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  ciudad?: string;
  tipoServicio: string;
  tipo_proveedor?: string;
  contacto?: string;
  nit?: string;
  fechaRegistro: string;
}

export interface ProductoProveedor {
  id: string;
  proveedorId: string;
  nombre: string;
  tipo_material: string;
  precio_por_m3: number;
  descripcion?: string;
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

export const getUniqueProviderMaterialTypes = (): string[] => {
  const productos = loadProductosProveedores();
  const tipos = [...new Set(productos.map(p => p.tipo_material))];
  return tipos.filter(tipo => tipo && tipo.trim() !== '');
};
