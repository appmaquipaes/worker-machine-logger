
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Database, Upload, CheckCircle2, AlertCircle, Users, Truck, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MigrationDashboard = () => {
  const supabaseAuth = useSupabaseAuthContext();
  const localAuth = useAuth();
  const [machines, setMachines] = useState([]);
  const [reports, setReports] = useState([]);
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStep, setMigrationStep] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);
  const [localMachinesCount, setLocalMachinesCount] = useState(0);
  const [localReportsCount, setLocalReportsCount] = useState(0);
  const [authLoading, setAuthLoading] = useState(true);

  // Debug: mostrar estados de autenticación
  console.log('Migration Auth Debug:', { 
    supabaseAuthenticated: supabaseAuth.isAuthenticated,
    supabaseUser: supabaseAuth.user?.email,
    localUser: localAuth.user?.email,
    supabaseLoading: supabaseAuth.loading,
    localLoading: localAuth.isLoading
  });

  // Determinar si el usuario está autenticado
  const isAuthenticated = supabaseAuth.isAuthenticated || !!localAuth.user;
  const currentUser = supabaseAuth.user || localAuth.user;
  const currentProfile = supabaseAuth.profile || localAuth.user;

  // Esperar a que termine la carga de autenticación
  useEffect(() => {
    const checkAuthLoading = () => {
      const stillLoading = supabaseAuth.loading || localAuth.isLoading;
      setAuthLoading(stillLoading);
    };
    
    checkAuthLoading();
  }, [supabaseAuth.loading, localAuth.isLoading]);

  // Cargar datos de localStorage
  useEffect(() => {
    const loadLocalData = () => {
      try {
        const localMachines = JSON.parse(localStorage.getItem('machines') || '[]');
        const localReports = JSON.parse(localStorage.getItem('reports') || '[]');
        setLocalMachinesCount(localMachines.length);
        setLocalReportsCount(localReports.length);
        console.log('Datos locales cargados - Máquinas:', localMachines.length, 'Reportes:', localReports.length);
      } catch (error) {
        console.error('Error cargando datos locales:', error);
        setLocalMachinesCount(0);
        setLocalReportsCount(0);
      }
    };

    loadLocalData();
  }, []);

  // Cargar datos de Supabase solo si está autenticado
  useEffect(() => {
    const loadSupabaseData = async () => {
      if (!supabaseAuth.isAuthenticated) return;
      
      try {
        console.log('Cargando datos de Supabase...');
        
        // Cargar máquinas
        const { data: machinesData, error: machinesError } = await supabase
          .from('machines')
          .select('*')
          .order('name');

        if (machinesError) {
          console.error('Error cargando máquinas:', machinesError);
        } else {
          setMachines(machinesData || []);
          console.log('Máquinas en Supabase:', machinesData?.length || 0);
        }

        // Cargar reportes
        const { data: reportsData, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (reportsError) {
          console.error('Error cargando reportes:', reportsError);
        } else {
          setReports(reportsData || []);
          console.log('Reportes en Supabase:', reportsData?.length || 0);
        }
      } catch (error) {
        console.error('Error general cargando datos de Supabase:', error);
      }
    };

    loadSupabaseData();
  }, [supabaseAuth.isAuthenticated]);

  const addMachine = async (machineData) => {
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

  const addReport = async (reportData) => {
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
      // Migrar máquinas
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

      // Migrar reportes
      setMigrationStep('Migrando reportes...');
      const localReports = JSON.parse(localStorage.getItem('reports') || '[]');
      console.log('Reportes locales encontrados:', localReports.length);
      
      for (let i = 0; i < localReports.length; i++) {
        const report = localReports[i];
        // Buscar máquina correspondiente
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
      
      // Recargar datos de Supabase
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

  // Mostrar loading mientras se verifica autenticación
  if (authLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Mostrar error de autenticación solo si no está cargando
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium">Debes iniciar sesión para acceder al panel de migración.</p>
              
              <div className="text-sm space-y-1">
                <p><strong>Estado de autenticación:</strong></p>
                <p>• Supabase: {supabaseAuth.isAuthenticated ? '✅ Conectado' : '❌ No conectado'}</p>
                <p>• Sistema local: {localAuth.user ? '✅ Conectado' : '❌ No conectado'}</p>
                <p>• Usuario actual: {currentUser?.email || 'Ninguno'}</p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm">
                  <a href="/login">Ir a Login</a>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <a href="/dashboard">Volver al Dashboard</a>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Database className="h-16 w-16 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold">Panel de Migración a Supabase</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Bienvenido al nuevo sistema con Supabase. Aquí puedes migrar tus datos existentes 
          desde localStorage a la base de datos de Supabase para mayor seguridad y persistencia.
        </p>
        {currentProfile && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Conectado como: <strong>{currentProfile.name}</strong> ({currentProfile.role})
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Máquinas en Supabase</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{machines.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reportes en Supabase</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuario Actual</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentProfile?.role}</div>
            <p className="text-xs text-gray-600">{currentProfile?.name}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos Locales Disponibles</CardTitle>
          <CardDescription>
            Datos encontrados en tu navegador listos para migrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Máquinas en localStorage:</span>
              <span className="text-blue-600 font-bold">{localMachinesCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Reportes en localStorage:</span>
              <span className="text-green-600 font-bold">{localReportsCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Migración de Datos
          </CardTitle>
          <CardDescription>
            Migra tus datos desde localStorage a Supabase para mayor seguridad y persistencia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!supabaseAuth.isAuthenticated && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Para migrar datos necesitas estar autenticado con Supabase. 
                <a href="/login" className="text-blue-600 hover:underline ml-1">
                  Inicia sesión aquí
                </a>
              </AlertDescription>
            </Alert>
          )}
          
          {isMigrating ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{migrationStep}</span>
              </div>
              <Progress value={migrationProgress} className="w-full" />
              <p className="text-sm text-gray-600">
                Progreso: {Math.round(migrationProgress)}%
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  La migración copiará todos tus datos de localStorage a Supabase. 
                  Este proceso no eliminará tus datos locales.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={migrateLocalStorageData} 
                className="w-full"
                size="lg"
                disabled={!supabaseAuth.isAuthenticated || (localMachinesCount === 0 && localReportsCount === 0)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Iniciar Migración ({localMachinesCount} máquinas, {localReportsCount} reportes)
              </Button>

              {localMachinesCount === 0 && localReportsCount === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No se encontraron datos para migrar en localStorage.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Pasos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Conectar con Supabase - ✅ Completado
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Crear tablas en la base de datos - ✅ Completado
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Implementar autenticación - ✅ Completado
            </li>
            <li className="flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              Migrar datos existentes - En proceso
            </li>
            <li className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-gray-400" />
              Actualizar toda la aplicación para usar Supabase
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationDashboard;
