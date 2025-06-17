
export interface Proveedor {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  tipoServicio: string;
  fechaRegistro: string;
}

export const loadProveedores = (): Proveedor[] => {
  try {
    const stored = localStorage.getItem('proveedores');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading proveedores:', error);
    return [];
  }
};

export const saveProveedores = (proveedores: Proveedor[]): void => {
  try {
    localStorage.setItem('proveedores', JSON.stringify(proveedores));
  } catch (error) {
    console.error('Error saving proveedores:', error);
  }
};
