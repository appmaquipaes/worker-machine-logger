
import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const authOperations = useAuthOperations();

  // Cargar usuario del almacenamiento local al iniciar
  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsInitialLoading(false);
  }, []);

  // Wrapper para login que actualiza el estado del usuario
  const login = async (email: string, password: string): Promise<boolean> => {
    const success = await authOperations.login(email, password);
    if (success) {
      const updatedUser = getStoredUser();
      setUser(updatedUser);
    }
    return success;
  };

  // Wrapper para register que puede iniciar sesión automáticamente
  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'Trabajador' | 'Administrador' | 'Operador',
    assignedMachines?: string[]
  ): Promise<boolean> => {
    const success = await authOperations.register(name, email, password, role, assignedMachines);
    if (success && !user) {
      // Si no hay usuario autenticado, iniciar sesión automáticamente
      return await login(email, password);
    }
    return success;
  };

  // Wrapper para updateUserMachines que actualiza el estado si es el usuario actual
  const updateUserMachines = async (userId: string, machineIds: string[]): Promise<boolean> => {
    const success = await authOperations.updateUserMachines(userId, machineIds);
    if (success && user && user.id === userId) {
      const updatedUser = { ...user, assignedMachines: machineIds };
      setUser(updatedUser);
      setStoredUser(updatedUser);
    }
    return success;
  };

  // Wrapper para logout que limpia el estado del usuario
  const logout = () => {
    authOperations.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading: authOperations.isLoading || isInitialLoading,
    resetPassword: authOperations.resetPassword,
    updatePassword: authOperations.updatePassword,
    updateUserMachines
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
