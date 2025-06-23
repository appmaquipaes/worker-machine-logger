
// Tipos de persona
export const tiposPersona = ['Natural', 'Empresa'] as const;
export type TipoPersona = typeof tiposPersona[number];

// Tipos de cliente
export const tiposCliente = [
  'Constructora',
  'Floristeria', 
  'Particular',
  'Finca',
  'Otros'
] as const;
export type TipoCliente = typeof tiposCliente[number];

export interface Cliente {
  id: string;
  nombre_cliente: string;
  nombre: string; // Alias para nombre_cliente
  tipo_persona: TipoPersona;
  nit_cedula: string;
  nit: string; // Alias para nit_cedula
  ciudad: string;
  direccion: string;
  telefono_contacto: string;
  telefono: string; // Alias para telefono_contacto
  correo_electronico?: string;
  email?: string; // Alias para correo_electronico
  persona_contacto: string;
  contacto_principal: string; // Alias para persona_contacto
  tipo_cliente?: TipoCliente;
  activo: boolean;
  fecha_registro: Date;
  observaciones?: string;
}

// Función para crear un nuevo cliente
export const createCliente = (
  nombre_cliente: string,
  tipo_persona: TipoPersona,
  nit_cedula: string,
  correo_electronico: string | undefined,
  persona_contacto: string,
  telefono_contacto: string,
  ciudad: string,
  tipo_cliente?: TipoCliente,
  observaciones?: string
): Cliente => {
  return {
    id: Date.now().toString(),
    nombre_cliente,
    nombre: nombre_cliente, // Alias
    tipo_persona,
    nit_cedula,
    nit: nit_cedula, // Alias
    ciudad,
    direccion: ciudad, // Default to ciudad
    telefono_contacto,
    telefono: telefono_contacto, // Alias
    correo_electronico,
    email: correo_electronico, // Alias
    persona_contacto,
    contacto_principal: persona_contacto, // Alias
    tipo_cliente,
    activo: true,
    fecha_registro: new Date(),
    observaciones
  };
};

// Función para actualizar un cliente
export const updateCliente = (id: string, updates: Partial<Omit<Cliente, 'id' | 'fecha_registro'>>): Cliente => {
  const clientes = loadClientes();
  const clienteIndex = clientes.findIndex(c => c.id === id);
  
  if (clienteIndex === -1) {
    throw new Error('Cliente no encontrado');
  }
  
  const clienteActualizado = {
    ...clientes[clienteIndex],
    ...updates,
    // Update aliases
    nombre: updates.nombre_cliente || clientes[clienteIndex].nombre_cliente,
    nit: updates.nit_cedula || clientes[clienteIndex].nit_cedula,
    telefono: updates.telefono_contacto || clientes[clienteIndex].telefono_contacto,
    email: updates.correo_electronico || clientes[clienteIndex].correo_electronico,
    contacto_principal: updates.persona_contacto || clientes[clienteIndex].persona_contacto,
    direccion: updates.ciudad || clientes[clienteIndex].ciudad
  };
  
  return clienteActualizado;
};

// Función para eliminar un cliente
export const deleteCliente = (id: string): void => {
  const clientes = loadClientes();
  const clienteIndex = clientes.findIndex(c => c.id === id);
  
  if (clienteIndex === -1) {
    throw new Error('Cliente no encontrado');
  }
  
  clientes[clienteIndex].activo = false;
  saveClientes(clientes);
};

// Función para obtener tipos de persona
export const getTiposPersona = (): string[] => {
  return [...tiposPersona];
};

// Función para obtener tipos de cliente
export const getTiposCliente = (): string[] => {
  return [...tiposCliente];
};

// Función para guardar clientes en localStorage
export const saveClientes = (clientes: Cliente[]): void => {
  try {
    console.log('💾 Guardando clientes:', clientes.length);
    localStorage.setItem('clientes', JSON.stringify(clientes));
    console.log('✅ Clientes guardados exitosamente');
  } catch (error) {
    console.error('❌ Error guardando clientes:', error);
    throw error;
  }
};

// Función para cargar clientes desde localStorage
export const loadClientes = (): Cliente[] => {
  try {
    console.log('📂 Cargando clientes...');
    const storedClientes = localStorage.getItem('clientes');
    
    if (!storedClientes) {
      console.log('ℹ️ No hay clientes almacenados');
      return [];
    }
    
    const parsedClientes = JSON.parse(storedClientes).map((cliente: any) => ({
      ...cliente,
      fecha_registro: new Date(cliente.fecha_registro)
    }));
    
    console.log('✅ Clientes cargados:', parsedClientes.length);
    return parsedClientes;
  } catch (error) {
    console.error('❌ Error cargando clientes:', error);
    return [];
  }
};

// Función para obtener cliente por nombre
export const getClienteByName = (nombre: string): Cliente | undefined => {
  const clientes = loadClientes();
  return clientes.find(cliente => (cliente.nombre_cliente === nombre || cliente.nombre === nombre) && cliente.activo);
};
