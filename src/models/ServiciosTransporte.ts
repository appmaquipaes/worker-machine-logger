
// Define el tipo para servicios de transporte (solo flete)
export type ServicioTransporte = {
  id: string;
  fecha: Date;
  cliente: string;
  finca: string;
  origen: string;
  destino: string;
  tipo_material: string;
  cantidad_m3: number;
  valor_flete_m3: number;
  total_flete: number;
  valor_material_m3?: number; // Para control cuando cliente compra directo
  total_material_referencia?: number; // Para reportes de control
  vehiculo?: string;
  conductor?: string;
  observaciones?: string;
  numero_viajes: number;
};

// Función para crear un nuevo servicio de transporte
export const createServicioTransporte = (
  fecha: Date,
  cliente: string,
  finca: string,
  origen: string,
  destino: string,
  tipo_material: string,
  cantidad_m3: number,
  valor_flete_m3: number,
  valor_material_m3?: number,
  vehiculo?: string,
  conductor?: string,
  observaciones?: string,
  numero_viajes: number = 1
): ServicioTransporte => {
  const total_flete = cantidad_m3 * valor_flete_m3;
  const total_material_referencia = valor_material_m3 ? cantidad_m3 * valor_material_m3 : undefined;
  
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    fecha,
    cliente,
    finca,
    origen,
    destino,
    tipo_material,
    cantidad_m3,
    valor_flete_m3,
    total_flete,
    valor_material_m3,
    total_material_referencia,
    vehiculo,
    conductor,
    observaciones,
    numero_viajes
  };
};

// Función para guardar servicios de transporte en localStorage
export const saveServiciosTransporte = (servicios: ServicioTransporte[]): void => {
  localStorage.setItem('servicios_transporte', JSON.stringify(servicios));
};

// Función para cargar servicios de transporte desde localStorage
export const loadServiciosTransporte = (): ServicioTransporte[] => {
  const storedServicios = localStorage.getItem('servicios_transporte');
  if (!storedServicios) return [];
  
  return JSON.parse(storedServicios).map((servicio: any) => ({
    ...servicio,
    fecha: new Date(servicio.fecha)
  }));
};
