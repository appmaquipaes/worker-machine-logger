
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useMachineMigration } from '@/hooks/useMachineMigration';
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
  const { migrationComplete, syncMachinesFromSupabase } = useMachineMigration();

  // Cargar máquinas con respaldo robusto
  const loadMachines = async () => {
    console.log('🔄 Cargando máquinas...');
    setIsLoading(true);

    try {
      // Primero intentar cargar desde Supabase
      const { data: supabaseMachines, error } = await supabase
        .from('machines')
        .select('*')
        .eq('status', 'active');

      if (!error && supabaseMachines && supabaseMachines.length > 0) {
        console.log('✅ Cargando máquinas desde Supabase:', supabaseMachines.length);
        
        const formattedMachines: Machine[] = supabaseMachines.map(machine => ({
          id: machine.id,
          name: machine.name,
          type: machine.type as Machine['type'],
          plate: machine.license_plate || undefined,
          status: machine.status === 'active' ? 'Disponible' : 'Mantenimiento'
        }));

        setMachines(formattedMachines);
        
        // Sincronizar con localStorage
        localStorage.setItem('machines', JSON.stringify(formattedMachines));
        localStorage.setItem('machines_last_sync', new Date().toISOString());
        
      } else {
        console.log('⚠️ No se pudieron cargar máquinas desde Supabase, usando localStorage');
        
        // Cargar desde localStorage como respaldo
        const storedMachines = localStorage.getItem('machines');
        if (storedMachines) {
          const parsedMachines = JSON.parse(storedMachines);
          const machinesWithStatus = parsedMachines.map((machine: any) => ({
            ...machine,
            status: machine.status || 'Disponible'
          }));
          setMachines(machinesWithStatus);
          console.log('📦 Máquinas cargadas desde localStorage:', machinesWithStatus.length);
        } else {
          console.log('⚠️ No hay máquinas en localStorage, creando máquinas iniciales');
          await createInitialMachines();
        }
      }
    } catch (error) {
      console.error('❌ Error cargando máquinas:', error);
      
      // Último recurso: localStorage
      const storedMachines = localStorage.getItem('machines');
      if (storedMachines) {
        const parsedMachines = JSON.parse(storedMachines);
        setMachines(parsedMachines);
      }
    } finally {
      setIsLoading(false);
    }
  };

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

    try {
      // Insertar en Supabase
      const supabaseMachines = initialMachines.map(machine => ({
        id: machine.id,
        name: machine.name,
        type: machine.type,
        license_plate: machine.plate || null,
        status: 'active'
      }));

      const { error } = await supabase
        .from('machines')
        .insert(supabaseMachines);

      if (!error) {
        console.log('✅ Máquinas iniciales creadas en Supabase');
      }
    } catch (error) {
      console.error('❌ Error creando máquinas iniciales en Supabase:', error);
    }

    // Guardar en localStorage
    setMachines(initialMachines);
    localStorage.setItem('machines', JSON.stringify(initialMachines));
    localStorage.setItem('machines_initialized', 'true');
    console.log('✅ Máquinas iniciales creadas');
  };

  // Cargar máquinas cuando la migración esté completa
  useEffect(() => {
    if (migrationComplete) {
      loadMachines();
    }
  }, [migrationComplete]);

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
    try {
      // Insertar en Supabase primero
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
        console.error('❌ Error agregando máquina en Supabase:', error);
        throw error;
      }

      // Agregar al estado local
      const newMachine: Machine = {
        id: data.id,
        name: machine.name,
        type: machine.type,
        plate: machine.plate,
        status: machine.status
      };

      const updatedMachines = [...machines, newMachine];
      setMachines(updatedMachines);
      
      // Sincronizar localStorage
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
      
      console.log('✅ Máquina agregada exitosamente');
      
    } catch (error) {
      console.error('❌ Error agregando máquina:', error);
      
      // Fallback: agregar solo localmente
      const newMachine: Machine = {
        ...machine,
        id: Date.now().toString(),
      };
      const updatedMachines = [...machines, newMachine];
      setMachines(updatedMachines);
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
    }
  };

  const updateMachine = async (id: string, updatedMachine: Partial<Machine>) => {
    try {
      // Actualizar en Supabase
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
        console.error('❌ Error actualizando máquina en Supabase:', error);
      }

      // Actualizar estado local
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
      
    } catch (error) {
      console.error('❌ Error actualizando máquina:', error);
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      // Eliminar de Supabase (marcar como inactivo)
      const { error } = await supabase
        .from('machines')
        .update({ status: 'inactive' })
        .eq('id', id);

      if (error) {
        console.error('❌ Error eliminando máquina en Supabase:', error);
      }

      // Eliminar del estado local
      const updatedMachines = machines.filter(machine => machine.id !== id);
      setMachines(updatedMachines);
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
      
      // Limpiar máquina seleccionada si es la que se eliminó
      if (selectedMachine && selectedMachine.id === id) {
        clearSelectedMachine();
      }
      
    } catch (error) {
      console.error('❌ Error eliminando máquina:', error);
    }
  };

  const syncMachines = async () => {
    console.log('🔄 Sincronizando máquinas manualmente...');
    await loadMachines();
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
