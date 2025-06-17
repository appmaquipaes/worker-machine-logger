
// Define el tipo para tarifas de escombrera
export type TarifaEscombrera = {
  id: string;
  cliente: string;
  valor_volqueta_sencilla: number;
  valor_volqueta_doble_troque: number;
  activa: boolean;
  fecha_creacion: Date;
  observaciones?: string;
};

// Función para crear una nueva tarifa de escombrera
export const createTarifaEscombrera = (
  cliente: string,
  valor_volqueta_sencilla: number,
  valor_volqueta_doble_troque: number,
  observaciones?: string
): TarifaEscombrera => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    cliente,
    valor_volqueta_sencilla,
    valor_volqueta_doble_troque,
    activa: true,
    fecha_creacion: new Date(),
    observaciones
  };
};

// Función para guardar tarifas de escombrera en localStorage
export const saveTarifasEscombrera = (tarifas: TarifaEscombrera[]): void => {
  localStorage.setItem('tarifas_escombrera', JSON.stringify(tarifas));
};

// Función para cargar tarifas de escombrera desde localStorage
export const loadTarifasEscombrera = (): TarifaEscombrera[] => {
  const storedTarifas = localStorage.getItem('tarifas_escombrera');
  if (!storedTarifas) return [];
  
  return JSON.parse(storedTarifas).map((tarifa: any) => ({
    ...tarifa,
    fecha_creacion: new Date(tarifa.fecha_creacion)
  }));
};

// Función para buscar tarifa de escombrera por cliente
export const findTarifaEscombrera = (cliente: string): TarifaEscombrera | null => {
  const tarifas = loadTarifasEscombrera();
  return tarifas.find(t => t.activa && t.cliente === cliente) || null;
};

// Función para obtener todas las tarifas de escombrera
export const getAllTarifasEscombrera = (): TarifaEscombrera[] => {
  return loadTarifasEscombrera().filter(t => t.activa);
};
