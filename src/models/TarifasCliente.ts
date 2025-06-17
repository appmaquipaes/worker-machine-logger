
export interface TarifaCliente {
  id: string;
  cliente: string;
  finca?: string;
  origen: string;
  destino: string;
  valor_flete_m3: number;
  fechaRegistro: string;
  tipo_servicio: 'transporte' | 'alquiler_maquina';
  observaciones?: string;
  tipo_material?: string;
  valor_material_m3?: number;
  valor_material_cliente_m3?: number;
  maquina_id?: string;
  valor_por_hora?: number;
  valor_por_dia?: number;
  valor_por_mes?: number;
  tipo_maquina?: string;
  activa: boolean;
  fecha_creacion: string;
}

export const findTarifaCliente = (
  cliente: string,
  finca: string,
  origen: string,
  destino: string
): TarifaCliente | undefined => {
  try {
    const stored = localStorage.getItem('tarifas_cliente');
    const tarifas: TarifaCliente[] = stored ? JSON.parse(stored) : [];
    
    return tarifas.find(tarifa => 
      tarifa.cliente === cliente &&
      tarifa.finca === finca &&
      tarifa.origen === origen &&
      tarifa.destino === destino
    );
  } catch (error) {
    console.error('Error finding tarifa cliente:', error);
    return undefined;
  }
};

export const loadTarifasCliente = (): TarifaCliente[] => {
  try {
    const stored = localStorage.getItem('tarifas_cliente');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tarifas cliente:', error);
    return [];
  }
};

export const saveTarifasCliente = (tarifas: TarifaCliente[]): void => {
  try {
    localStorage.setItem('tarifas_cliente', JSON.stringify(tarifas));
  } catch (error) {
    console.error('Error saving tarifas cliente:', error);
  }
};

export const getTarifasByCliente = (clienteId: string): TarifaCliente[] => {
  const tarifas = loadTarifasCliente();
  return tarifas.filter(tarifa => tarifa.cliente === clienteId && tarifa.activa);
};

export const createTarifaTransporte = (
  cliente: string,
  finca?: string,
  origen?: string,
  destino?: string,
  valor_flete_m3?: number,
  valor_material_m3?: number,
  valor_material_cliente_m3?: number,
  observaciones?: string,
  tipo_material?: string
): TarifaCliente => {
  return {
    id: Date.now().toString(),
    cliente,
    finca,
    origen: origen || '',
    destino: destino || '',
    valor_flete_m3: valor_flete_m3 || 0,
    fechaRegistro: new Date().toISOString(),
    tipo_servicio: 'transporte',
    observaciones,
    tipo_material,
    valor_material_m3,
    valor_material_cliente_m3,
    activa: true,
    fecha_creacion: new Date().toISOString()
  };
};

export const createTarifaAlquiler = (
  cliente: string,
  finca?: string,
  maquina_id?: string,
  tipo_maquina?: string,
  valor_por_hora?: number,
  valor_por_dia?: number,
  valor_por_mes?: number,
  observaciones?: string
): TarifaCliente => {
  return {
    id: Date.now().toString(),
    cliente,
    finca,
    origen: '',
    destino: '',
    valor_flete_m3: 0,
    fechaRegistro: new Date().toISOString(),
    tipo_servicio: 'alquiler_maquina',
    observaciones,
    maquina_id,
    valor_por_hora,
    valor_por_dia,
    valor_por_mes,
    tipo_maquina,
    activa: true,
    fecha_creacion: new Date().toISOString()
  };
};
