
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        if (event === 'SIGNED_IN' && session?.user) {
          // Create or update user profile when signing in
          await ensureUserProfile(session.user);
        }
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

  const ensureUserProfile = async (user: User) => {
    try {
      // Check if profile exists
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
            email: user.email || '',
            role: 'Trabajador', // Default role
            assigned_machines: []
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          console.log('✅ Profile created for user:', user.email);
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Sesión iniciada correctamente');
      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión');
      return { error };
    }
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      // If user was created successfully, create profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name: name,
            email: email,
            role: role,
            assigned_machines: []
          });

        if (profileError) {
          console.error('Error creating profile:', profileError);
        }
      }

      toast.success('Usuario registrado correctamente');
      return { data, error: null };
    } catch (error) {
      console.error('Register error:', error);
      toast.error('Error al registrar usuario');
      return { error };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return { error };
      }

      setUser(null);
      setSession(null);
      toast.success('Sesión cerrada correctamente');
      return { error: null };
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error al cerrar sesión');
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Correo de recuperación enviado');
      return { error: null };
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Error al enviar correo de recuperación');
      return { error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Contraseña actualizada correctamente');
      return { error: null };
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('Error al actualizar contraseña');
      return { error };
    }
  };

  const updateUserMachines = async (userId: string, machineIds: string[]) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ assigned_machines: machineIds })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user machines:', error);
        toast.error('Error al actualizar máquinas asignadas');
        return false;
      }

      toast.success('Máquinas asignadas actualizadas correctamente');
      return true;
    } catch (error) {
      console.error('Error updating user machines:', error);
      toast.error('Error al actualizar máquinas asignadas');
      return false;
    }
  };

  // Map user to the expected format
  const mappedUser = user ? {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.email?.split('@')[0] || 'Usuario',
    role: 'Trabajador' // This will be updated from the profile
  } : null;

  return {
    user: mappedUser,
    session,
    isLoading,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
    updateUserMachines
  };
};
