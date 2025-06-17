
export interface Maquina {
  id: string;
  name: string;
  type: string;
  status: string;
  plate?: string;
  fechaRegistro: string;
}

export const loadMaquinas = (): Maquina[] => {
  try {
    const stored = localStorage.getItem('machines');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading machines:', error);
    return [];
  }
};

export const saveMaquinas = (maquinas: Maquina[]): void => {
  try {
    localStorage.setItem('machines', JSON.stringify(maquinas));
  } catch (error) {
    console.error('Error saving machines:', error);
  }
};
