import { loadProveedores } from '@/models/Proveedores';
import { loadClientes } from '@/models/Clientes';
import { loadFincas } from '@/models/Fincas';
import { loadMateriales } from '@/models/Materiales';
import { loadTarifas } from '@/models/Tarifas';
import { loadUsers, createInitialAdminUser } from '@/models/Users';

const createProveedoresIfNotExists = () => {
  // Verificar si ya se hizo la inicialización inicial de proveedores
  const proveedoresInitialized = localStorage.getItem('proveedores_initialized');
  
  if (!proveedoresInitialized) {
    // Solo crear proveedores iniciales si nunca se ha hecho la inicialización
    const proveedores = loadProveedores();
    if (proveedores.length === 0) {
      const initialProveedores = [
        { id: '1', nombre: 'Proveedor A', ciudad: 'Medellín', tipo_material: 'Arena' },
        { id: '2', nombre: 'Proveedor B', ciudad: 'Bogotá', tipo_material: 'Recebo' },
        { id: '3', nombre: 'Proveedor C', ciudad: 'Cali', tipo_material: 'Gravilla' }
      ];
      localStorage.setItem('proveedores', JSON.stringify(initialProveedores));
      console.log('Proveedores iniciales creados automáticamente');
    }
    
    // Marcar que la inicialización ya se hizo
    localStorage.setItem('proveedores_initialized', 'true');
  }
};

const createClientesIfNotExists = () => {
  // Verificar si ya se hizo la inicialización inicial de clientes
  const clientesInitialized = localStorage.getItem('clientes_initialized');
  
  if (!clientesInitialized) {
    // Solo crear clientes iniciales si nunca se ha hecho la inicialización
    const clientes = loadClientes();
    if (clientes.length === 0) {
      const initialClientes = [
        { id: '1', nombre_cliente: 'Cliente A', ciudad: 'Medellín', telefono: '1234567890' },
        { id: '2', nombre_cliente: 'Cliente B', ciudad: 'Bogotá', telefono: '0987654321' },
        { id: '3', nombre_cliente: 'Cliente C', ciudad: 'Cali', telefono: '1122334455' }
      ];
      localStorage.setItem('clientes', JSON.stringify(initialClientes));
      console.log('Clientes iniciales creados automáticamente');
    }
    
    // Marcar que la inicialización ya se hizo
    localStorage.setItem('clientes_initialized', 'true');
  }
};

const createFincasIfNotExists = () => {
  // Verificar si ya se hizo la inicialización inicial de fincas
  const fincasInitialized = localStorage.getItem('fincas_initialized');
  
  if (!fincasInitialized) {
    // Solo crear fincas iniciales si nunca se ha hecho la inicialización
    const fincas = loadFincas();
    if (fincas.length === 0) {
      const initialFincas = [
        { id: '1', cliente_id: '1', nombre_finca: 'Finca A1', ciudad: 'Medellín' },
        { id: '2', cliente_id: '1', nombre_finca: 'Finca A2', ciudad: 'Envigado' },
        { id: '3', cliente_id: '2', nombre_finca: 'Finca B1', ciudad: 'Bogotá' }
      ];
      localStorage.setItem('fincas', JSON.stringify(initialFincas));
      console.log('Fincas iniciales creadas automáticamente');
    }
    
    // Marcar que la inicialización ya se hizo
    localStorage.setItem('fincas_initialized', 'true');
  }
};

const createMaterialesIfNotExists = () => {
  // Verificar si ya se hizo la inicialización inicial de materiales
  const materialesInitialized = localStorage.getItem('materiales_initialized');
  
  if (!materialesInitialized) {
    // Solo crear materiales iniciales si nunca se ha hecho la inicialización
    const materiales = loadMateriales();
    if (materiales.length === 0) {
      const initialMateriales = [
        { id: '1', tipo_material: 'Arena', precio_venta_m3: 30000 },
        { id: '2', tipo_material: 'Recebo', precio_venta_m3: 25000 },
        { id: '3', tipo_material: 'Gravilla', precio_venta_m3: 40000 }
      ];
      localStorage.setItem('materiales', JSON.stringify(initialMateriales));
      console.log('Materiales iniciales creados automáticamente');
    }
    
    // Marcar que la inicialización ya se hizo
    localStorage.setItem('materiales_initialized', 'true');
  }
};

