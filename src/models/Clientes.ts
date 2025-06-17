
// Model for clients

export interface Cliente {
  id: string;
  nombre_cliente: string;
  tipo_persona: 'Natural' | 'Empresa';
  nit_cedula: string;
  correo_electronico?: string;
  telefono_contacto: string;
  persona_contacto: string;
  tipo_cliente: string;
  ciudad: string;
  fecha_registro: Date;
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

export const tiposPersona = [
  'Natural',
  'Empresa'
];

// Load clients from localStorage
export const loadClientes = (): Cliente[] => {
  const clientesString = localStorage.getItem('clientes');
  if (!clientesString) return [];

  try {
    return JSON.parse(clientesString).map((cliente: any) => ({
      ...cliente,
      fecha_registro: new Date(cliente.fecha_registro),
      // Migrar datos antiguos si es necesario
      tipo_persona: cliente.tipo_persona || 'Natural',
      nit_cedula: cliente.nit_cedula || '',
      correo_electronico: cliente.correo_electronico || '',
      telefono_contacto: cliente.telefono_contacto || cliente.contacto_telefono || '',
      persona_contacto: cliente.persona_contacto || cliente.contacto_nombre || ''
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
  tipo_persona: 'Natural' | 'Empresa',
  nit_cedula: string,
  telefono_contacto: string,
  persona_contacto: string,
  ciudad: string,
  tipo_cliente?: string,
  correo_electronico?: string,
  observaciones?: string
): Cliente => {
  return {
    id: Date.now().toString(),
    nombre_cliente,
    tipo_persona,
    nit_cedula,
    correo_electronico,
    telefono_contacto,
    persona_contacto,
    tipo_cliente: tipo_cliente || '',
    ciudad,
    fecha_registro: new Date(),
    observaciones
  };
};

// Get client names for dropdown
export const getClientesNames = (): string[] => {
  return loadClientes().map(cliente => cliente.nombre_cliente);
};

// Get client by name
export const getClienteByName = (nombre: string): Cliente | undefined => {
  return loadClientes().find(cliente => cliente.nombre_cliente === nombre);
};
