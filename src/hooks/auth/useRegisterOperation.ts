
import { useCallback } from 'react';
import { toast } from "sonner";
import { StoredUser } from '@/types/auth';
import { getStoredUsers, setStoredUsers } from '@/utils/authStorage';
import { checkEmailExists } from '@/utils/authValidation';

export const useRegisterOperation = () => {
  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    role: 'Trabajador' | 'Administrador' | 'Operador',
    assignedMachines: string[] = []
  ): Promise<boolean> => {
    try {
      if (checkEmailExists(email)) {
        const errorMessage = "El correo electrónico ya está registrado";
        toast.error(errorMessage);
        return false;
      }
      
      const users = getStoredUsers();
      const newUser: StoredUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role,
        ...(role === 'Operador' && { assignedMachines: assignedMachines || [] }),
      };
      
      users.push(newUser);
      setStoredUsers(users);
      
      toast.success("Registro exitoso");
      return true;
    } catch (error) {
      const errorMessage = "Error al registrar usuario";
      console.error(errorMessage, error);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  return { register };
};
