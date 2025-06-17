
export interface Venta {
  id: string;
  fecha: Date;
  cliente: string;
  ciudad_entrega?: string;
  tipo_venta: string;
  origen_material?: string;
  destino_material: string;
  forma_pago: string;
  observaciones?: string;
  total: number;
  total_venta: number;
  detalles: DetalleVenta[];
  fechaRegistro: string;
}

export interface DetalleVenta {
  id: string;
  venta_id?: string;
  tipo: 'Material' | 'Flete';
  producto_servicio: string;
  cantidad_m3: number;
  valor_unitario: number;
  subtotal: number;
}

export const tiposVenta = [
  'Venta Material',
  'Venta Flete',
  'Venta Mixta'
];

export const formasPago = [
  'Contado',
  'Crédito 30 días',
  'Crédito 60 días',
  'Transferencia',
  'Cheque'
];

export const origenesMaterial = [
  'Acopio Maquipaes',
  'Compra Directa',
  'Extracción Propia'
];

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
    tipo_venta,
    origen_material,
    destino_material,
    forma_pago,
    observaciones,
    total: 0,
    total_venta: 0,
    detalles: [],
    fechaRegistro: new Date().toISOString()
  };
};

export const createDetalleVenta = (
  tipo: 'Material' | 'Flete',
  producto_servicio: string,
  cantidad_m3: number,
  valor_unitario: number
): DetalleVenta => {
  return {
    id: Date.now().toString(),
    tipo,
    producto_servicio,
    cantidad_m3,
    valor_unitario,
    subtotal: cantidad_m3 * valor_unitario
  };
};

export const updateVentaTotal = (venta: Venta): Venta => {
  const total = venta.detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);
  return { ...venta, total, total_venta: total };
};

export const loadVentas = (): Venta[] => {
  try {
    const stored = localStorage.getItem('ventas');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading ventas:', error);
    return [];
  }
};

export const saveVentas = (ventas: Venta[]): void => {
  try {
    localStorage.setItem('ventas', JSON.stringify(ventas));
  } catch (error) {
    console.error('Error saving ventas:', error);
  }
};
