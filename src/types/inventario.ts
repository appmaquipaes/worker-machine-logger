
// Tipos para el sistema de inventario
export type TipoMovimientoInventario = 'entrada' | 'salida' | 'desglose' | 'ajuste_manual';

export type MovimientoInventario = {
  id: string;
  fecha: Date;
  tipo: TipoMovimientoInventario;
  material: string;
  cantidad: number;
  cantidadAnterior: number;
  cantidadPosterior: number;
  origen?: string;
  destino?: string;
  reporteId?: string;
  maquinaId?: string;
  maquinaNombre?: string;
  usuario?: string;
  observaciones?: string;
  detalleCalculo?: string;
};

// Tipo para validaciones de operaciones
export type ValidacionInventario = {
  esValida: boolean;
  mensaje?: string;
  cantidadDisponible?: number;
};

// Tipo para resultado de operaciones
export type ResultadoOperacionInventario = {
  exito: boolean;
  mensaje: string;
  movimientoId?: string;
  inventarioActualizado?: any[];
};
