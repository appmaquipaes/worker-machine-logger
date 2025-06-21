// Define el tipo para tarifas de flete
export type Tarifa = {
  id: string;
  origen: string;
  destino: string;
  valor_por_m3: number; // Para tarifas de transporte por volumen
  valor_por_hora?: number; // Para tarifas de maquinaria por horas trabajadas
};

// Función para guardar tarifas en localStorage
export const saveTarifas = (tarifas: Tarifa[]): void => {
  localStorage.setItem('tarifas_flete', JSON.stringify(tarifas));
};

// Función para cargar tarifas desde localStorage
export const loadTarifas = (): Tarifa[] => {
  const storedTarifas = localStorage.getItem('tarifas_flete');
  return storedTarifas ? JSON.parse(storedTarifas) : [];
};

// Función para migrar datos de valor_flete a valor_por_m3
export const migrateTarifas = (): void => {
  const storedTarifas = localStorage.getItem('tarifas_flete');
  if (!storedTarifas) return;
  
  const tarifas = JSON.parse(storedTarifas);
  
  // Si hay al menos una tarifa con el campo valor_flete, migrar todas
  if (tarifas.length > 0 && 'valor_flete' in tarifas[0]) {
    const migratedTarifas = tarifas.map((tarifa: any) => ({
      id: tarifa.id,
      origen: tarifa.origen,
      destino: tarifa.destino,
      valor_por_m3: tarifa.valor_flete // Migrar el valor al nuevo campo
    }));
    
    saveTarifas(migratedTarifas);
  }
};
