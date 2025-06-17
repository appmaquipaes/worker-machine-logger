import { loadProveedores } from '@/models/Proveedores';
import { loadClientes } from '@/models/Clientes';
import { loadFincas } from '@/models/Fincas';
import { loadMateriales } from '@/models/Materiales';
import { loadTarifas } from '@/models/Tarifas';
import { loadUsers } from '@/models/Users';

const createProveedoresIfNotExists = () => {
  if (!loadProveedores() || loadProveedores().length === 0) {
    const initialProveedores = [
      { id: '1', nombre: 'Proveedor A', ciudad: 'Medellín', tipo_material: 'Arena' },
      { id: '2', nombre: 'Proveedor B', ciudad: 'Bogotá', tipo_material: 'Recebo' },
      { id: '3', nombre: 'Proveedor C', ciudad: 'Cali', tipo_material: 'Gravilla' }
    ];
    localStorage.setItem('proveedores', JSON.stringify(initialProveedores));
    console.log('Proveedores iniciales creados automáticamente');
  }
};

const createClientesIfNotExists = () => {
  if (!loadClientes() || loadClientes().length === 0) {
    const initialClientes = [
      { id: '1', nombre_cliente: 'Cliente A', ciudad: 'Medellín', telefono: '1234567890' },
      { id: '2', nombre_cliente: 'Cliente B', ciudad: 'Bogotá', telefono: '0987654321' },
      { id: '3', nombre_cliente: 'Cliente C', ciudad: 'Cali', telefono: '1122334455' }
    ];
    localStorage.setItem('clientes', JSON.stringify(initialClientes));
    console.log('Clientes iniciales creados automáticamente');
  }
};

const createFincasIfNotExists = () => {
  if (!loadFincas() || loadFincas().length === 0) {
    const initialFincas = [
      { id: '1', cliente_id: '1', nombre_finca: 'Finca A1', ciudad: 'Medellín' },
      { id: '2', cliente_id: '1', nombre_finca: 'Finca A2', ciudad: 'Envigado' },
      { id: '3', cliente_id: '2', nombre_finca: 'Finca B1', ciudad: 'Bogotá' }
    ];
    localStorage.setItem('fincas', JSON.stringify(initialFincas));
    console.log('Fincas iniciales creadas automáticamente');
  }
};

const createMaterialesIfNotExists = () => {
  if (!loadMateriales() || loadMateriales().length === 0) {
    const initialMateriales = [
      { id: '1', tipo_material: 'Arena', precio_venta_m3: 30000 },
      { id: '2', tipo_material: 'Recebo', precio_venta_m3: 25000 },
      { id: '3', tipo_material: 'Gravilla', precio_venta_m3: 40000 }
    ];
    localStorage.setItem('materiales', JSON.stringify(initialMateriales));
    console.log('Materiales iniciales creados automáticamente');
  }
};

const createTarifasIfNotExists = () => {
  if (!loadTarifas() || loadTarifas().length === 0) {
    const initialTarifas = [
      { id: '1', origen: 'Medellín', destino: 'Envigado', valor_por_m3: 10000 },
      { id: '2', origen: 'Bogotá', destino: 'Soacha', valor_por_m3: 12000 },
      { id: '3', origen: 'Cali', destino: 'Palmira', valor_por_m3: 9000 }
    ];
    localStorage.setItem('tarifas', JSON.stringify(initialTarifas));
    console.log('Tarifas iniciales creadas automáticamente');
  }
};

const createUsersIfNotExists = () => {
  if (!loadUsers() || loadUsers().length === 0) {
    const initialUsers = [
      { id: '1', username: 'admin', password: 'password', role: 'Administrador' },
      { id: '2', username: 'operator', password: 'password', role: 'Operador' }
    ];
    localStorage.setItem('users', JSON.stringify(initialUsers));
    console.log('Usuarios iniciales creados automáticamente');
  }
};

const createMachinesIfNotExists = () => {
  const machines = JSON.parse(localStorage.getItem('machines') || '[]');
  if (machines.length === 0) {
    const initialMachines = [
      { id: '1', name: 'Excavadora 1', type: 'Excavadora' },
      { id: '2', name: 'Volqueta 1', type: 'Volqueta' },
      { id: '3', name: 'Cargador 1', type: 'Cargador' }
    ];
    localStorage.setItem('machines', JSON.stringify(initialMachines));
    console.log('Máquinas iniciales creadas automáticamente');
  }
};

const createEscombreraIfNotExists = () => {
  const machines = JSON.parse(localStorage.getItem('machines') || '[]');
  
  // Verificar si ya existe una máquina escombrera
  const escombreraExists = machines.some((machine: any) => 
    machine.name.toLowerCase().includes('escombrera') || machine.type === 'Escombrera'
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
