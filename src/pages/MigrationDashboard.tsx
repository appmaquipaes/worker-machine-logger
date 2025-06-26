
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { useSupabaseMachines } from '@/hooks/useSupabaseMachines';
import { useSupabaseReports } from '@/hooks/useSupabaseReports';
import { toast } from 'sonner';
import { Database, Upload, CheckCircle2, AlertCircle, Users, Truck, FileText } from 'lucide-react';

const MigrationDashboard = () => {
  const { isAuthenticated, profile } = useSupabaseAuthContext();
  const { machines, addMachine } = useSupabaseMachines();
  const { reports, addReport } = useSupabaseReports();
  const [migrationProgress, setMigrationProgress] = useState(0);
  const [migrationStep, setMigrationStep] = useState('');
  const [isMigrating, setIsMigrating] = useState(false);

  const migrateLocalStorageData = async () => {
    setIsMigrating(true);
    setMigrationProgress(0);
    
    try {
      // Migrar máquinas
      setMigrationStep('Migrando máquinas...');
      const localMachines = JSON.parse(localStorage.getItem('machines') || '[]');
      
      for (let i = 0; i < localMachines.length; i++) {
        const machine = localMachines[i];
        await addMachine({
          name: machine.name,
          type: machine.type,
          license_plate: machine.plate,
          brand: machine.brand || '',
          model: machine.model || '',
          year: machine.year || null,
          status: machine.status === 'Disponible' ? 'active' : 
                 machine.status === 'En Uso' ? 'active' : 'maintenance'
        });
        setMigrationProgress(((i + 1) / localMachines.length) * 30);
      }

      // Migrar reportes
      setMigrationStep('Migrando reportes...');
      const localReports = JSON.parse(localStorage.getItem('reports') || '[]');
      
      for (let i = 0; i < localReports.length; i++) {
        const report = localReports[i];
        if (profile) {
          await addReport({
            user_id: profile.id,
            machine_id: machines.find(m => m.name === report.machineName)?.id || '',
            machine_name: report.machineName,
            user_name: report.userName,
            report_type: report.reportType,
            description: report.description,
            report_date: new Date(report.reportDate).toISOString().split('T')[0],
            trips: report.trips,
            hours: report.hours,
            value: report.value,
            work_site: report.workSite,
            origin: report.origin,
            destination: report.destination,
            cantidad_m3: report.cantidadM3,
            proveedor: report.proveedor,
            kilometraje: report.kilometraje
          });
        }
        setMigrationProgress(30 + ((i + 1) / localReports.length) * 70);
      }

      setMigrationStep('Migración completada');
      setMigrationProgress(100);
      toast.success('Migración completada exitosamente');
      
    } catch (error) {
      console.error('Error en migración:', error);
      toast.error('Error durante la migración');
    } finally {
      setIsMigrating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Debes iniciar sesión para acceder al panel de migración.
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
            <div className="text-2xl font-bold">{profile?.role}</div>
            <p className="text-xs text-gray-600">{profile?.name}</p>
          </CardContent>
        </Card>
      </div>

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
              >
                <Upload className="h-4 w-4 mr-2" />
                Iniciar Migración
              </Button>
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
