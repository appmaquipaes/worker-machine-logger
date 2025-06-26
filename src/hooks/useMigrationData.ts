
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMigrationData = (supabaseAuth: any) => {
  const [machines, setMachines] = useState([]);
  const [reports, setReports] = useState([]);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStep, setMigrationStep] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [localMachinesCount, setLocalMachinesCount] = useState(0);
  const [localReportsCount, setLocalReportsCount] = useState(0);

  useEffect(() => {
    const loadLocalData = () => {
      try {
        const localMachines = JSON.parse(localStorage.getItem('machines') || '[]');
        const localReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setLocalMachinesCount(localMachines.length);
        setLocalReportsCount(localReports.length);
        console.log('📊 Datos locales - Máquinas:', localMachines.length, 'Reportes:', localReports.length);
      } catch (error) {
        console.error('❌ Error cargando datos locales:', error);
        setLocalMachinesCount(0);
        setLocalReportsCount(0);
      }
    };

    loadLocalData();
  }, []);

  useEffect(() => {
    const loadSupabaseData = async () => {
      if (!supabaseAuth.isAuthenticated) {
        console.log('⏭️ Saltando carga de Supabase - no autenticado');
        return;
      }
      
      try {
        console.log('🔄 Cargando datos de Supabase...');
        
        const { data: machinesData, error: machinesError } = await supabase
          .from('machines')
          .select('*')
          .order('name');

        if (machinesError) {
          console.error('❌ Error cargando máquinas:', machinesError);
        } else {
          setMachines(machinesData || []);
          console.log('✅ Máquinas en Supabase:', machinesData?.length || 0);
        }

        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (reportsError) {
          console.error('❌ Error cargando reportes:', reportsError);
        } else {
          setReports(reportsData || []);
          console.log('✅ Reportes en Supabase:', reportsData?.length || 0);
        }
      } catch (error) {
        console.error('❌ Error general cargando datos de Supabase:', error);
      }
    };

    loadSupabaseData();
  }, [supabaseAuth.isAuthenticated]);

  const addMachine = async (machineData: any) => {
    try {
      const { data, error } = await supabase
        .from('machines')
        .insert([machineData])
        .select()
        .single();

      if (error) throw error;
      setMachines(prev => [...prev, data]);
      return data;
    } catch (error) {
      console.error('Error adding machine:', error);
      throw error;
    }
  };

  const addReport = async (reportData: any) => {
    try {
      const { data, error } = await supabase
        .from('reports')
        .insert([reportData])
        .select()
        .single();

      if (error) throw error;
      setReports(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  };

  const migrateLocalStorageData = async () => {
    if (!supabaseAuth.isAuthenticated || !supabaseAuth.profile) {
      toast.error('Debes estar autenticado con Supabase para migrar datos');
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);
    
    try {
      setMigrationStep('Migrando máquinas...');
      const localMachines = JSON.parse(localStorage.getItem('machines') || '[]');
      console.log('Máquinas locales encontradas:', localMachines.length);
      
      for (let i = 0; i < localMachines.length; i++) {
        const machine = localMachines[i];
        await addMachine({
          name: machine.name,
          type: machine.type,
          license_plate: machine.plate || '',
          brand: machine.brand || '',
          model: machine.model || '',
          year: machine.year || null,
          status: machine.status === 'Disponible' ? 'active' : 
                 machine.status === 'En Uso' ? 'active' : 'maintenance'
        });
        setMigrationProgress(((i + 1) / localMachines.length) * 50);
      }

      setMigrationStep('Migrando reportes...');
      const localReports = JSON.parse(localStorage.getItem('reports') || '[]');
      console.log('Reportes locales encontrados:', localReports.length);
      
      for (let i = 0; i < localReports.length; i++) {
        const report = localReports[i];
        const matchingMachine = machines.find(m => 
          m.name === report.machineName || 
          m.name.toLowerCase() === report.machineName?.toLowerCase()
        );
        
        await addReport({
          user_id: supabaseAuth.profile.id,
          machine_id: matchingMachine?.id || null,
          machine_name: report.machineName || '',
          user_name: report.userName || supabaseAuth.profile.name,
          report_type: report.reportType || '',
          description: report.description || '',
          report_date: report.reportDate ? new Date(report.reportDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          trips: report.trips || null,
          hours: report.hours || null,
          value: report.value || 0,
          work_site: report.workSite || '',
          origin: report.origin || '',
          destination: report.destination || '',
          cantidad_m3: report.cantidadM3 || null,
          proveedor: report.proveedor || '',
          kilometraje: report.kilometraje || null
        });
        setMigrationProgress(50 + ((i + 1) / localReports.length) * 50);
      }

      setMigrationStep('Migración completada');
      setMigrationProgress(100);
      toast.success('Migración completada exitosamente');
      
      const { data: updatedMachines } = await supabase.from('machines').select('*');
      const { data: updatedReports } = await supabase.from('reports').select('*');
      setMachines(updatedMachines || []);
      setReports(updatedReports || []);
      
    } catch (error) {
      console.error('Error en migración:', error);
      toast.error('Error durante la migración: ' + error.message);
    } finally {
      setIsMigrating(false);
    }
  };

  return {
    machines,
    reports,
    migrationProgress,
    migrationStep,
    isMigrating,
    localMachinesCount,
    localReportsCount,
    migrateLocalStorageData
  };
};
