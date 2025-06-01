import React, { createContext, useContext, useState, useEffect } from 'react';

export type Machine = {
  id: string;
  name: string;
  type: 'Excavadora' | 'Bulldozer' | 'Cargador' | 'Motoniveladora' | 'Compactador' | 'Paladraga' | 'Camión' | 'Volqueta' | 'Camabaja' | 'Semirremolque' | 'Tractomula';
  plate?: string;
  imageUrl?: string;
  status: 'available' | 'in-use' | 'maintenance';
};

type MachineContextType = {
  machines: Machine[];
  selectedMachine: Machine | null;
  selectMachine: (machine: Machine) => void;
  clearSelectedMachine: () => void;
  addMachine: (machine: Omit<Machine, 'id'>) => void;
  updateMachine: (id: string, machine: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
};

const MachineContext = createContext<MachineContextType | undefined>(undefined);

export const useMachine = () => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error('useMachine debe ser utilizado dentro de un MachineProvider');
  }
  return context;
};

export const MachineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  // Cargar máquinas del localStorage al iniciar
  useEffect(() => {
    const storedMachines = localStorage.getItem('machines');
    if (storedMachines) {
      setMachines(JSON.parse(storedMachines));
    } else {
      // Datos iniciales si no hay máquinas guardadas
      const initialMachines: Machine[] = [
        { id: '1', name: 'Excavadora CAT 320', type: 'Excavadora', plate: 'ABC-123', status: 'available' },
        { id: '2', name: 'Bulldozer D6K', type: 'Bulldozer', plate: 'DEF-456', status: 'available' },
        { id: '3', name: 'Volqueta Kenworth', type: 'Volqueta', plate: 'GHI-789', status: 'available' },
        { id: '4', name: 'Camabaja Freightliner', type: 'Camabaja', plate: 'JKL-012', status: 'available' },
        { id: '5', name: 'Semirremolque Volvo', type: 'Semirremolque', plate: 'MNO-345', status: 'available' },
        { id: '6', name: 'Tractomula Scania', type: 'Tractomula', plate: 'PQR-678', status: 'available' },
      ];
      setMachines(initialMachines);
      localStorage.setItem('machines', JSON.stringify(initialMachines));
    }
  }, []);

  const selectMachine = (machine: Machine) => {
    setSelectedMachine(machine);
  };

  const clearSelectedMachine = () => {
    setSelectedMachine(null);
  };

  const addMachine = (machine: Omit<Machine, 'id'>) => {
    const newMachine: Machine = {
      ...machine,
      id: Date.now().toString(),
    };
    const updatedMachines = [...machines, newMachine];
    setMachines(updatedMachines);
    localStorage.setItem('machines', JSON.stringify(updatedMachines));
  };

  const updateMachine = (id: string, updatedMachine: Partial<Machine>) => {
    const updatedMachines = machines.map(machine =>
      machine.id === id ? { ...machine, ...updatedMachine } : machine
    );
    setMachines(updatedMachines);
    localStorage.setItem('machines', JSON.stringify(updatedMachines));
  };

  const deleteMachine = (id: string) => {
    const updatedMachines = machines.filter(machine => machine.id !== id);
    setMachines(updatedMachines);
    localStorage.setItem('machines', JSON.stringify(updatedMachines));
  };

  const value = {
    machines,
    selectedMachine,
    selectMachine,
    clearSelectedMachine,
    addMachine,
    updateMachine,
    deleteMachine,
  };

  return <MachineContext.Provider value={value}>{children}</MachineContext.Provider>;
};
