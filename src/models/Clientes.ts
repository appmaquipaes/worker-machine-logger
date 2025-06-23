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
