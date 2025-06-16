
// Constantes para estandarizar nombres de acopio
export const ACOPIO_NAMES = [
  'Acopio Maquipaes',
  'Acopio',
  'acopio',
  'ACOPIO MAQUIPAES',
  'ACOPIO'
];

// Función para verificar si un nombre es acopio
export const isAcopio = (name: string): boolean => {
  return ACOPIO_NAMES.some(acopioName => 
    name.toLowerCase().includes(acopioName.toLowerCase())
  );
};

// Configuración por tipo de máquina para operaciones de inventario
export const MACHINE_INVENTORY_CONFIG = {
  'Volqueta': { 
    canEnter: true, 
    canExit: true, 
    forceOriginAcopio: false 
  },
  'Camión': { 
    canEnter: true, 
    canExit: true, 
    forceOriginAcopio: false 
  },
  'Cargador': { 
    canEnter: false, 
    canExit: true, 
    forceOriginAcopio: true 
  }
};

// Tipo para configuración de máquinas
export type MachineInventoryConfig = {
  canEnter: boolean;
  canExit: boolean;
  forceOriginAcopio: boolean;
};
