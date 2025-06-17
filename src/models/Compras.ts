
export interface Compra {
  id: string;
  fecha: Date;
  proveedor_id: string;
  proveedor_nombre: string;
  tipo_insumo: 'Material' | 'Lubricante' | 'Repuesto' | 'Servicio' | 'Otro';
  tipo_documento: 'Factura' | 'Remisión' | 'Otro';
  numero_documento: string;
  forma_pago: 'Contado' | 'Crédito' | 'Otro';
  destino_insumo: 'Acopio Maquipaes' | 'Taller' | 'Maquinaria específica' | 'Otro';
  observaciones?: string;
  total: number;
  detalles: DetalleCompra[];
  fechaRegistro: string;
}

export interface DetalleCompra {
  id: string;
  compra_id: string;
  nombre_producto: string;
  unidad: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  observaciones?: string;
}

export const createCompra = (
  fecha: Date,
  proveedor_id: string,
  proveedor_nombre: string,
  tipo_insumo: 'Material' | 'Lubricante' | 'Repuesto' | 'Servicio' | 'Otro',
  tipo_documento: 'Factura' | 'Remisión' | 'Otro',
  numero_documento: string,
  forma_pago: 'Contado' | 'Crédito' | 'Otro',
  destino_insumo: 'Acopio Maquipaes' | 'Taller' | 'Maquinaria específica' | 'Otro',
  observaciones?: string
): Compra => {
  return {
    id: Date.now().toString(),
    fecha,
    proveedor_id,
    proveedor_nombre,
    tipo_insumo,
    tipo_documento,
    numero_documento,
    forma_pago,
    destino_insumo,
    observaciones,
    total: 0,
    detalles: [],
    fechaRegistro: new Date().toISOString()
  };
};

export const createDetalleCompra = (
  compra_id: string,
  nombre_producto: string,
  unidad: string,
  cantidad: number,
  precio_unitario: number,
  observaciones?: string
): DetalleCompra => {
  return {
    id: Date.now().toString(),
    compra_id,
    nombre_producto,
    unidad,
    cantidad,
    precio_unitario,
    subtotal: cantidad * precio_unitario,
    observaciones
  };
};

export const updateCompraTotal = (compra: Compra): Compra => {
  const total = compra.detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0);
  return { ...compra, total };
};

export const loadCompras = (): Compra[] => {
  try {
    const stored = localStorage.getItem('compras');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading compras:', error);
    return [];
  }
};

export const saveCompras = (compras: Compra[]): void => {
  try {
    localStorage.setItem('compras', JSON.stringify(compras));
  } catch (error) {
    console.error('Error saving compras:', error);
  }
};
