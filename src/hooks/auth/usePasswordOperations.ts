
import { useCallback } from 'react';
import { toast } from "sonner";
import { 
  getStoredUsers, 
  setStoredUsers, 
  getResetRequests,
  setResetRequests 
} from '@/utils/authStorage';
import { 
  checkEmailExists, 
  validateResetCode, 
  generateResetCode 
} from '@/utils/authValidation';

export const usePasswordOperations = () => {
  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    try {
      if (!checkEmailExists(email)) {
        const errorMessage = "No existe una cuenta con ese correo electrónico";
        toast.error(errorMessage);
        return false;
      }
      
      const resetCode = generateResetCode();
      const resetRequests = getResetRequests();
      resetRequests[email] = {
        code: resetCode,
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutos
      };
      setResetRequests(resetRequests);
      
      toast.success(`Código de restablecimiento: ${resetCode} (En producción se enviaría por email)`);
      return true;
    } catch (error) {
      const errorMessage = "Error al procesar la solicitud";
      console.error(errorMessage, error);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const updatePassword = useCallback(async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    try {
      if (!validateResetCode(email, resetCode)) {
        const errorMessage = "El código es incorrecto o ha expirado";
        toast.error(errorMessage);
        return false;
      }
      
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.email === email);
      
      if (userIndex === -1) {
        const errorMessage = "Usuario no encontrado";
        toast.error(errorMessage);
        return false;
      }
      
      users[userIndex].password = newPassword;
      setStoredUsers(users);
      
      const resetRequests = getResetRequests();
      delete resetRequests[email];
      setResetRequests(resetRequests);
      
      toast.success("Contraseña actualizada correctamente");
      return true;
    } catch (error) {
      const errorMessage = "Error al actualizar la contraseña";
      console.error(errorMessage, error);
      toast.error(errorMessage);
      return false;
    }
  }, []);

  return { resetPassword, updatePassword };
};
