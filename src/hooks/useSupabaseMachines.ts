
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

      // Type assertion to ensure proper typing
      const machinesData: SupabaseMachine[] = (data || []).map(machine => ({
        id: machine.id,
        name: machine.name,
        type: machine.type,
        license_plate: machine.license_plate,
        brand: machine.brand,
        model: machine.model,
        year: machine.year,
        status: (machine.status as 'active' | 'inactive' | 'maintenance') || 'active',
        created_at: machine.created_at,
        updated_at: machine.updated_at
      }));

      setMachines(machinesData);
      console.log('Máquinas cargadas desde Supabase:', machinesData.length);
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

      // Type assertion for the returned data
      const newMachine: SupabaseMachine = {
        id: data.id,
        name: data.name,
        type: data.type,
        license_plate: data.license_plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        status: (data.status as 'active' | 'inactive' | 'maintenance') || 'active',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setMachines(prev => [...prev, newMachine]);
      toast.success('Máquina agregada exitosamente');
      return newMachine;
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

      // Type assertion for the returned data
      const updatedMachine: SupabaseMachine = {
        id: data.id,
        name: data.name,
        type: data.type,
        license_plate: data.license_plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        status: (data.status as 'active' | 'inactive' | 'maintenance') || 'active',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setMachines(prev => prev.map(machine => 
        machine.id === id ? updatedMachine : machine
      ));
      toast.success('Máquina actualizada exitosamente');
      return updatedMachine;
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
