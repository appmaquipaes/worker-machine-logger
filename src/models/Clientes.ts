

// Model for clients

export interface Cliente {
  id: string;
  nombre_cliente: string;
  tipo_cliente: string;
  ciudad: string;
  fecha_registro: Date;
  contacto_nombre: string;
  contacto_telefono: string;
  direccion?: string;
  observaciones?: string;
}

export const tiposCliente = [
  'Floristeria',
  'Particular', 
  'Finca',
  'Constructora',
  'Firma Ingenieria',
  'Acopio de Material'
];

// Load clients from localStorage
export const loadClientes = (): Cliente[] => {
  const clientesString = localStorage.getItem('clientes');
  if (!clientesString) return [];

  try {
    return JSON.parse(clientesString).map((cliente: any) => ({
      ...cliente,
      fecha_registro: new Date(cliente.fecha_registro)
    }));
  } catch (error) {
    console.error('Error loading clients:', error);
    return [];
  }
};

// Save clients to localStorage
export const saveClientes = (clientes: Cliente[]): void => {
  localStorage.setItem('clientes', JSON.stringify(clientes));
};

// Create a new client
export const createCliente = (
  nombre_cliente: string,
  ciudad: string,
  contacto_nombre: string,
  contacto_telefono: string,
  direccion?: string,
  tipo_cliente?: string,
  observaciones?: string
): Cliente => {
  return {
    id: Date.now().toString(),
    nombre_cliente,
    tipo_cliente: tipo_cliente || '',
    ciudad,
    fecha_registro: new Date(),
    contacto_nombre,
    contacto_telefono,
    direccion,
    observaciones
  };
};

// Get client names for dropdown
export const getClientesNames = (): string[] => {
  return loadClientes().map(cliente => cliente.nombre_cliente);
};

