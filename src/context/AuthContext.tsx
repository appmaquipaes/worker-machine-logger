
import React, { createContext, useContext } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabaseAuth = useSupabaseAuth();

  const value: AuthContextType = {
    user: supabaseAuth.user,
    login: supabaseAuth.login,
    register: supabaseAuth.register,
    logout: supabaseAuth.logout,
    isLoading: supabaseAuth.isLoading,
    resetPassword: supabaseAuth.resetPassword,
    updatePassword: async (email: string, resetCode: string, newPassword: string) => {
      // For Supabase, we don't need the email and resetCode parameters
      return supabaseAuth.updatePassword(newPassword);
    },
    updateUserMachines: supabaseAuth.updateUserMachines
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
