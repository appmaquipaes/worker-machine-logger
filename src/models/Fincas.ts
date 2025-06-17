
// Model for client farms/delivery points

export interface Finca {
  id: string;
  cliente_id: string;
  nombre_finca: string;
  direccion: string;
  ciudad: string;
  contacto_nombre: string;
  contacto_telefono: string;
  notas?: string;
  fecha_registro: Date;
}

// Load fincas from localStorage
export const loadFincas = (): Finca[] => {
  const fincasString = localStorage.getItem('fincas');
  if (!fincasString) return [];

  try {
    return JSON.parse(fincasString).map((finca: any) => ({
      ...finca,
      fecha_registro: new Date(finca.fecha_registro)
    }));
  } catch (error) {
    console.error('Error loading fincas:', error);
    return [];
  }
};

// Save fincas to localStorage
export const saveFincas = (fincas: Finca[]): void => {
  localStorage.setItem('fincas', JSON.stringify(fincas));
};

// Create a new finca
export const createFinca = (
  cliente_id: string,
  nombre_finca: string,
  direccion: string,
  ciudad: string,
  contacto_nombre: string,
  contacto_telefono: string,
  notas?: string
): Finca => {
  return {
    id: Date.now().toString(),
    cliente_id,
    nombre_finca,
    direccion,
    ciudad,
    contacto_nombre,
    contacto_telefono,
    notas,
    fecha_registro: new Date()
  };
};

// Get fincas by client ID
export const getFincasByCliente = (cliente_id: string): Finca[] => {
  return loadFincas().filter(finca => finca.cliente_id === cliente_id);
};

// Get finca names for dropdown (by client)
export const getFincasNamesByCliente = (cliente_id: string): string[] => {
  return getFincasByCliente(cliente_id).map(finca => finca.nombre_finca);
};
