
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
    console.log('🔄 MIGRATION HOOK: Cargando datos locales...');
    const loadLocalData = () => {
      try {
        const localMachines = JSON.parse(localStorage.getItem('machines') || '[]');
        const localReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setLocalMachinesCount(localMachines.length);
        setLocalReportsCount(localReports.length);
        console.log('✅ MIGRATION HOOK: Datos locales cargados - Máquinas:', localMachines.length, 'Reportes:', localReports.length);
      } catch (error) {
        console.error('❌ MIGRATION HOOK: Error cargando datos locales:', error);
        setLocalMachinesCount(0);
        setLocalReportsCount(0);
      }
    };

    loadLocalData();
  }, []);

  useEffect(() => {
    console.log('🔄 MIGRATION HOOK: Intentando cargar datos de Supabase...');
    const loadSupabaseData = async () => {
      try {
        console.log('📡 MIGRATION HOOK: Haciendo peticiones a Supabase...');
        
        const { data: machinesData, error: machinesError } = await supabase
          .from('machines')
          .select('*')
          .order('name');

        if (machinesError) {
          console.error('❌ MIGRATION HOOK: Error cargando máquinas:', machinesError);
        } else {
          setMachines(machinesData || []);
          console.log('✅ MIGRATION HOOK: Máquinas en Supabase:', machinesData?.length || 0);
        }

        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (reportsError) {
          console.error('❌ MIGRATION HOOK: Error cargando reportes:', reportsError);
        } else {
          setReports(reportsData || []);
          console.log('✅ MIGRATION HOOK: Reportes en Supabase:', reportsData?.length || 0);
        }
      } catch (error) {
        console.error('❌ MIGRATION HOOK: Error general cargando datos de Supabase:', error);
      }
    };

    loadSupabaseData();
  }, []);

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
    console.log('🚀 MIGRATION HOOK: Iniciando migración...');
    
    // Simulación de autenticación para migración
    const mockProfile = {
      id: 'migration-user',
      name: 'Usuario de Migración',
      email: 'migracion@maquipaes.com'
    };

    setIsMigrating(true);
    setMigrationProgress(0);
    
    try {
      setMigrationStep('Preparando migración...');
      console.log('📝 MIGRATION HOOK: Preparando datos para migración');
      
      setMigrationStep('Migrando máquinas...');
      const localMachines = JSON.parse(localStorage.getItem('machines') || '[]');
      console.log('🚚 MIGRATION HOOK: Máquinas locales encontradas:', localMachines.length);
      
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
      console.log('📊 MIGRATION HOOK: Reportes locales encontrados:', localReports.length);
      
      for (let i = 0; i < localReports.length; i++) {
        const report = localReports[i];
        const matchingMachine = machines.find(m => 
          m.name === report.machineName || 
          m.name.toLowerCase() === report.machineName?.toLowerCase()
        );
        
        await addReport({
          user_id: mockProfile.id,
          machine_id: matchingMachine?.id || null,
          machine_name: report.machineName || '',
          user_name: report.userName || mockProfile.name,
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

      setMigrationStep('Migración completada exitosamente');
      setMigrationProgress(100);
      console.log('✅ MIGRATION HOOK: Migración completada');
      toast.success('Migración completada exitosamente');
      
      // Recargar datos
      const { data: updatedMachines } = await supabase.from('machines').select('*');
      const { data: updatedReports } = await supabase.from('reports').select('*');
      setMachines(updatedMachines || []);
      setReports(updatedReports || []);
      
    } catch (error) {
      console.error('❌ MIGRATION HOOK: Error en migración:', error);
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
