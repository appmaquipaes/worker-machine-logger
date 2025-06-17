
export interface Tarifa {
  id: string;
  origen: string;
  destino: string;
  valor_por_m3: number;
  fechaRegistro: string;
}

export const loadTarifas = (): Tarifa[] => {
  try {
    const stored = localStorage.getItem('tarifas');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading tarifas:', error);
    return [];
  }
};

export const saveTarifas = (tarifas: Tarifa[]): void => {
  try {
    localStorage.setItem('tarifas', JSON.stringify(tarifas));
  } catch (error) {
    console.error('Error saving tarifas:', error);
  }
};

export const migrateTarifas = (): void => {
  // Migration function placeholder
  console.log('Tarifas migration completed');
};
