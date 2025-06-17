
export interface Maquina {
  id: string;
  name: string;
  type: string;
  plate?: string;
  imageUrl?: string;
  status: 'Disponible' | 'En Uso' | 'Mantenimiento';
  hoursWorked?: number;
  lastMaintenance?: Date;
}

export const loadMaquinas = (): Maquina[] => {
  const maquinasString = localStorage.getItem('machines');
  if (!maquinasString) return [];

  try {
    return JSON.parse(maquinasString).map((maquina: any) => ({
      ...maquina,
      lastMaintenance: maquina.lastMaintenance ? new Date(maquina.lastMaintenance) : undefined
    }));
  } catch (error) {
    console.error('Error loading maquinas:', error);
    return [];
  }
};

export const saveMaquinas = (maquinas: Maquina[]): void => {
  localStorage.setItem('machines', JSON.stringify(maquinas));
};
