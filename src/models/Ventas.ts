// Define el tipo para las ventas
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

// Tipos de venta disponibles - actualizado según especificaciones
export const tiposVenta = [
  'Solo material',
  'Solo transporte', 
  'Material + transporte',
  'Alquiler por horas',
  'Escombrera',
  'Otros'
];

// Formas de pago disponibles - actualizado con opciones más específicas
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
  observaciones?: string,
  actividad_generadora?: string
): Venta => {
  const esAutomatica = observaciones?.includes('Venta automática') || false;
  
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
    detalles: [],
    actividad_generadora: actividad_generadora || 'Venta manual',
    tipo_registro: esAutomatica ? 'Automática' : 'Manual'
  };
};

// Función para crear un nuevo detalle de venta
export const createDetalleVenta = (
  tipo: 'Material' | 'Flete' | 'Alquiler' | 'Servicio',
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

// Función para determinar el tipo de venta basado en la actividad - ACTUALIZADA
export const determinarTipoVentaPorActividad = (
  actividad: string,
  reportType: string,
  maquina: string
): string => {
  const maquinaLower = maquina.toLowerCase();
  const tipoMaquina = getTipoMaquinaFromName(maquina);
  
  // Mapeo específico por tipo de máquina según las especificaciones
  switch (tipoMaquina) {
    case 'Retroexcavadora de Oruga':
    case 'Retroexcavadora de Llanta':
    case 'Vibrocompactador':
    case 'Paladraga':
    case 'Bulldozer':
    case 'Motoniveladora':
      return 'Alquiler por horas';
    
    case 'Cargador':
      return 'Solo material';
    
    case 'Camabaja':
      return 'Solo transporte';
    
    case 'Escombrera':
      return 'Escombrera';
    
    case 'Volqueta':
    case 'Camión':
      // Para volquetas y camiones, determinar según el contexto
      if (reportType === 'Viajes') {
        return 'Solo transporte';
      }
      return 'Solo transporte';
    
    case 'Semirremolque':
    case 'Tractomula':
      return 'Solo transporte';
    
    default:
      return 'Otros';
  }
};

// Función auxiliar para determinar el tipo de máquina desde el nombre
const getTipoMaquinaFromName = (nombreMaquina: string): string => {
  const nombre = nombreMaquina.toLowerCase();
  
  // Mapeo basado en palabras clave en el nombre
  if (nombre.includes('cat') || nombre.includes('komatsu') || nombre.includes('excavator')) {
    return 'Retroexcavadora de Oruga';
  }
  if (nombre.includes('cargador')) {
    return 'Cargador';
  }
  if (nombre.includes('vibro')) {
    return 'Vibrocompactador';
  }
  if (nombre.includes('bulldozer') || nombre.includes('d6')) {
    return 'Bulldozer';
  }
  if (nombre.includes('motoniveladora')) {
    return 'Motoniveladora';
  }
  if (nombre.includes('paladraga')) {
    return 'Paladraga';
  }
  if (nombre.includes('camabaja')) {
    return 'Camabaja';
  }
  if (nombre.includes('volqueta') || nombre.includes('mack')) {
    return 'Volqueta';
  }
  if (nombre.includes('camión')) {
    return 'Camión';
  }
  if (nombre.includes('escombrera')) {
    return 'Escombrera';
  }
  if (nombre.includes('semirremolque')) {
    return 'Semirremolque';
  }
  if (nombre.includes('tractomula')) {
    return 'Tractomula';
  }
  
  return 'Otros';
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
