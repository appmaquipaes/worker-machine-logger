
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '@/types/auth';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

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
  const [fullUser, setFullUser] = useState<User | null>(null);

  // Load full user profile when auth user changes
  useEffect(() => {
    const loadUserProfile = async () => {
      if (supabaseAuth.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', supabaseAuth.user.id)
            .single();

          if (error) {
            console.error('Error loading user profile:', error);
            return;
          }

          if (profile) {
            setFullUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role as 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor',
              assignedMachines: profile.assigned_machines || [],
              comisionPorHora: profile.comision_por_hora,
              comisionPorViaje: profile.comision_por_viaje
            });
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      } else {
        setFullUser(null);
      }
    };

    loadUserProfile();
  }, [supabaseAuth.user]);

  const value: AuthContextType = {
    user: fullUser,
    login: async (email: string, password: string) => {
      const result = await supabaseAuth.login(email, password);
      return !result.error;
    },
    register: async (name: string, email: string, password: string, role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor', assignedMachines?: string[]) => {
      const result = await supabaseAuth.register(email, password, name, role);
      return !result.error;
    },
    logout: supabaseAuth.logout,
    isLoading: supabaseAuth.isLoading,
    resetPassword: async (email: string) => {
      const result = await supabaseAuth.resetPassword(email);
      return !result.error;
    },
    updatePassword: async (email: string, resetCode: string, newPassword: string) => {
      const result = await supabaseAuth.updatePassword(newPassword);
      return !result.error;
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
