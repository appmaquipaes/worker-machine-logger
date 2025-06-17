
import { useCallback } from 'react';
import { toast } from "sonner";
import { validateUserCredentials } from '@/utils/authValidation';
import { setStoredUser } from '@/utils/authStorage';

export const useLoginOperation = () => {
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = validateUserCredentials(email, password);
      
      if (!foundUser) {
        toast.error("Credenciales incorrectas");
        return false;
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setStoredUser(userWithoutPassword);
      toast.success("Inicio de sesión exitoso");
      return true;
    } catch (error) {
      const errorMessage = "Error al iniciar sesión";
      console.error(errorMessage, error);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  return { login };
};
