
export interface ServicioTransporte {
  id: string;
  fecha: Date;
  cliente: string;
  finca?: string;
  origen: string;
  destino: string;
  tipo_material: string;
  cantidad_m3: number;
  valor_flete_m3: number;
  valor_material_m3?: number;
  vehiculo?: string;
  conductor?: string;
  observacion?: string;
  numero_viajes: number;
  fechaRegistro: string;
}

export const loadServiciosTransporte = (): ServicioTransporte[] => {
  try {
    const stored = localStorage.getItem('servicios_transporte');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading servicios transporte:', error);
    return [];
  }
};

export const saveServiciosTransporte = (servicios: ServicioTransporte[]): void => {
  try {
    localStorage.setItem('servicios_transporte', JSON.stringify(servicios));
  } catch (error) {
    console.error('Error saving servicios transporte:', error);
  }
};

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
  observacion?: string,
  numero_viajes: number = 1
): ServicioTransporte => {
  return {
    id: Date.now().toString(),
    fecha,
    cliente,
    finca,
    origen,
    destino,
    tipo_material,
    cantidad_m3,
    valor_flete_m3,
    valor_material_m3,
    vehiculo,
    conductor,
    observacion,
    numero_viajes,
    fechaRegistro: new Date().toISOString()
  };
};
