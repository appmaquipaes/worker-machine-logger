
// Define el tipo para las ventas
export type Venta = {
  id: string;
  fecha: Date;
  cliente: string;
  ciudad_entrega: string;
  tipo_venta: 'Solo material' | 'Solo transporte' | 'Material + transporte';
  origen_material: string;
  destino_material: string;
  forma_pago: string;
  observaciones?: string;
  total_venta: number;
  detalles: DetalleVenta[];
};

export type DetalleVenta = {
  id: string;
  tipo: 'Material' | 'Flete';
  producto_servicio: string;
  cantidad_m3: number;
  valor_unitario: number;
  subtotal: number;
};

// Tipos de venta disponibles - actualizado para incluir "Solo transporte"
export const tiposVenta = [
  'Solo material',
  'Solo transporte', 
  'Material + transporte'
];

// Formas de pago disponibles
export const formasPago = [
  'Efectivo',
  'Transferencia',
  'Cheque',
  'Crédito',
  'Mixto'
];

// Origenes de material
export const origenesMaterial = [
  'Acopio Maquipaes',
  'Cantera San José',
  'Cantera El Roble',
  'Cantera La Esperanza',
  'Otro'
];

// Función para crear una nueva venta
export const createVenta = (
  fecha: Date,
  cliente: string,
  ciudad_entrega: string,
  tipo_venta: string,
  origen_material: string,
  destino_material: string,
  forma_pago: string,
  observaciones?: string
): Venta => {
  return {
    id: Date.now().toString(),
    fecha,
    cliente,
    ciudad_entrega,
    tipo_venta: tipo_venta as any,
    origen_material,
    destino_material,
    forma_pago,
    observaciones,
    total_venta: 0,
    detalles: []
  };
};

// Función para crear un nuevo detalle de venta
export const createDetalleVenta = (
  tipo: 'Material' | 'Flete',
  producto_servicio: string,
  cantidad_m3: number,
  valor_unitario: number
): DetalleVenta => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    tipo,
    producto_servicio,
    cantidad_m3,
    valor_unitario,
    subtotal: cantidad_m3 * valor_unitario
  };
};

// Función para calcular el total de una venta
export const calculateVentaTotal = (detalles: DetalleVenta[]): number => {
  return detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
};

// Función para actualizar el total de una venta
export const updateVentaTotal = (venta: Venta): Venta => {
  return {
    ...venta,
    total_venta: calculateVentaTotal(venta.detalles)
  };
};

// Función para guardar ventas en localStorage
export const saveVentas = (ventas: Venta[]): void => {
  localStorage.setItem('ventas', JSON.stringify(ventas));
};

// Función para cargar ventas desde localStorage
export const loadVentas = (): Venta[] => {
  const storedVentas = localStorage.getItem('ventas');
  if (!storedVentas) return [];
  
  return JSON.parse(storedVentas).map((venta: any) => ({
    ...venta,
    fecha: new Date(venta.fecha)
  }));
};
