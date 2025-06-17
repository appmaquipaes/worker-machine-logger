
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { getStoredUser, setStoredUser } from '@/utils/authStorage';
import { useAuthOperations } from '@/hooks/useAuthOperations';

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Siempre llamar useAuthOperations en el mismo orden
  const authOperations = useAuthOperations();

  // Cargar usuario del almacenamiento local al iniciar
  useEffect(() => {
    try {
      const storedUser = getStoredUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  // Wrapper optimizado para login que actualiza el estado del usuario
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await authOperations.login(email, password);
      if (success) {
        const updatedUser = getStoredUser();
        setUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }, [authOperations]);

  // Wrapper optimizado para register
  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    role: 'Trabajador' | 'Administrador' | 'Operador',
    assignedMachines?: string[]
  ): Promise<boolean> => {
    try {
      const success = await authOperations.register(name, email, password, role, assignedMachines);
      if (success && !user) {
        // Si no hay usuario autenticado, iniciar sesión automáticamente
        return await login(email, password);
      }
      return success;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  }, [authOperations, user, login]);

  // Wrapper optimizado para updateUserMachines
  const updateUserMachines = useCallback(async (userId: string, machineIds: string[]): Promise<boolean> => {
    try {
      const success = await authOperations.updateUserMachines(userId, machineIds);
      if (success && user && user.id === userId) {
        const updatedUser = { ...user, assignedMachines: machineIds };
        setUser(updatedUser);
        setStoredUser(updatedUser);
      }
      return success;
    } catch (error) {
      console.error('Update user machines error:', error);
      return false;
    }
  }, [authOperations, user]);

  // Wrapper optimizado para logout
  const logout = useCallback(() => {
    try {
      authOperations.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [authOperations]);

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    login,
    register,
    logout,
    isLoading: authOperations.isLoading || isInitialLoading,
    resetPassword: authOperations.resetPassword,
    updatePassword: authOperations.updatePassword,
    updateUserMachines
  }), [
    user,
    login,
    register,
    logout,
    authOperations.isLoading,
    authOperations.resetPassword,
    authOperations.updatePassword,
    updateUserMachines,
    isInitialLoading
  ]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
