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

// Load providers from localStorage with enhanced error handling
export const loadProveedores = (): Proveedor[] => {
  try {
    console.log('📂 Cargando proveedores...');
    const proveedoresString = localStorage.getItem('proveedores');
    
    if (!proveedoresString) {
      console.log('ℹ️ No hay proveedores almacenados');
      return [];
    }

    const parsedProveedores = JSON.parse(proveedoresString).map((proveedor: any) => ({
      ...proveedor,
      fecha_registro: new Date(proveedor.fecha_registro)
    }));
    
    console.log('✅ Proveedores cargados exitosamente:', parsedProveedores.length);
    return parsedProveedores;
  } catch (error) {
    console.error('❌ Error loading providers:', error);
    return [];
  }
};

// Save providers to localStorage with enhanced error handling
export const saveProveedores = (proveedores: Proveedor[]): boolean => {
  try {
    console.log('💾 Guardando proveedores...', proveedores.length);
    const serializedData = JSON.stringify(proveedores);
    localStorage.setItem('proveedores', serializedData);
    
    // Verificar que se guardó correctamente
    const verificacion = localStorage.getItem('proveedores');
    if (verificacion) {
      console.log('✅ Proveedores guardados exitosamente');
      return true;
    } else {
      console.error('❌ Error: No se pudo verificar el guardado de proveedores');
      return false;
    }
  } catch (error) {
    console.error('❌ Error saving providers:', error);
    return false;
  }
};

// Load products from localStorage with enhanced error handling
export const loadProductosProveedores = (): ProductoProveedor[] => {
  try {
    console.log('📂 Cargando productos de proveedores...');
    const productosString = localStorage.getItem('productos_proveedores');
    
    if (!productosString) {
      console.log('ℹ️ No hay productos de proveedores almacenados');
      return [];
    }

    const parsedProductos = JSON.parse(productosString);
    console.log('✅ Productos de proveedores cargados exitosamente:', parsedProductos.length);
    return parsedProductos;
  } catch (error) {
    console.error('❌ Error loading provider products:', error);
    return [];
  }
};

// Save products to localStorage with enhanced error handling
export const saveProductosProveedores = (productos: ProductoProveedor[]): boolean => {
  try {
    console.log('💾 Guardando productos de proveedores...', productos.length);
    const serializedData = JSON.stringify(productos);
    localStorage.setItem('productos_proveedores', serializedData);
    
    // Verificar que se guardó correctamente
    const verificacion = localStorage.getItem('productos_proveedores');
    if (verificacion) {
      console.log('✅ Productos de proveedores guardados exitosamente');
      return true;
    } else {
      console.error('❌ Error: No se pudo verificar el guardado de productos');
      return false;
    }
  } catch (error) {
    console.error('❌ Error saving provider products:', error);
    return false;
  }
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
