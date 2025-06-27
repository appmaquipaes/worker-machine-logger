
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor';
  assigned_machines?: string[];
  comision_por_hora?: number;
  comision_por_viaje?: number;
}

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              
              if (error) {
                console.log('Profile not found, might be first login');
                setProfile(null);
              } else {
                setProfile(profileData);
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        toast.success("Inicio de sesión exitoso");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión");
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor',
    assignedMachines: string[] = []
  ): Promise<boolean> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
            email,
            role,
            assigned_machines: (role === 'Operador' || role === 'Conductor') ? assignedMachines : null
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast.error("Usuario creado pero error al crear perfil");
          return false;
        }

        toast.success("Usuario registrado exitosamente");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al registrar usuario");
      return false;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const redirectUrl = `${window.location.origin}/reset-password`;
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Se ha enviado un enlace de restablecimiento a tu correo");
      return true;
    } catch (error) {
      console.error("Error al solicitar restablecimiento:", error);
      toast.error("Error al procesar la solicitud");
      return false;
    }
  };

  const updatePassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success("Contraseña actualizada correctamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      toast.error("Error al actualizar la contraseña");
      return false;
    }
  };

  const updateUserMachines = async (userId: string, machineIds: string[]): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ assigned_machines: machineIds })
        .eq('id', userId);

      if (error) {
        toast.error("Error al actualizar máquinas asignadas");
        return false;
      }

      toast.success("Máquinas asignadas actualizadas");
      return true;
    } catch (error) {
      console.error("Error al actualizar máquinas:", error);
      toast.error("Error al actualizar las máquinas asignadas");
      return false;
    }
  };

  return {
    user: profile ? {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      assignedMachines: profile.assigned_machines || [],
      comisionPorHora: profile.comision_por_hora,
      comisionPorViaje: profile.comision_por_viaje
    } : null,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateUserMachines,
    isLoading
  };
};
