
import { useState, useCallback } from 'react';
import { toast } from "sonner";
import { User, StoredUser } from '@/types/auth';
import { 
  getStoredUsers, 
  setStoredUsers, 
  setStoredUser, 
  removeStoredUser,
  getResetRequests,
  setResetRequests 
} from '@/utils/authStorage';
import { 
  validateUserCredentials, 
  checkEmailExists, 
  validateResetCode, 
  generateResetCode 
} from '@/utils/authValidation';

interface AuthOperationsState {
  isLoading: boolean;
  error: string | null;
}

export const useAuthOperations = () => {
  const [state, setState] = useState<AuthOperationsState>({
    isLoading: false,
    error: null
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const foundUser = validateUserCredentials(email, password);
      
      if (!foundUser) {
        setError("Credenciales incorrectas");
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
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    role: 'Trabajador' | 'Administrador' | 'Operador',
    assignedMachines: string[] = []
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      if (checkEmailExists(email)) {
        const errorMessage = "El correo electrónico ya está registrado";
        setError(errorMessage);
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
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updateUserMachines = useCallback(async (userId: string, machineIds: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.id === userId);
      
      if (userIndex === -1) {
        const errorMessage = "Usuario no encontrado";
        setError(errorMessage);
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
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!checkEmailExists(email)) {
        const errorMessage = "No existe una cuenta con ese correo electrónico";
        setError(errorMessage);
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
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const updatePassword = useCallback(async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      if (!validateResetCode(email, resetCode)) {
        const errorMessage = "El código es incorrecto o ha expirado";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      }
      
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.email === email);
      
      if (userIndex === -1) {
        const errorMessage = "Usuario no encontrado";
        setError(errorMessage);
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
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const logout = useCallback(() => {
    removeStoredUser();
    toast.success("Sesión cerrada");
  }, []);

  return {
    login,
    register,
    updateUserMachines,
    resetPassword,
    updatePassword,
    logout,
    isLoading: state.isLoading,
    error: state.error
  };
};
