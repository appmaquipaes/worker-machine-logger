
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

export const createCliente = (clienteData: Omit<Cliente, 'id' | 'fechaRegistro'>): Cliente => {
  const nuevoCliente: Cliente = {
    ...clienteData,
    id: Date.now().toString(),
    nombre_cliente: clienteData.nombre_cliente || clienteData.nombre,
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
