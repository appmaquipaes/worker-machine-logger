
import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos para las máquinas
export type Machine = {
  id: string;
  name: string;
  type: string;
  imageUrl?: string;
};

// Tipo para el contexto de máquinas
type MachineContextType = {
  machines: Machine[];
  selectedMachine: Machine | null;
  selectMachine: (machine: Machine) => void;
  clearSelectedMachine: () => void;
};

// Crear el contexto
const MachineContext = createContext<MachineContextType | undefined>(undefined);

// Lista de máquinas actualizada
const demoMachines: Machine[] = [
  { id: '1', name: 'Cat315', type: 'Excavadora' },
  { id: '2', name: 'Cat312', type: 'Excavadora' },
  { id: '3', name: 'Bulldozer D6', type: 'Bulldozer' },
  { id: '4', name: 'Vibro-SD100', type: 'Compactador' },
  { id: '5', name: 'VIBRO-SD70D', type: 'Compactador' },
  { id: '6', name: 'VIBRO-CATCS-323', type: 'Compactador' },
  { id: '7', name: 'KOMATSU-200', type: 'Excavadora' },
  { id: '8', name: 'CARGADOR-S950', type: 'Cargador' },
  { id: '9', name: 'MOTONIVELADORA', type: 'Motoniveladora' },
  { id: '10', name: 'PALADRAGA', type: 'Paladraga' },
  { id: '11', name: 'MACK UFJ852', type: 'Camión' },
  { id: '12', name: 'MACK SWN429', type: 'Camión' },
];

// Hook personalizado para usar el contexto
export const useMachine = () => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error('useMachine debe ser utilizado dentro de un MachineProvider');
  }
  return context;
};

// Proveedor del contexto de máquinas
export const MachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines] = useState<Machine[]>(demoMachines);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  // Cargar la máquina seleccionada del almacenamiento local si existe
  useEffect(() => {
    const storedMachine = localStorage.getItem('selectedMachine');
    if (storedMachine) {
      setSelectedMachine(JSON.parse(storedMachine));
    }
  }, []);

  // Función para seleccionar una máquina
  const selectMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    localStorage.setItem('selectedMachine', JSON.stringify(machine));
  };

  // Función para limpiar la máquina seleccionada
  const clearSelectedMachine = () => {
    setSelectedMachine(null);
    localStorage.removeItem('selectedMachine');
  };

  const value = {
    machines,
    selectedMachine,
    selectMachine,
    clearSelectedMachine,
  };

  return <MachineContext.Provider value={value}>{children}</MachineContext.Provider>;
};
