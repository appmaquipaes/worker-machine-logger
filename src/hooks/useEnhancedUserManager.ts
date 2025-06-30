
import { useState, useEffect } from 'react';
import { useUnifiedDataManager } from './useUnifiedDataManager';
import { supabase } from '@/integrations/supabase/client';

interface LocalUser {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor';
  assignedMachines?: string[];
  comisionPorHora?: number;
  comisionPorViaje?: number;
}

export const useEnhancedUserManager = () => {
  const [users, setUsers] = useState<LocalUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar usuarios usando el sistema unificado
  const loadUsers = async () => {
    setIsLoading(true);
    
    const supabaseQuery = async () => {
      return await supabase
        .from('profiles')
        .select('*');
    };

    try {
      const supabaseUsers = await readData<any>(
        'users',
        supabaseQuery,
        'users'
      );

      const formattedUsers: LocalUser[] = supabaseUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        assignedMachines: user.assigned_machines || [],
        comisionPorHora: user.comision_por_hora,
        comisionPorViaje: user.comision_por_viaje
      }));

      setUsers(formattedUsers);
      console.log(`✅ Usuarios cargados: ${formattedUsers.length}`);
      
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Actualizar máquinas de usuario
  const updateUserMachines = async (userId: string, machineIds: string[]): Promise<boolean> => {
    const supabaseOperation = async () => {
      return await supabase
        .from('profiles')
        .update({ assigned_machines: machineIds })
        .eq('id', userId);
    };

    const localStorageUpdater = () => {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, assignedMachines: machineIds } : user
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    return await writeData(
      'users',
      { id: userId, assignedMachines: machineIds },
      'update',
      supabaseOperation,
      'users',
      localStorageUpdater
    );
  };

  // Actualizar comisión por hora
  const updateUserCommission = async (userId: string, commission: number): Promise<boolean> => {
    const supabaseOperation = async () => {
      return await supabase
        .from('profiles')
        .update({ comision_por_hora: commission })
        .eq('id', userId);
    };

    const localStorageUpdater = () => {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, comisionPorHora: commission } : user
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    return await writeData(
      'users',
      { id: userId, comisionPorHora: commission },
      'update',
      supabaseOperation,
      'users',
      localStorageUpdater
    );
  };

  // Actualizar comisión por viaje
  const updateUserTripCommission = async (userId: string, commission: number): Promise<boolean> => {
    const supabaseOperation = async () => {
      return await supabase
        .from('profiles')
        .update({ comision_por_viaje: commission })
        .eq('id', userId);
    };

    const localStorageUpdater = () => {
      const updatedUsers = users.map(user =>
        user.id === userId ? { ...user, comisionPorViaje: commission } : user
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    return await writeData(
      'users',
      { id: userId, comisionPorViaje: commission },
      'update',
      supabaseOperation,
      'users',
      localStorageUpdater
    );
  };

  // Eliminar usuario
  const deleteUser = async (userId: string): Promise<boolean> => {
    const supabaseOperation = async () => {
      return await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
    };

    const localStorageUpdater = () => {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    };

    return await writeData(
      'users',
      { id: userId },
      'delete',
      supabaseOperation,
      'users',
      localStorageUpdater
    );
  };

  return {
    users,
    isLoading,
    loadUsers,
    updateUserMachines,
    updateUserCommission,
    updateUserTripCommission,
    deleteUser
  };
};
