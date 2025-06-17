
export interface Cliente {
  id: string;
  nombre: string;
  nombre_cliente: string;
  telefono?: string;
  telefono_contacto?: string;
  email?: string;
  correo_electronico?: string;
  direccion?: string;
  ciudad?: string;
  tipo_cliente?: string;
  tipo_persona?: 'Natural' | 'Empresa';
  nit?: string;
  nit_cedula?: string;
  contacto?: string;
  persona_contacto?: string;
  observaciones?: string;
  fechaRegistro: string;
}

export const tiposCliente = [
  'Particular',
  'Empresa',
  'Constructor',
  'Gobierno'
];

export const tiposPersona = [
  'Natural',
  'Empresa'
];

export const loadClientes = (): Cliente[] => {
  try {
    const stored = localStorage.getItem('clientes');
    const clientes = stored ? JSON.parse(stored) : [];
    return clientes.map((cliente: any) => ({
      ...cliente,
      nombre_cliente: cliente.nombre_cliente || cliente.nombre
    }));
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
  const nuevoCliente: Cliente = {
    id: Date.now().toString(),
    nombre: nombre_cliente,
    nombre_cliente,
    tipo_persona,
    nit_cedula,
    telefono_contacto,
    persona_contacto,
    ciudad,
    tipo_cliente,
    correo_electronico,
    observaciones,
    fechaRegistro: new Date().toISOString()
  };
  
  const clientes = loadClientes();
  const clientesActualizados = [...clientes, nuevoCliente];
  saveClientes(clientesActualizados);
  
  return nuevoCliente;
};

export const getClienteByName = (nombre: string): Cliente | undefined => {
  const clientes = loadClientes();
  return clientes.find(cliente => 
    cliente.nombre === nombre || cliente.nombre_cliente === nombre
  );
};
