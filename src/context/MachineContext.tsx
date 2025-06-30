
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMachineMigration } from '@/hooks/useMachineMigration';
import { useEnhancedMachineManager } from '@/hooks/useEnhancedMachineManager';

export type Machine = {
  id: string;
  name: string;
  type: 'Retroexcavadora de Oruga' | 'Retroexcavadora de Llanta' | 'Cargador' | 'Vibrocompactador' | 'Paladraga' | 'Bulldozer' | 'Camabaja' | 'Volqueta' | 'Camión' | 'Semirremolque' | 'Tractomula' | 'Motoniveladora' | 'Escombrera' | 'Otro';
  plate?: string;
  imageUrl?: string;
  status: 'Disponible' | 'En Uso' | 'Mantenimiento';
};

type MachineContextType = {
  machines: Machine[];
  selectedMachine: Machine | null;
  selectMachine: (machine: Machine) => void;
  clearSelectedMachine: () => void;
  addMachine: (machine: Omit<Machine, 'id'>) => void;
  updateMachine: (id: string, machine: Partial<Machine>) => void;
  deleteMachine: (id: string) => void;
  isLoading: boolean;
  syncMachines: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  
  const { migrationComplete } = useMachineMigration();
  const { 
    machines: enhancedMachines, 
    isLoading: enhancedLoading, 
    loadMachines: enhancedLoad, 
    addMachine: enhancedAdd, 
    updateMachine: enhancedUpdate, 
    deleteMachine: enhancedDelete 
  } = useEnhancedMachineManager();

  // Usar el sistema mejorado pero mantener compatibilidad
  useEffect(() => {
    setMachines(enhancedMachines);
  }, [enhancedMachines]);

  useEffect(() => {
    setIsLoading(enhancedLoading);
  }, [enhancedLoading]);

  // Cargar máquinas solo una vez cuando la migración esté completa
  useEffect(() => {
    if (migrationComplete && !initialized) {
      setInitialized(true);
      enhancedLoad();
    }
  }, [migrationComplete, initialized, enhancedLoad]);

  // Recuperar máquina seleccionada del localStorage
  useEffect(() => {
    const storedSelectedMachine = localStorage.getItem('selectedMachine');
    if (storedSelectedMachine) {
      console.log('🔄 Recuperando máquina seleccionada:', storedSelectedMachine);
      setSelectedMachine(JSON.parse(storedSelectedMachine));
    }
  }, []);

  const selectMachine = (machine: Machine) => {
    console.log('🎯 Seleccionando máquina:', machine);
    setSelectedMachine(machine);
    localStorage.setItem('selectedMachine', JSON.stringify(machine));
  };

  const clearSelectedMachine = () => {
    console.log('🧹 Limpiando máquina seleccionada');
    setSelectedMachine(null);
    localStorage.removeItem('selectedMachine');
  };

  const addMachine = async (machine: Omit<Machine, 'id'>) => {
    return await enhancedAdd(machine);
  };

  const updateMachine = async (id: string, updatedMachine: Partial<Machine>) => {
    const success = await enhancedUpdate(id, updatedMachine);
    
    // Actualizar máquina seleccionada si es la misma
    if (success && selectedMachine && selectedMachine.id === id) {
      const updated = { ...selectedMachine, ...updatedMachine };
      setSelectedMachine(updated);
      localStorage.setItem('selectedMachine', JSON.stringify(updated));
    }
    
    return success;
  };

  const deleteMachine = async (id: string) => {
    const success = await enhancedDelete(id);
    
    // Limpiar máquina seleccionada si es la que se eliminó
    if (success && selectedMachine && selectedMachine.id === id) {
      clearSelectedMachine();
    }
    
    return success;
  };

  const syncMachines = async () => {
    console.log('🔄 Sincronizando máquinas manualmente...');
    await enhancedLoad();
  };

  const value = {
    machines,
    selectedMachine,
    selectMachine,
    clearSelectedMachine,
    addMachine,
    updateMachine,
    deleteMachine,
    isLoading,
    syncMachines,
  };

  return <MachineContext.Provider value={value}>{children}</MachineContext.Provider>;
};