const createTarifasIfNotExists = () => {
  // Verificar si ya se hizo la inicialización inicial de tarifas
  const tarifasInitialized = localStorage.getItem('tarifas_initialized');
  
  if (!tarifasInitialized) {
    // Solo crear tarifas iniciales si nunca se ha hecho la inicialización
    const tarifas = loadTarifas();
    if (tarifas.length === 0) {
      const initialTarifas = [
        { id: '1', origen: 'Medellín', destino: 'Envigado', valor_por_m3: 10000 },
        { id: '2', origen: 'Bogotá', destino: 'Soacha', valor_por_m3: 12000 },
        { id: '3', origen: 'Cali', destino: 'Palmira', valor_por_m3: 9000 }
      ];
      localStorage.setItem('tarifas', JSON.stringify(initialTarifas));
      console.log('Tarifas iniciales creadas automáticamente');
    }
    
    // Marcar que la inicialización ya se hizo
    localStorage.setItem('tarifas_initialized', 'true');
  }
};

const createUsersIfNotExists = () => {
  // Verificar si ya se hizo la inicialización inicial de usuarios
  const usersInitialized = localStorage.getItem('users_initialized');
  
  if (!usersInitialized) {
    // Solo crear usuarios iniciales si nunca se ha hecho la inicialización
    const users = loadUsers();
    if (users.length === 0) {
      const initialUsers = [
        { id: '1', username: 'admin', password: 'password', role: 'Administrador' },
        { id: '2', username: 'operator', password: 'password', role: 'Operador' }
      ];
      localStorage.setItem('users', JSON.stringify(initialUsers));
      console.log('Usuarios iniciales creados automáticamente');
    }
    
    // Marcar que la inicialización ya se hizo
    localStorage.setItem('users_initialized', 'true');
  }
};

const createMachinesIfNotExists = () => {
  // Verificar si ya se hizo la inicialización inicial de máquinas
  const machinesInitialized = localStorage.getItem('machines_initialized');
  
  if (!machinesInitialized) {
    // Solo crear máquinas iniciales si nunca se ha hecho la inicialización
    const machines = JSON.parse(localStorage.getItem('machines') || '[]');
    if (machines.length === 0) {
      const initialMachines = [
        { id: '1', name: 'Excavadora 1', type: 'Retroexcavadora de Oruga' },
        { id: '2', name: 'Volqueta 1', type: 'Volqueta' },
        { id: '3', name: 'Cargador 1', type: 'Cargador' }
      ];
      localStorage.setItem('machines', JSON.stringify(initialMachines));
      console.log('Máquinas iniciales creadas automáticamente');
    }
    
    // Marcar que la inicialización ya se hizo
    localStorage.setItem('machines_initialized', 'true');
  }
};

const createEscombreraIfNotExists = () => {
  const machines = JSON.parse(localStorage.getItem('machines') || '[]');
  
  // Verificar si ya existe una máquina escombrera
  const escombreraExists = machines.some((machine: any) => 
    machine.name.toLowerCase().includes('escombrera')
  );
  
  if (!escombreraExists) {
    const escombreraMachine = {
      id: 'escombrera-maquipaes',
      name: 'Escombrera MAQUIPAES',
      type: 'Escombrera',
      plate: 'ESC-001',
      model: '2024',
      year: '2024',
      capacity: 'N/A',
      fuelType: 'N/A'
    };
    
    machines.push(escombreraMachine);
    localStorage.setItem('machines', JSON.stringify(machines));
    console.log('Máquina Escombrera creada automáticamente');
  }
};

// Función principal de setup
export const runInitialSetup = () => {
  createProveedoresIfNotExists();
  createClientesIfNotExists();
  createFincasIfNotExists();
  createMaterialesIfNotExists();
  createTarifasIfNotExists();
  createUsersIfNotExists();
  createMachinesIfNotExists();
  createEscombreraIfNotExists();
};

// Export the createInitialAdminUser function
export { createInitialAdminUser };
