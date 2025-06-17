
export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaRegistro: string;
}

export const loadClientes = (): Cliente[] => {
  try {
    const stored = localStorage.getItem('clientes');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading clientes:', error);
    return [];
  }
};

export const saveClientes = (clientes: Cliente[]): void => {
  try {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  } catch (error) {
    console.error('Error saving clientes:', error);
  }
};
