
// Define el tipo para el detalle de cada compra
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

// Define el tipo para la compra principal
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
}

// Crear una nueva compra
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
    detalles: []
  };
};

// Crear un nuevo detalle de compra
export const createDetalleCompra = (
  compra_id: string,
  nombre_producto: string,
  unidad: string,
  cantidad: number,
  precio_unitario: number,
  observaciones?: string
): DetalleCompra => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    compra_id,
    nombre_producto,
    unidad,
    cantidad,
    precio_unitario,
    subtotal: cantidad * precio_unitario,
    observaciones
  };
};

// Cargar compras desde localStorage
export const loadCompras = (): Compra[] => {
  const comprasString = localStorage.getItem('compras');
  if (!comprasString) return [];

  try {
    return JSON.parse(comprasString).map((compra: any) => ({
      ...compra,
      fecha: new Date(compra.fecha)
    }));
  } catch (error) {
    console.error('Error loading purchases:', error);
    return [];
  }
};

// Guardar compras en localStorage
export const saveCompras = (compras: Compra[]): void => {
  localStorage.setItem('compras', JSON.stringify(compras));
};

// Calcular el total de una compra
export const calculateCompraTotal = (detalles: DetalleCompra[]): number => {
  return detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
};

// Actualizar total de compra
export const updateCompraTotal = (compra: Compra): Compra => {
  return {
    ...compra,
    total: calculateCompraTotal(compra.detalles)
  };
};
