
import React, { createContext, useContext, useState, useEffect } from 'react';

// Tipos para las máquinas
export type Machine = {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
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

// Lista de máquinas para demostración
const demoMachines: Machine[] = [
  { id: '1', name: 'Excavadora 320', type: 'Excavadora', imageUrl: '/placeholder.svg' },
  { id: '2', name: 'Bulldozer D6', type: 'Bulldozer', imageUrl: '/placeholder.svg' },
  { id: '3', name: 'Cargadora 950', type: 'Cargadora', imageUrl: '/placeholder.svg' },
  { id: '4', name: 'Motoniveladora 140', type: 'Motoniveladora', imageUrl: '/placeholder.svg' },
  { id: '5', name: 'Compactador CS', type: 'Compactador', imageUrl: '/placeholder.svg' },
  { id: '6', name: 'Retroexcavadora 420', type: 'Retroexcavadora', imageUrl: '/placeholder.svg' },
  { id: '7', name: 'Camión Volquete', type: 'Camión', imageUrl: '/placeholder.svg' },
  { id: '8', name: 'Pavimentadora AP', type: 'Pavimentadora', imageUrl: '/placeholder.svg' },
  { id: '9', name: 'Grúa RT', type: 'Grúa', imageUrl: '/placeholder.svg' },
  { id: '10', name: 'Perforadora MD', type: 'Perforadora', imageUrl: '/placeholder.svg' },
  { id: '11', name: 'Bomba de Concreto', type: 'Bomba', imageUrl: '/placeholder.svg' },
  { id: '12', name: 'Generador 100kW', type: 'Generador', imageUrl: '/placeholder.svg' },
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
