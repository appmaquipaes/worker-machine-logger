
export interface Cliente {
  id: string;
  nombre: string;
  nombre_cliente: string; // Alias para compatibilidad
  telefono: string;
  email: string;
  direccion: string;
  ciudad?: string;
  tipo_cliente?: string;
  tipo_persona?: string;
  nit?: string;
  contacto?: string;
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
  'Jurídica'
];

export const loadClientes = (): Cliente[] => {
  try {
    const stored = localStorage.getItem('clientes');
    const clientes = stored ? JSON.parse(stored) : [];
    // Asegurar compatibilidad de nombres
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
