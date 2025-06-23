
export interface TarifaCliente {
  id: string;
  cliente: string;
  finca: string;
  origen: string;
  destino: string;
  valor_material_cliente_m3?: number;
  valor_flete_m3?: number;
  valor_por_hora?: number;
  activa: boolean;
  fecha_creacion: Date;
  observaciones?: string;
}

export interface TarifaEscombrera {
  id: string;
  cliente: string;
  tipo_escombrera: 'escombrera_maquipaes' | 'escombrera_externa';
  ubicacion: string;
  valor_volqueta_sencilla?: number;
  valor_volqueta_doble_troque?: number;
  activa: boolean;
  fecha_creacion: Date;
  observaciones?: string;
}

// Función para crear una nueva tarifa de cliente
export const createTarifaCliente = (
  cliente: string,
  finca: string,
  origen: string,
  destino: string,
  valor_material_cliente_m3?: number,
  valor_flete_m3?: number,
  valor_por_hora?: number,
  observaciones?: string
): TarifaCliente => {
  return {
    id: Date.now().toString(),
    cliente,
    finca,
    origen,
    destino,
    valor_material_cliente_m3,
    valor_flete_m3,
    valor_por_hora,
    activa: true,
    fecha_creacion: new Date(),
    observaciones
  };
};

// Función para crear una nueva tarifa de escombrera
export const createTarifaEscombrera = (
  cliente: string,
  tipo_escombrera: 'escombrera_maquipaes' | 'escombrera_externa',
  ubicacion: string,
  valor_volqueta_sencilla?: number,
  valor_volqueta_doble_troque?: number,
  observaciones?: string
): TarifaEscombrera => {
  return {
    id: Date.now().toString(),
    cliente,
    tipo_escombrera,
    ubicacion,
    valor_volqueta_sencilla,
    valor_volqueta_doble_troque,
    activa: true,
    fecha_creacion: new Date(),
    observaciones
  };
};

// Función para guardar tarifas de cliente en localStorage
export const saveTarifasCliente = (tarifas: TarifaCliente[]): void => {
  try {
    console.log('💾 Guardando tarifas de cliente:', tarifas.length);
    localStorage.setItem('tarifas_cliente', JSON.stringify(tarifas));
    console.log('✅ Tarifas de cliente guardadas exitosamente');
  } catch (error) {
    console.error('❌ Error guardando tarifas de cliente:', error);
    throw error;
  }
};

// Función para cargar tarifas de cliente desde localStorage
export const loadTarifasCliente = (): TarifaCliente[] => {
  try {
    console.log('📂 Cargando tarifas de cliente...');
    const storedTarifas = localStorage.getItem('tarifas_cliente');
    
    if (!storedTarifas) {
      console.log('ℹ️ No hay tarifas de cliente almacenadas');
      return [];
    }
    
    const parsedTarifas = JSON.parse(storedTarifas).map((tarifa: any) => ({
      ...tarifa,
      fecha_creacion: new Date(tarifa.fecha_creacion)
    }));
    
    console.log('✅ Tarifas de cliente cargadas:', parsedTarifas.length);
    return parsedTarifas;
  } catch (error) {
    console.error('❌ Error cargando tarifas de cliente:', error);
    return [];
  }
};

// Función para guardar tarifas de escombrera en localStorage
export const saveTarifasEscombrera = (tarifas: TarifaEscombrera[]): void => {
  try {
    console.log('💾 Guardando tarifas de escombrera:', tarifas.length);
    localStorage.setItem('tarifas_escombrera', JSON.stringify(tarifas));
    console.log('✅ Tarifas de escombrera guardadas exitosamente');
  } catch (error) {
    console.error('❌ Error guardando tarifas de escombrera:', error);
    throw error;
  }
};

// Función para cargar tarifas de escombrera desde localStorage
export const loadTarifasEscombrera = (): TarifaEscombrera[] => {
  try {
    console.log('📂 Cargando tarifas de escombrera...');
    const storedTarifas = localStorage.getItem('tarifas_escombrera');
    
    if (!storedTarifas) {
      console.log('ℹ️ No hay tarifas de escombrera almacenadas');
      return [];
    }
    
    const parsedTarifas = JSON.parse(storedTarifas).map((tarifa: any) => ({
      ...tarifa,
      fecha_creacion: new Date(tarifa.fecha_creacion)
    }));
    
    console.log('✅ Tarifas de escombrera cargadas:', parsedTarifas.length);
    return parsedTarifas;
  } catch (error) {
    console.error('❌ Error cargando tarifas de escombrera:', error);
    return [];
  }
};

// Función para buscar tarifa de cliente específica
export const findTarifaCliente = (
  cliente: string,
  finca: string,
  origen: string,
  destino: string
): TarifaCliente | undefined => {
  const tarifas = loadTarifasCliente();
  
  // Buscar coincidencia exacta
  let tarifaEncontrada = tarifas.find(t => 
    t.activa &&
    t.cliente === cliente &&
    t.finca === finca &&
    t.origen === origen &&
    t.destino === destino
  );
  
  // Si no se encuentra exacta, buscar por cliente y finca
  if (!tarifaEncontrada) {
    tarifaEncontrada = tarifas.find(t => 
      t.activa &&
      t.cliente === cliente &&
      t.finca === finca
    );
  }
  
  // Si no se encuentra, buscar solo por cliente
  if (!tarifaEncontrada) {
    tarifaEncontrada = tarifas.find(t => 
      t.activa &&
      t.cliente === cliente
    );
  }
  
  return tarifaEncontrada;
};

// Función para buscar tarifa de escombrera específica
export const findTarifaEscombrera = (
  cliente: string,
  tipo_escombrera: string,
  ubicacion: string
): TarifaEscombrera | undefined => {
  const tarifas = loadTarifasEscombrera();
  
  return tarifas.find(t => 
    t.activa &&
    t.cliente === cliente &&
    t.tipo_escombrera === tipo_escombrera &&
    t.ubicacion === ubicacion
  );
};
