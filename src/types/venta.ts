
// Core types for sales system
export type Venta = {
  id: string;
  fecha: Date;
  cliente: string;
  ciudad_entrega: string;
  tipo_venta: 'Solo material' | 'Solo transporte' | 'Material + transporte' | 'Alquiler por horas' | 'Escombrera' | 'Otros';
  origen_material: string;
  destino_material: string;
  forma_pago: string;
  observaciones?: string;
  total_venta: number;
  detalles: DetalleVenta[];
  // Nuevos campos mejorados
  actividad_generadora?: string; // Qué actividad generó la venta
  tipo_registro?: 'Automática' | 'Manual';
  // Nuevos campos para enriquecer el reporte
  maquina_utilizada?: string;
  horas_trabajadas?: number;
  viajes_realizados?: number;
  cantidad_material_m3?: number;
};

export type DetalleVenta = {
  id: string;
  tipo: 'Material' | 'Flete' | 'Alquiler' | 'Servicio';
  producto_servicio: string;
  cantidad_m3: number;
  valor_unitario: number;
  subtotal: number;
};
