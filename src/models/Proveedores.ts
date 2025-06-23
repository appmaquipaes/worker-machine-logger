
export interface Proveedor {
  id: string;
  nombre: string;
  ciudad: string;
  telefono: string;
  email?: string;
  contacto_principal: string;
  activo: boolean;
  fecha_registro: Date;
  observaciones?: string;
}

export interface ProductoProveedor {
  id: string;
  proveedor_id: string;
  nombre_producto: string;
  tipo_material: string;
  precio_por_m3: number;
  disponible: boolean;
  fecha_registro: Date;
  observaciones?: string;
}

// Función para crear un nuevo proveedor
export const createProveedor = (
  nombre: string,
  ciudad: string,
  telefono: string,
  contacto_principal: string,
  email?: string,
  observaciones?: string
): Proveedor => {
  return {
    id: Date.now().toString(),
    nombre,
    ciudad,
    telefono,
    email,
    contacto_principal,
    activo: true,
    fecha_registro: new Date(),
    observaciones
  };
};

// Función para crear un nuevo producto de proveedor
export const createProductoProveedor = (
  proveedor_id: string,
  nombre_producto: string,
  tipo_material: string,
  precio_por_m3: number,
  observaciones?: string
): ProductoProveedor => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    proveedor_id,
    nombre_producto,
    tipo_material,
    precio_por_m3,
    disponible: true,
    fecha_registro: new Date(),
    observaciones
  };
};

// Función para guardar proveedores en localStorage
export const saveProveedores = (proveedores: Proveedor[]): void => {
  try {
    console.log('💾 Guardando proveedores:', proveedores.length);
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
    console.log('✅ Proveedores guardados exitosamente');
  } catch (error) {
    console.error('❌ Error guardando proveedores:', error);
    throw error;
  }
};

// Función para cargar proveedores desde localStorage
export const loadProveedores = (): Proveedor[] => {
  try {
    console.log('📂 Cargando proveedores...');
    const storedProveedores = localStorage.getItem('proveedores');
    
    if (!storedProveedores) {
      console.log('ℹ️ No hay proveedores almacenados');
      return [];
    }
    
    const parsedProveedores = JSON.parse(storedProveedores).map((proveedor: any) => ({
      ...proveedor,
      fecha_registro: new Date(proveedor.fecha_registro)
    }));
    
    console.log('✅ Proveedores cargados:', parsedProveedores.length);
    return parsedProveedores;
  } catch (error) {
    console.error('❌ Error cargando proveedores:', error);
    return [];
  }
};

// Función para guardar productos de proveedores en localStorage
export const saveProductosProveedores = (productos: ProductoProveedor[]): void => {
  try {
    console.log('💾 Guardando productos de proveedores:', productos.length);
    localStorage.setItem('productos_proveedores', JSON.stringify(productos));
    console.log('✅ Productos de proveedores guardados exitosamente');
  } catch (error) {
    console.error('❌ Error guardando productos de proveedores:', error);
    throw error;
  }
};

// Función para cargar productos de proveedores desde localStorage
export const loadProductosProveedores = (): ProductoProveedor[] => {
  try {
    console.log('📂 Cargando productos de proveedores...');
    const storedProductos = localStorage.getItem('productos_proveedores');
    
    if (!storedProductos) {
      console.log('ℹ️ No hay productos de proveedores almacenados');
      return [];
    }
    
    const productos = JSON.parse(storedProductos).map((producto: any) => ({
      ...producto,
      fecha_registro: new Date(producto.fecha_registro)
    }));
    
    console.log('✅ Productos de proveedores cargados:', productos.length);
    return productos;
  } catch (error) {
    console.error('❌ Error cargando productos de proveedores:', error);
    return [];
  }
};

// Función para obtener productos por proveedor
export const getProductosByProveedor = (proveedorId: string): ProductoProveedor[] => {
  const productos = loadProductosProveedores();
  return productos.filter(producto => producto.proveedor_id === proveedorId && producto.disponible);
};

// Función para obtener proveedor por nombre
export const getProveedorByName = (nombre: string): Proveedor | undefined => {
  const proveedores = loadProveedores();
  return proveedores.find(proveedor => proveedor.nombre === nombre && proveedor.activo);
};
