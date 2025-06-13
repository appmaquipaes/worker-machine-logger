
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
      const parsedMachines = JSON.parse(storedMachines);
      // Ensure all machines have status set to available if not defined
      const machinesWithStatus = parsedMachines.map((machine: any) => ({
        ...machine,
        status: machine.status || 'available'
      }));
      setMachines(machinesWithStatus);
      console.log('Loaded machines from localStorage:', machinesWithStatus);
    } else {
      // Datos iniciales mejorados con más variedad de máquinas
      const initialMachines: Machine[] = [
        { id: '1', name: 'Excavadora CAT 320', type: 'Excavadora', plate: 'ABC-123', status: 'available' },
        { id: '2', name: 'Bulldozer D6K', type: 'Bulldozer', plate: 'DEF-456', status: 'available' },
        { id: '3', name: 'Volqueta Kenworth T880', type: 'Volqueta', plate: 'GHI-789', status: 'available' },
        { id: '4', name: 'Camabaja Freightliner M2', type: 'Camabaja', plate: 'JKL-012', status: 'available' },
        { id: '5', name: 'Semirremolque Volvo VNL', type: 'Semirremolque', plate: 'MNO-345', status: 'available' },
        { id: '6', name: 'Tractomula Scania R500', type: 'Tractomula', plate: 'PQR-678', status: 'available' },
        { id: '7', name: 'Cargador Frontal CAT 950M', type: 'Cargador', plate: 'STU-901', status: 'available' },
        { id: '8', name: 'Motoniveladora CAT 140M', type: 'Motoniveladora', plate: 'VWX-234', status: 'available' },
        { id: '9', name: 'Compactador Vibratorio Dynapac', type: 'Compactador', plate: 'YZA-567', status: 'available' },
        { id: '10', name: 'Paladraga Liebherr R944C', type: 'Paladraga', plate: 'BCD-890', status: 'available' },
      ];
      setMachines(initialMachines);
      localStorage.setItem('machines', JSON.stringify(initialMachines));
      console.log('Created initial machines:', initialMachines);
    }
  }, []);

  const selectMachine = (machine: Machine) => {
    console.log('MachineContext.selectMachine called with:', machine);
    setSelectedMachine(machine);
    // Guardar la máquina seleccionada en localStorage para persistencia
    localStorage.setItem('selectedMachine', JSON.stringify(machine));
    console.log('Machine saved to localStorage and state updated');
  };

  const clearSelectedMachine = () => {
    console.log('MachineContext.clearSelectedMachine called');
    setSelectedMachine(null);
    localStorage.removeItem('selectedMachine');
  };

  // Recuperar máquina seleccionada del localStorage al iniciar
  useEffect(() => {
    const storedSelectedMachine = localStorage.getItem('selectedMachine');
    if (storedSelectedMachine) {
      console.log('Recovered selected machine from localStorage:', storedSelectedMachine);
      setSelectedMachine(JSON.parse(storedSelectedMachine));
    }
  }, []);

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
    
    // Actualizar máquina seleccionada si es la misma
    if (selectedMachine && selectedMachine.id === id) {
      const updated = { ...selectedMachine, ...updatedMachine };
      setSelectedMachine(updated);
      localStorage.setItem('selectedMachine', JSON.stringify(updated));
    }
  };

  const deleteMachine = (id: string) => {
    const updatedMachines = machines.filter(machine => machine.id !== id);
    setMachines(updatedMachines);
    localStorage.setItem('machines', JSON.stringify(updatedMachines));
    
    // Limpiar máquina seleccionada si es la que se eliminó
    if (selectedMachine && selectedMachine.id === id) {
      clearSelectedMachine();
    }
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
