
import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador';
  assignedMachines?: string[];
  comisionPorHora?: number;
};

export const useUserManagement = (currentUserId?: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios optimizado
  const loadUsers = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const usersWithoutPassword = storedUsers.map(
        ({ password, ...userWithoutPassword }: any) => userWithoutPassword
      );
      setUsers(usersWithoutPassword);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error al cargar usuarios');
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Eliminar usuario optimizado
  const removeUser = useCallback((id: string) => {
    if (id === currentUserId) {
      toast.error('No puedes eliminar tu propia cuenta');
      return false;
    }
    
    try {
      const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = currentUsers.filter((u: any) => u.id !== id);
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      const usersWithoutPassword = updatedUsers.map(
        ({ password, ...userWithoutPassword }: any) => userWithoutPassword
      );
      setUsers(usersWithoutPassword);
      
      toast.success('Usuario eliminado correctamente');
      return true;
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Error al eliminar usuario');
      return false;
    }
  }, [currentUserId]);

  // Actualizar comisión de usuario
  const updateUserCommission = useCallback((userId: string, commission: number) => {
    try {
      const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = currentUsers.map((u: any) => 
        u.id === userId 
          ? { ...u, comisionPorHora: commission }
          : u
      );
      
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, comisionPorHora: commission }
          : u
      ));
      
      toast.success('Comisión actualizada correctamente');
      return true;
    } catch (error) {
      console.error('Error updating commission:', error);
      toast.error('Error al actualizar comisión');
      return false;
    }
  }, []);

  // Actualizar máquinas asignadas
  const updateUserMachines = useCallback((userId: string, machineIds: string[]) => {
    try {
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, assignedMachines: machineIds }
          : u
      ));
      return true;
    } catch (error) {
      console.error('Error updating user machines:', error);
      return false;
    }
  }, []);

  // Estadísticas calculadas con memoización
  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalOperators: users.filter(u => u.role === 'Operador').length,
    totalAdmins: users.filter(u => u.role === 'Administrador').length,
    totalWorkers: users.filter(u => u.role === 'Trabajador').length
  }), [users]);

  return {
    users,
    stats,
    loading,
    error,
    removeUser,
    updateUserCommission,
    updateUserMachines,
    refreshUsers: loadUsers
  };
};
