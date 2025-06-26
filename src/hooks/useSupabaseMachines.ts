
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SupabaseMachine {
  id: string;
  name: string;
  type: string;
  license_plate?: string;
  brand?: string;
  model?: string;
  year?: number;
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export const useSupabaseMachines = () => {
  const [machines, setMachines] = useState<SupabaseMachine[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .order('name');

      if (error) throw error;

      setMachines(data || []);
      console.log('Máquinas cargadas desde Supabase:', data?.length || 0);
    } catch (error: any) {
      console.error('Error loading machines:', error);
      toast.error('Error al cargar las máquinas');
    } finally {
      setLoading(false);
    }
  };

  const addMachine = async (machineData: Omit<SupabaseMachine, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('machines')
        .insert([machineData])
        .select()
        .single();

      if (error) throw error;

      setMachines(prev => [...prev, data]);
      toast.success('Máquina agregada exitosamente');
      return data;
    } catch (error: any) {
      console.error('Error adding machine:', error);
      toast.error('Error al agregar la máquina');
      return null;
    }
  };

  const updateMachine = async (id: string, updates: Partial<SupabaseMachine>) => {
    try {
      const { data, error } = await supabase
        .from('machines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMachines(prev => prev.map(machine => 
        machine.id === id ? data : machine
      ));
      toast.success('Máquina actualizada exitosamente');
      return data;
    } catch (error: any) {
      console.error('Error updating machine:', error);
      toast.error('Error al actualizar la máquina');
      return null;
    }
  };

  const deleteMachine = async (id: string) => {
    try {
      const { error } = await supabase
        .from('machines')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMachines(prev => prev.filter(machine => machine.id !== id));
      toast.success('Máquina eliminada exitosamente');
      return true;
    } catch (error: any) {
      console.error('Error deleting machine:', error);
      toast.error('Error al eliminar la máquina');
      return false;
    }
  };

  useEffect(() => {
    loadMachines();
  }, []);

  return {
    machines,
    loading,
    loadMachines,
    addMachine,
    updateMachine,
    deleteMachine
  };
};
