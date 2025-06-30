
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Load machines from Supabase
  const loadMachines = async () => {
    console.log('🔄 Cargando máquinas desde Supabase...');
    setIsLoading(true);

    try {
      const { data: supabaseMachines, error } = await supabase
        .from('machines')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) {
        console.error('❌ Error cargando máquinas:', error);
        toast.error('Error al cargar máquinas');
        return;
      }

      if (supabaseMachines) {
        console.log('✅ Máquinas cargadas desde Supabase:', supabaseMachines.length);
        
        const formattedMachines: Machine[] = supabaseMachines.map(machine => ({
          id: machine.id,
          name: machine.name,
          type: machine.type as Machine['type'],
          plate: machine.license_plate || undefined,
          status: machine.status === 'active' ? 'Disponible' : 'Mantenimiento'
        }));

        setMachines(formattedMachines);
      }
    } catch (error) {
      console.error('❌ Error cargando máquinas:', error);
      toast.error('Error al cargar máquinas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMachines();
  }, []);

  // Recover selected machine from localStorage
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
    try {
      const { data, error } = await supabase
        .from('machines')
        .insert({
          name: machine.name,
          type: machine.type,
          license_plate: machine.plate || null,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error agregando máquina:', error);
        toast.error('Error al agregar máquina');
        return;
      }

      const newMachine: Machine = {
        id: data.id,
        name: machine.name,
        type: machine.type,
        plate: machine.plate,
        status: machine.status
      };

      setMachines(prev => [...prev, newMachine]);
      toast.success('Máquina agregada exitosamente');
      
    } catch (error) {
      console.error('❌ Error agregando máquina:', error);
      toast.error('Error al agregar máquina');
    }
  };

  const updateMachine = async (id: string, updatedMachine: Partial<Machine>) => {
    try {
      const { error } = await supabase
        .from('machines')
        .update({
          name: updatedMachine.name,
          type: updatedMachine.type,
          license_plate: updatedMachine.plate || null,
          status: updatedMachine.status === 'Disponible' ? 'active' : 'inactive'
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error actualizando máquina:', error);
        toast.error('Error al actualizar máquina');
        return;
      }

      setMachines(prev => prev.map(machine =>
        machine.id === id ? { ...machine, ...updatedMachine } : machine
      ));
      
      if (selectedMachine && selectedMachine.id === id) {
        const updated = { ...selectedMachine, ...updatedMachine };
        setSelectedMachine(updated);
        localStorage.setItem('selectedMachine', JSON.stringify(updated));
      }
      
      toast.success('Máquina actualizada exitosamente');
    } catch (error) {
      console.error('❌ Error actualizando máquina:', error);
      toast.error('Error al actualizar máquina');
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('machines')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) {
        console.error('❌ Error eliminando máquina:', error);
        toast.error('Error al eliminar máquina');
        return;
      }

      setMachines(prev => prev.filter(machine => machine.id !== id));
      
      if (selectedMachine && selectedMachine.id === id) {
        clearSelectedMachine();
      }
      
      toast.success('Máquina eliminada exitosamente');
    } catch (error) {
      console.error('❌ Error eliminando máquina:', error);
      toast.error('Error al eliminar máquina');
    }
  };

  const syncMachines = async () => {
    console.log('🔄 Sincronizando máquinas...');
    await loadMachines();
    toast.success('Máquinas sincronizadas exitosamente');
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
