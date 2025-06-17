
import { useState, useCallback } from 'react';
import { useLoginOperation } from './auth/useLoginOperation';
import { useRegisterOperation } from './auth/useRegisterOperation';
import { usePasswordOperations } from './auth/usePasswordOperations';
import { useUserManagementOperations } from './auth/useUserManagementOperations';

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

  // Import operations from smaller hooks
  const { login: loginOperation } = useLoginOperation();
  const { register: registerOperation } = useRegisterOperation();
  const { resetPassword: resetPasswordOperation, updatePassword: updatePasswordOperation } = usePasswordOperations();
  const { updateUserMachines: updateUserMachinesOperation, logout: logoutOperation } = useUserManagementOperations();

  // Wrap operations with loading states
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginOperation(email, password);
      if (!result) {
        setError("Credenciales incorrectas");
      }
      return result;
    } catch (error) {
      const errorMessage = "Error al iniciar sesión";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loginOperation, setLoading, setError]);

  const register = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    role: 'Trabajador' | 'Administrador' | 'Operador',
    assignedMachines?: string[]
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await registerOperation(name, email, password, role, assignedMachines);
    } finally {
      setLoading(false);
    }
  }, [registerOperation, setLoading, setError]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await resetPasswordOperation(email);
    } finally {
      setLoading(false);
    }
  }, [resetPasswordOperation, setLoading, setError]);

  const updatePassword = useCallback(async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await updatePasswordOperation(email, resetCode, newPassword);
    } finally {
      setLoading(false);
    }
  }, [updatePasswordOperation, setLoading, setError]);

  const updateUserMachines = useCallback(async (userId: string, machineIds: string[]): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      return await updateUserMachinesOperation(userId, machineIds);
    } finally {
      setLoading(false);
    }
  }, [updateUserMachinesOperation, setLoading, setError]);

  const logout = useCallback(() => {
    logoutOperation();
  }, [logoutOperation]);

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
