import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

interface Profile {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 SUPABASE AUTH: Inicializando...');
    
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('📡 SUPABASE AUTH: Sesión inicial:', { 
        hasSession: !!session, 
        userEmail: session?.user?.email,
        error 
      });
      
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 SUPABASE AUTH: Cambio de estado:', { 
          event, 
          hasSession: !!session,
          userEmail: session?.user?.email 
        });
        
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      console.log('👤 SUPABASE AUTH: Cargando perfil para usuario:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ SUPABASE AUTH: Error cargando perfil:', error);
        toast.error('Error al cargar el perfil');
      } else if (data) {
        console.log('✅ SUPABASE AUTH: Perfil cargado:', data);
        const profileData: Profile = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor',
          assigned_machines: data.assigned_machines || [],
          comision_por_hora: data.comision_por_hora,
          comision_por_viaje: data.comision_por_viaje
        };
        setProfile(profileData);
      } else {
        console.log('ℹ️ SUPABASE AUTH: No se encontró perfil, usando datos básicos del usuario');
      }
    } catch (error) {
      console.error('❌ SUPABASE AUTH: Error general cargando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: {
    name: string;
    role: Profile['role'];
    assigned_machines?: string[];
  }) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      if (data.user) {
        // Crear perfil en la tabla profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email,
            name: userData.name,
            role: userData.role,
            assigned_machines: userData.assigned_machines || []
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
          toast.error('Error al crear el perfil');
        } else {
          toast.success('Usuario registrado exitosamente');
        }
      }

      return { data, error };
    } catch (error: any) {
      toast.error(error.message || 'Error al registrar usuario');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      toast.success('Inicio de sesión exitoso');
      return { data, error };
    } catch (error: any) {
      toast.error(error.message || 'Error al iniciar sesión');
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      toast.success('Sesión cerrada');
    } catch (error: any) {
      toast.error(error.message || 'Error al cerrar sesión');
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;
  console.log('🔍 SUPABASE AUTH: Estado final:', { 
    isAuthenticated, 
    hasUser: !!user, 
    userEmail: user?.email,
    loading 
  });

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated,
    isAdmin: profile?.role === 'Administrador'
  };
};
