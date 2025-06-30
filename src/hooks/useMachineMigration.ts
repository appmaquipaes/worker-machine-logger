
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface LocalMachine {
  id: string;
  name: string;
  type: string;
  plate?: string;
  status: string;
}

interface SupabaseMachine {
  id: string;
  name: string;
  type: string;
  license_plate?: string;
  status: string;
  brand?: string;
  model?: string;
  year?: number;
}

export const useMachineMigration = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationComplete, setMigrationComplete] = useState(false);

  const migrateLocalMachinesToSupabase = async () => {
    console.log('🚀 Iniciando migración de máquinas a Supabase...');
    setIsMigrating(true);

    try {
      // Obtener máquinas de localStorage
      const localMachines: LocalMachine[] = JSON.parse(localStorage.getItem('machines') || '[]');
      console.log('📦 Máquinas en localStorage:', localMachines.length);

      if (localMachines.length === 0) {
        console.log('⚠️ No hay máquinas en localStorage para migrar');
        setMigrationComplete(true);
        return;
      }

      // Obtener máquinas existentes en Supabase
      const { data: existingMachines, error: fetchError } = await supabase
        .from('machines')
        .select('*');

      if (fetchError) {
        console.error('❌ Error obteniendo máquinas de Supabase:', fetchError);
        throw fetchError;
      }

      console.log('🗄️ Máquinas existentes en Supabase:', existingMachines?.length || 0);

      // Identificar máquinas que necesitan ser migradas
      const machinesToMigrate = localMachines.filter(localMachine => {
        const existsInSupabase = existingMachines?.some(supabaseMachine => 
          supabaseMachine.name === localMachine.name && 
          supabaseMachine.type === localMachine.type
        );
        return !existsInSupabase;
      });

      console.log('🔄 Máquinas a migrar:', machinesToMigrate.length);

      if (machinesToMigrate.length > 0) {
        // Convertir máquinas locales al formato de Supabase
        const supabaseMachines: Omit<SupabaseMachine, 'id'>[] = machinesToMigrate.map(machine => ({
          name: machine.name,
          type: machine.type,
          license_plate: machine.plate || null,
          status: machine.status === 'Disponible' ? 'active' : 'inactive',
          brand: null,
          model: null,
          year: null
        }));

        // Insertar máquinas en Supabase
        const { error: insertError } = await supabase
          .from('machines')
          .insert(supabaseMachines);

        if (insertError) {
          console.error('❌ Error insertando máquinas en Supabase:', insertError);
          throw insertError;
        }

        console.log('✅ Máquinas migradas exitosamente a Supabase');
        toast.success(`${machinesToMigrate.length} máquinas migradas a Supabase`);
      }

      // Marcar migración como completada
      localStorage.setItem('machines_migrated_to_supabase', 'true');
      setMigrationComplete(true);

    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      toast.error('Error durante la migración de máquinas');
    } finally {
      setIsMigrating(false);
    }
  };

  const syncMachinesFromSupabase = async () => {
    try {
      console.log('🔄 Sincronizando máquinas desde Supabase...');
      
      const { data: supabaseMachines, error } = await supabase
        .from('machines')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('❌ Error sincronizando desde Supabase:', error);
        return [];
      }

      // Convertir formato de Supabase al formato local
      const localFormatMachines: LocalMachine[] = supabaseMachines.map(machine => ({
        id: machine.id,
        name: machine.name,
        type: machine.type,
        plate: machine.license_plate || undefined,
        status: machine.status === 'active' ? 'Disponible' : 'Mantenimiento'
      }));

      console.log('✅ Máquinas sincronizadas desde Supabase:', localFormatMachines.length);
      
      // Actualizar localStorage con datos de Supabase
      localStorage.setItem('machines', JSON.stringify(localFormatMachines));
      
      return localFormatMachines;

    } catch (error) {
      console.error('❌ Error sincronizando máquinas:', error);
      return [];
    }
  };

  // Ejecutar migración automáticamente si no se ha hecho
  useEffect(() => {
    const migrationDone = localStorage.getItem('machines_migrated_to_supabase');
    if (!migrationDone) {
      migrateLocalMachinesToSupabase();
    } else {
      setMigrationComplete(true);
    }
  }, []);

  return {
    isMigrating,
    migrationComplete,
    migrateLocalMachinesToSupabase,
    syncMachinesFromSupabase
  };
};
