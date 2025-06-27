
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

  // Show loading state while auth is initializing
  if (supabaseAuth.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
