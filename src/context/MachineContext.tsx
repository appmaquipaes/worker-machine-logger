import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMachineMigration } from '@/hooks/useMachineMigration';
import { useEnhancedMachineManager } from '@/hooks/useEnhancedMachineManager';
import { supabase } from '@/integrations/supabase/client';

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

  // Cargar máquinas cuando la migración esté completa
  useEffect(() => {
    if (migrationComplete) {
      enhancedLoad();
    }
  }, [migrationComplete, enhancedLoad]);

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

  // Mantener función para crear máquinas iniciales por compatibilidad
  const createInitialMachines = async () => {
    const initialMachines: Machine[] = [
      { id: '1', name: 'Cat315', type: 'Retroexcavadora de Oruga', imageUrl: '/cat315-excavator.jpg', status: 'Disponible' },
      { id: '2', name: 'Cat312', type: 'Retroexcavadora de Oruga', status: 'Disponible' },
      { id: '3', name: 'Bulldozer D6', type: 'Bulldozer', status: 'Disponible' },
      { id: '4', name: 'Vibro-SD100', type: 'Vibrocompactador', status: 'Disponible' },
      { id: '5', name: 'VIBRO-SD70D', type: 'Vibrocompactador', status: 'Disponible' },
      { id: '6', name: 'VIBRO-CATCS-323', type: 'Vibrocompactador', status: 'Disponible' },
      { id: '7', name: 'KOMATSU-200', type: 'Retroexcavadora de Oruga', status: 'Disponible' },
      { id: '8', name: 'CARGADOR-S950', type: 'Cargador', status: 'Disponible' },
      { id: '9', name: 'MOTONIVELADORA', type: 'Motoniveladora', status: 'Disponible' },
      { id: '10', name: 'PALADRAGA', type: 'Paladraga', status: 'Disponible' },
      { id: '11', name: 'MACK UFJ852', type: 'Volqueta', plate: 'UFJ852', status: 'Disponible' },
      { id: '12', name: 'MACK SWN429', type: 'Volqueta', plate: 'SWN429', status: 'Disponible' },
    ];

    for (const machine of initialMachines) {
      await addMachine(machine);
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
    isLoading,
    syncMachines,
  };

  return <MachineContext.Provider value={value}>{children}</MachineContext.Provider>;
};
