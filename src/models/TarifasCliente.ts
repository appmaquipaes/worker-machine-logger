// Define el tipo para tarifas de flete por cliente
export type TarifaCliente = {
  id: string;
  cliente: string;
  finca?: string;
  
  // Campos para servicios de transporte
  origen?: string;
  destino?: string;
  valor_flete_m3?: number;
  valor_material_m3?: number; // Valor de referencia del material
  valor_material_cliente_m3?: number; // Valor que se le cobra al cliente (para márgenes)
  tipo_material?: string; // ID del tipo de material
  
  // Campos para alquiler de maquinaria
  tipo_servicio: 'transporte' | 'alquiler_maquina' | 'recepcion_escombrera';
  maquina_id?: string; // ID de la máquina cuando es alquiler
  tipo_maquina?: string; // Tipo de máquina para mostrar en la tabla
  modalidad_cobro?: 'por_hora' | 'por_dia' | 'por_mes';
  valor_por_hora?: number;
  valor_por_dia?: number;
  valor_por_mes?: number;
  
  // Campos específicos para recepción de escombrera
  escombrera_id?: string; // ID de la escombrera
  valor_volqueta_sencilla?: number;
  valor_volqueta_doble_troque?: number;
  
  activa: boolean;
  fecha_creacion: Date;
  observaciones?: string;
};

// Función para crear una nueva tarifa de transporte
export const createTarifaTransporte = (
  cliente: string,
  finca: string | undefined,
  origen: string,
  destino: string,
  valor_flete_m3: number,
  valor_material_m3?: number,
  valor_material_cliente_m3?: number,
  observaciones?: string,
  tipo_material?: string
): TarifaCliente => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    cliente,
    finca,
    origen,
    destino,
    valor_flete_m3,
    valor_material_m3,
    valor_material_cliente_m3,
    tipo_material,
    tipo_servicio: 'transporte',
    activa: true,
    fecha_creacion: new Date(),
    observaciones
  };
};

// Función para crear una nueva tarifa de alquiler de maquinaria
export const createTarifaAlquiler = (
  cliente: string,
  finca: string | undefined,
  maquina_id: string,
  tipo_maquina: string,
  valor_por_hora?: number,
  valor_por_dia?: number,
  valor_por_mes?: number,
  observaciones?: string
): TarifaCliente => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    cliente,
    finca,
    maquina_id,
    tipo_maquina,
    tipo_servicio: 'alquiler_maquina',
    valor_por_hora,
    valor_por_dia,
    valor_por_mes,
    activa: true,
    fecha_creacion: new Date(),
    observaciones
  };
};

// Función para crear una nueva tarifa de recepción de escombrera
export const createTarifaEscombrera = (
  cliente: string,
  finca: string | undefined,
  escombrera_id: string,
  valor_volqueta_sencilla: number,
  valor_volqueta_doble_troque: number,
  observaciones?: string
): TarifaCliente => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    cliente,
    finca,
    escombrera_id,
    tipo_servicio: 'recepcion_escombrera',
    valor_volqueta_sencilla,
    valor_volqueta_doble_troque,
    activa: true,
    fecha_creacion: new Date(),
    observaciones
  };
};

// Función legacy para mantener compatibilidad
export const createTarifaCliente = createTarifaTransporte;

// Función para guardar tarifas de clientes en localStorage
export const saveTarifasCliente = (tarifas: TarifaCliente[]): void => {
  localStorage.setItem('tarifas_cliente', JSON.stringify(tarifas));
};

// Función para cargar tarifas de clientes desde localStorage
export const loadTarifasCliente = (): TarifaCliente[] => {
  const storedTarifas = localStorage.getItem('tarifas_cliente');
  if (!storedTarifas) return [];
  
  return JSON.parse(storedTarifas).map((tarifa: any) => ({
    ...tarifa,
    fecha_creacion: new Date(tarifa.fecha_creacion)
  }));
};

// Función para buscar tarifa específica por cliente, origen y destino
export const findTarifaCliente = (
  cliente: string,
  finca: string | undefined,
  origen: string,
  destino: string
): TarifaCliente | null => {
  const tarifas = loadTarifasCliente();
  
  console.log('🔍 BÚSQUEDA DETALLADA DE TARIFA CLIENTE:');
  console.log('📋 Parámetros de búsqueda:', {
    cliente,
    finca,
    origen,
    destino
  });
  console.log('📋 Total tarifas en sistema:', tarifas.length);
  console.log('📋 Todas las tarifas disponibles:', tarifas.map(t => ({
    id: t.id,
    cliente: t.cliente,
    finca: t.finca,
    origen: t.origen,
    destino: t.destino,
    valor_flete_m3: t.valor_flete_m3,
    valor_material_cliente_m3: t.valor_material_cliente_m3,
    activa: t.activa,
    tipo_servicio: t.tipo_servicio
  })));
  
  // Buscar coincidencia exacta con finca
  console.log('🎯 Búsqueda 1: Coincidencia exacta con finca');
  let tarifa = tarifas.find(t => {
    const coincide = t.activa && 
      t.cliente === cliente && 
      t.finca === finca &&
      t.origen === origen && 
      t.destino === destino;
    
    console.log(`  - Tarifa ${t.id}: cliente=${t.cliente === cliente}, finca=${t.finca === finca}, origen=${t.origen === origen}, destino=${t.destino === destino}, activa=${t.activa} → ${coincide}`);
    return coincide;
  });
  
  if (tarifa) {
    console.log('✅ Tarifa encontrada con coincidencia exacta:', tarifa);
    return tarifa;
  }
  
  // Si no encuentra con finca específica, buscar solo por cliente
  console.log('🎯 Búsqueda 2: Sin finca específica');
  tarifa = tarifas.find(t => {
    const coincide = t.activa && 
      t.cliente === cliente && 
      !t.finca &&
      t.origen === origen && 
      t.destino === destino;
    
    console.log(`  - Tarifa ${t.id}: cliente=${t.cliente === cliente}, sin_finca=${!t.finca}, origen=${t.origen === origen}, destino=${t.destino === destino}, activa=${t.activa} → ${coincide}`);
    return coincide;
  });
  
  if (tarifa) {
    console.log('✅ Tarifa encontrada sin finca específica:', tarifa);
    return tarifa;
  }
  
  console.log('❌ No se encontró ninguna tarifa que coincida');
  return null;
};

// Función para obtener todas las tarifas de un cliente
export const getTarifasByCliente = (cliente: string): TarifaCliente[] => {
  const tarifas = loadTarifasCliente();
  return tarifas.filter(t => t.cliente === cliente && t.activa);
};

// Función para buscar tarifa específica de escombrera
export const findTarifaEscombrera = (
  cliente: string,
  escombrera_id: string,
  finca?: string
): TarifaCliente | null => {
  const tarifas = loadTarifasCliente();
  
  // Buscar coincidencia exacta con finca
  let tarifa = tarifas.find(t => 
    t.activa && 
    t.tipo_servicio === 'recepcion_escombrera' &&
    t.cliente === cliente && 
    t.finca === finca &&
    t.escombrera_id === escombrera_id
  );
  
  // Si no encuentra con finca específica, buscar solo por cliente
  if (!tarifa) {
    tarifa = tarifas.find(t => 
      t.activa && 
      t.tipo_servicio === 'recepcion_escombrera' &&
      t.cliente === cliente && 
      !t.finca &&
      t.escombrera_id === escombrera_id
    );
  }
  
  return tarifa || null;
};
