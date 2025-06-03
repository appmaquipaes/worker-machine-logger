
import { useState } from 'react';
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

export const useAuthOperations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
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
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'Trabajador' | 'Administrador' | 'Operador',
    assignedMachines: string[] = []
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (checkEmailExists(email)) {
        toast.error("El correo electrónico ya está registrado");
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
      console.error("Error al registrar:", error);
      toast.error("Error al registrar usuario");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserMachines = async (userId: string, machineIds: string[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.id === userId);
      
      if (userIndex === -1) {
        toast.error("Usuario no encontrado");
        return false;
      }
      
      users[userIndex].assignedMachines = machineIds;
      setStoredUsers(users);
      
      toast.success("Máquinas asignadas actualizadas");
      return true;
    } catch (error) {
      console.error("Error al actualizar máquinas:", error);
      toast.error("Error al actualizar las máquinas asignadas");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!checkEmailExists(email)) {
        toast.error("No existe una cuenta con ese correo electrónico");
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
      console.error("Error al solicitar restablecimiento:", error);
      toast.error("Error al procesar la solicitud");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      if (!validateResetCode(email, resetCode)) {
        toast.error("El código es incorrecto o ha expirado");
        return false;
      }
      
      const users = getStoredUsers();
      const userIndex = users.findIndex((u) => u.email === email);
      
      if (userIndex === -1) {
        toast.error("Usuario no encontrado");
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
      console.error("Error al actualizar contraseña:", error);
      toast.error("Error al actualizar la contraseña");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeStoredUser();
    toast.success("Sesión cerrada");
  };

  return {
    login,
    register,
    updateUserMachines,
    resetPassword,
    updatePassword,
    logout,
    isLoading
  };
};
