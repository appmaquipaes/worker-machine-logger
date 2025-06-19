
// Define el tipo para proveedores
export type Proveedor = {
  id: string;
  nombre: string;
  ciudad: string;
  contacto: string;
  correo_electronico: string;
  nit: string;
  tipo_proveedor: string;
  forma_pago: string;
  observaciones?: string;
};

// Define el tipo para productos de proveedores
export type ProductoProveedor = {
  id: string;
  proveedor_id: string;
  tipo_insumo: string;
  nombre_producto: string;
  unidad: string;
  precio_unitario: number;
  observaciones?: string;
};

// Export Producto as alias for ProductoProveedor for backward compatibility
export type Producto = ProductoProveedor;

// Función para crear un nuevo proveedor
export const createProveedor = (
  nombre: string,
  ciudad: string,
  contacto: string,
  correo_electronico: string,
  nit: string,
  tipo_proveedor: string,
  forma_pago: string,
  observaciones?: string
): Proveedor => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    nombre,
    ciudad,
    contacto,
    correo_electronico,
    nit,
    tipo_proveedor,
    forma_pago,
    observaciones
  };
};

// Función para crear un nuevo producto de proveedor
export const createProductoProveedor = (
  proveedor_id: string,
  tipo_insumo: string,
  nombre_producto: string,
  unidad: string,
  precio_unitario: number,
  observaciones?: string
): ProductoProveedor => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    proveedor_id,
    tipo_insumo,
    nombre_producto,
    unidad,
    precio_unitario,
    observaciones
  };
};

// Función para guardar proveedores en localStorage
export const saveProveedores = (proveedores: Proveedor[]): void => {
  localStorage.setItem('proveedores', JSON.stringify(proveedores));
};

// Función para cargar proveedores desde localStorage
export const loadProveedores = (): Proveedor[] => {
  const storedProveedores = localStorage.getItem('proveedores');
  if (!storedProveedores) return [];
  
  return JSON.parse(storedProveedores);
};

// Función para guardar productos en localStorage
export const saveProductos = (productos: ProductoProveedor[]): void => {
  localStorage.setItem('productos_proveedor', JSON.stringify(productos));
};

// Función para cargar productos desde localStorage
export const loadProductos = (): ProductoProveedor[] => {
  const storedProductos = localStorage.getItem('productos_proveedor');
  if (!storedProductos) return [];
  
  return JSON.parse(storedProductos);
};

// Alias for backward compatibility
export const loadProductosProveedores = loadProductos;

// Función para buscar un proveedor por ID
export const findProveedor = (id: string): Proveedor | undefined => {
  const proveedores = loadProveedores();
  return proveedores.find(proveedor => proveedor.id === id);
};

// Función para editar un proveedor existente
export const editProveedor = (id: string, updates: Partial<Proveedor>): void => {
  const proveedores = loadProveedores();
  const updatedProveedores = proveedores.map(proveedor =>
    proveedor.id === id ? { ...proveedor, ...updates } : proveedor
  );
  saveProveedores(updatedProveedores);
};

// Función para eliminar un proveedor por ID
export const deleteProveedor = (id: string): void => {
  const proveedores = loadProveedores();
  const updatedProveedores = proveedores.filter(proveedor => proveedor.id !== id);
  saveProveedores(updatedProveedores);

   // Eliminar también los productos asociados a este proveedor
   const productos = loadProductos();
   const updatedProductos = productos.filter(producto => producto.proveedor_id !== id);
   saveProductos(updatedProductos);
};

// Función para obtener todos los productos de un proveedor específico
export const getProductosByProveedor = (proveedorId: string): ProductoProveedor[] => {
  const productos = loadProductos();
  return productos.filter(producto => producto.proveedor_id === proveedorId);
};

// Función para eliminar un producto de proveedor por ID
export const deleteProductoProveedor = (id: string): void => {
  const productos = loadProductos();
  const updatedProductos = productos.filter(producto => producto.id !== id);
  saveProductos(updatedProductos);
};

// Función para obtener tipos únicos de materiales de proveedores
export const getUniqueProviderMaterialTypes = (): string[] => {
  const productos = loadProductos();
  const tiposUnicos = [...new Set(productos.map(producto => producto.nombre_producto))];
  return tiposUnicos;
};
