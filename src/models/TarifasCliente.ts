
// Define el tipo para tarifas de flete por cliente
export type TarifaCliente = {
  id: string;
  cliente: string;
  finca?: string;
  origen: string;
  destino: string;
  valor_flete_m3: number;
  valor_material_m3?: number; // Para controles cuando el cliente compra directo
  activa: boolean;
  fecha_creacion: Date;
  observaciones?: string;
};

// Función para crear una nueva tarifa de cliente
export const createTarifaCliente = (
  cliente: string,
  finca: string | undefined,
  origen: string,
  destino: string,
  valor_flete_m3: number,
  valor_material_m3?: number,
  observaciones?: string
): TarifaCliente => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    cliente,
    finca,
    origen,
    destino,
    valor_flete_m3,
    valor_material_m3,
    activa: true,
    fecha_creacion: new Date(),
    observaciones
  };
};

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
  
  // Buscar coincidencia exacta con finca
  let tarifa = tarifas.find(t => 
    t.activa && 
    t.cliente === cliente && 
    t.finca === finca &&
    t.origen === origen && 
    t.destino === destino
  );
  
  // Si no encuentra con finca específica, buscar solo por cliente
  if (!tarifa) {
    tarifa = tarifas.find(t => 
      t.activa && 
      t.cliente === cliente && 
      !t.finca &&
      t.origen === origen && 
      t.destino === destino
    );
  }
  
  return tarifa || null;
};

// Función para obtener todas las tarifas de un cliente
export const getTarifasByCliente = (cliente: string): TarifaCliente[] => {
  const tarifas = loadTarifasCliente();
  return tarifas.filter(t => t.cliente === cliente && t.activa);
};
