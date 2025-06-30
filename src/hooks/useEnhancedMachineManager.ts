
import { useState, useEffect } from 'react';
import { useUnifiedDataManager } from './useUnifiedDataManager';
import { supabase } from '@/integrations/supabase/client';
import { Machine } from '@/context/MachineContext';

interface LocalMachine {
  id: string;
  name: string;
  type: string;
  plate?: string;
  status: string;
}

export const useEnhancedMachineManager = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar máquinas usando el sistema unificado
  const loadMachines = async () => {
    setIsLoading(true);
    
    const supabaseQuery = async () => {
      return await supabase
        .from('machines')
        .select('*')
        .eq('status', 'active');
    };

    try {
      const supabaseMachines = await readData<any>(
        'machines',
        supabaseQuery,
        'machines'
      );

      const formattedMachines: Machine[] = supabaseMachines.map(machine => ({
        id: machine.id,
        name: machine.name,
        type: machine.type as Machine['type'],
        plate: machine.license_plate || undefined,
        status: machine.status === 'active' ? 'Disponible' : 'Mantenimiento'
      }));

      setMachines(formattedMachines);
      console.log(`✅ Máquinas cargadas: ${formattedMachines.length}`);
      
    } catch (error) {
      console.error('❌ Error cargando máquinas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar máquina usando el sistema unificado
  const addMachine = async (machine: Omit<Machine, 'id'>) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('machines')
        .insert({
          name: machine.name,
          type: machine.type,
          license_plate: machine.plate || null,
          status: 'active'
        });
    };

    const localStorageUpdater = (newMachine: Machine) => {
      const machineWithId = { ...machine, id: Date.now().toString() };
      const updatedMachines = [...machines, machineWithId];
      setMachines(updatedMachines);
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
    };

    const success = await writeData(
      'machines',
      machine,
      'create',
      supabaseOperation,
      'machines',
      localStorageUpdater
    );

    if (success) {
      await loadMachines(); // Recargar para obtener el ID correcto de Supabase
    }

    return success;
  };

  // Actualizar máquina usando el sistema unificado
  const updateMachine = async (id: string, updatedMachine: Partial<Machine>) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('machines')
        .update({
          name: updatedMachine.name,
          type: updatedMachine.type,
          license_plate: updatedMachine.plate || null,
          status: updatedMachine.status === 'Disponible' ? 'active' : 'inactive'
        })
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedMachines = machines.map(machine =>
        machine.id === id ? { ...machine, ...updatedMachine } : machine
      );
      setMachines(updatedMachines);
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
    };

    return await writeData(
      'machines',
      { id, ...updatedMachine },
      'update',
      supabaseOperation,
      'machines',
      localStorageUpdater
    );
  };

  // Eliminar máquina usando el sistema unificado
  const deleteMachine = async (id: string) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('machines')
        .update({ status: 'inactive' })
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedMachines = machines.filter(machine => machine.id !== id);
      setMachines(updatedMachines);
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
    };

    return await writeData(
      'machines',
      { id },
      'delete',
      supabaseOperation,
      'machines',
      localStorageUpdater
    );
  };

  return {
    machines,
    isLoading,
    loadMachines,
    addMachine,
    updateMachine,
    deleteMachine
  };
};
