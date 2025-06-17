
import { useCallback } from 'react';
import { toast } from "sonner";
import { getStoredUsers, setStoredUsers, removeStoredUser } from '@/utils/authStorage';

export const useUserManagementOperations = () => {
  const updateUserMachines = useCallback(async (userId: string, machineIds: string[]): Promise<boolean> => {
    try {
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.id === userId);
      
      if (userIndex === -1) {
        const errorMessage = "Usuario no encontrado";
        toast.error(errorMessage);
        return false;
      }
      
      users[userIndex].assignedMachines = machineIds;
      setStoredUsers(users);
      
      toast.success("Máquinas asignadas actualizadas");
      return true;
    } catch (error) {
      const errorMessage = "Error al actualizar las máquinas asignadas";
      console.error(errorMessage, error);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    removeStoredUser();
    toast.success("Sesión cerrada");
  }, []);

  return { updateUserMachines, logout };
};
