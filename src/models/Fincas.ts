
export interface Finca {
  id: string;
  nombre: string;
  cliente_id: string;
  ubicacion?: string;
  area?: number;
  tipo_cultivo?: string;
  observaciones?: string;
  activa: boolean;
  fechaRegistro: string;
}

export const loadFincas = (): Finca[] => {
  try {
    const stored = localStorage.getItem('fincas');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading fincas:', error);
    return [];
  }
};

export const saveFincas = (fincas: Finca[]): void => {
  try {
    localStorage.setItem('fincas', JSON.stringify(fincas));
  } catch (error) {
    console.error('Error saving fincas:', error);
  }
};

export const getFincasByCliente = (clienteId: string): Finca[] => {
  const fincas = loadFincas();
  return fincas.filter(finca => finca.cliente_id === clienteId && finca.activa);
};

export const createFinca = (
  nombre: string,
  cliente_id: string,
  ubicacion?: string,
  area?: number,
  tipo_cultivo?: string,
  observaciones?: string
): Finca => {
  return {
    id: Date.now().toString(),
    nombre,
    cliente_id,
    ubicacion,
    area,
    tipo_cultivo,
    observaciones,
    activa: true,
    fechaRegistro: new Date().toISOString()
  };
};

export const getFincaById = (id: string): Finca | undefined => {
  const fincas = loadFincas();
  return fincas.find(finca => finca.id === id);
};

export const updateFinca = (id: string, updates: Partial<Finca>): boolean => {
  try {
    const fincas = loadFincas();
    const index = fincas.findIndex(finca => finca.id === id);
    
    if (index === -1) return false;
    
    fincas[index] = { ...fincas[index], ...updates };
    saveFincas(fincas);
    return true;
  } catch (error) {
    console.error('Error updating finca:', error);
    return false;
  }
};

export const deleteFinca = (id: string): boolean => {
  try {
    const fincas = loadFincas();
    const fincasFiltradas = fincas.filter(finca => finca.id !== id);
    saveFincas(fincasFiltradas);
    return true;
  } catch (error) {
    console.error('Error deleting finca:', error);
    return false;
  }
};
