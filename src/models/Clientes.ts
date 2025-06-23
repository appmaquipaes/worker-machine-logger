export interface Cliente {
  id: string;
  nombre_cliente: string;
  nombre: string; // Alias para nombre_cliente
  nit: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  email?: string;
  contacto_principal: string;
  activo: boolean;
  fecha_registro: Date;
  observaciones?: string;
}

// Función para crear un nuevo cliente
export const createCliente = (
  nombre_cliente: string,
  nit: string,
  ciudad: string,
  direccion: string,
  telefono: string,
  contacto_principal: string,
  email?: string,
  observaciones?: string
): Cliente => {
  return {
    id: Date.now().toString(),
    nombre_cliente,
    nombre: nombre_cliente, // Alias
    nit,
    ciudad,
    direccion,
    telefono,
    contacto_principal,
    activo: true,
    fecha_registro: new Date(),
    observaciones,
    email
  };
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
  telefono_contacto: string,
  persona_contacto: string,
  ciudad: string,
  tipo_cliente?: TipoCliente,
  correo_electronico?: string,
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
