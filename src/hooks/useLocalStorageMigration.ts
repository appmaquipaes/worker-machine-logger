import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

export const useLocalStorageMigration = () => {
  useEffect(() => {
    const migrateLocalStorageUsers = async () => {
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (localUsers.length > 0) {
          console.log('Encontrados usuarios en localStorage, iniciando migración...');
          
          for (const localUser of localUsers) {
            try {
              // Check if user already exists in Supabase
              const { data: existingProfile } = await supabase
                .from('profiles')
                .select('email')
                .eq('email', localUser.email)
                .single();
              
              if (!existingProfile) {
                console.log(`Migrando usuario: ${localUser.email}`);
                
                // Create user in Supabase
                const { data, error } = await supabase.auth.signUp({
                  email: localUser.email,
                  password: localUser.password, // In production, you'd generate a random password
                  options: {
                    emailRedirectTo: `${window.location.origin}/`,
                    data: {
                      name: localUser.name,
                      role: localUser.role
                    }
                  }
                });

                if (!error && data.user) {
                  // Create profile
                  await supabase
                    .from('profiles')
                    .insert({
                      id: data.user.id,
                      name: localUser.name,
                      email: localUser.email,
                      role: localUser.role,
                      assigned_machines: localUser.assignedMachines || null,
                      comision_por_hora: localUser.comisionPorHora || null,
                      comision_por_viaje: localUser.comisionPorViaje || null
                    });
                  
                  console.log(`Usuario migrado exitosamente: ${localUser.email}`);
                }
              }
            } catch (error) {
              console.error(`Error migrando usuario ${localUser.email}:`, error);
            }
          }
          
          // After successful migration, keep localStorage as backup but mark as migrated
          localStorage.setItem('usersMigrated', 'true');
          console.log('Migración de usuarios completada');
        }
      } catch (error) {
        console.error('Error durante la migración:', error);
      }
    };

    // Only run migration once
    const isMigrated = localStorage.getItem('usersMigrated');
    if (!isMigrated) {
      migrateLocalStorageUsers();
    }
  }, []);
};
