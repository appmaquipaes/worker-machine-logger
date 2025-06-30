
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

// Cache global para evitar múltiples cargas
let machinesCache: Machine[] = [];
let isLoading = false;
let loadPromise: Promise<Machine[]> | null = null;

export const useEnhancedMachineManager = () => {
  const [machines, setMachines] = useState<Machine[]>(machinesCache);
  const [loading, setLoading] = useState(false);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar máquinas usando el sistema unificado con cache
  const loadMachines = async (): Promise<Machine[]> => {
    // Si ya hay una carga en progreso, esperar a que termine
    if (loadPromise) {
      return loadPromise;
    }

    // Si ya tenemos datos en cache, devolverlos
    if (machinesCache.length > 0) {
      setMachines(machinesCache);
      return machinesCache;
    }

    // Si ya se está cargando, no hacer nada
    if (isLoading) {
      return machinesCache;
    }

    isLoading = true;
    setLoading(true);
    
    const supabaseQuery = async () => {
      return await supabase
        .from('machines')
        .select('*')
        .eq('status', 'active');
    };

    loadPromise = (async () => {
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

        // Actualizar cache global
        machinesCache = formattedMachines;
        setMachines(formattedMachines);
        console.log(`✅ Máquinas cargadas: ${formattedMachines.length}`);
        
        return formattedMachines;
      } catch (error) {
        console.error('❌ Error cargando máquinas:', error);
        return [];
      } finally {
        isLoading = false;
        setLoading(false);
        loadPromise = null;
      }
    })();

    return loadPromise;
  };

  // Limpiar cache cuando sea necesario
  const clearCache = () => {
    machinesCache = [];
    loadPromise = null;
    isLoading = false;
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
      machinesCache = updatedMachines;
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
      clearCache(); // Limpiar cache para forzar recarga
      await loadMachines();
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
      machinesCache = updatedMachines;
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
    };

    const success = await writeData(
      'machines',
      { id, ...updatedMachine },
      'update',
      supabaseOperation,
      'machines',
      localStorageUpdater
    );

    return success;
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
      machinesCache = updatedMachines;
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
    };

    const success = await writeData(
      'machines',
      { id },
      'delete',
      supabaseOperation,
      'machines',
      localStorageUpdater
    );

    return success;
  };

  return {
    machines,
    isLoading: loading,
    loadMachines,
    addMachine,
    updateMachine,
    deleteMachine,
    clearCache
  };
};
