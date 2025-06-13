import React, { createContext, useContext, useState, useEffect } from 'react';

export type Machine = {
  id: string;
  name: string;
  type: 'Retroexcavadora de Oruga' | 'Retroexcavadora de Llanta' | 'Cargador' | 'Vibrocompactador' | 'Paladraga' | 'Bulldozer' | 'Camabaja' | 'Volqueta' | 'Motoniveladora' | 'Otro';
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
      // Datos iniciales actualizados con los nuevos tipos
      const initialMachines: Machine[] = [
        { id: '1', name: 'Cat315', type: 'Retroexcavadora de Oruga', imageUrl: '/cat315-excavator.jpg', status: 'available' },
        { id: '2', name: 'Cat312', type: 'Retroexcavadora de Oruga', status: 'available' },
        { id: '3', name: 'Bulldozer D6', type: 'Bulldozer', status: 'available' },
        { id: '4', name: 'Vibro-SD100', type: 'Vibrocompactador', status: 'available' },
        { id: '5', name: 'VIBRO-SD70D', type: 'Vibrocompactador', status: 'available' },
        { id: '6', name: 'VIBRO-CATCS-323', type: 'Vibrocompactador', status: 'available' },
        { id: '7', name: 'KOMATSU-200', type: 'Retroexcavadora de Oruga', status: 'available' },
        { id: '8', name: 'CARGADOR-S950', type: 'Cargador', status: 'available' },
        { id: '9', name: 'MOTONIVELADORA', type: 'Motoniveladora', status: 'available' },
        { id: '10', name: 'PALADRAGA', type: 'Paladraga', status: 'available' },
        { id: '11', name: 'MACK UFJ852', type: 'Volqueta', plate: 'UFJ852', status: 'available' },
        { id: '12', name: 'MACK SWN429', type: 'Volqueta', plate: 'SWN429', status: 'available' },
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
