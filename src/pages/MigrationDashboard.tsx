
import React from 'react';
import { useMigrationData } from '@/hooks/useMigrationData';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';

const MigrationDashboard = () => {
  console.log('🎯 MIGRATION DASHBOARD: Cargando herramienta de migración - ACCESO LIBRE GARANTIZADO');

  const supabaseAuth = useSupabaseAuthContext();

  const {
    machines,
    reports,
    migrationProgress,
    migrationStep,
    isMigrating,
    localMachinesCount,
    localReportsCount,
    migrateLocalStorageData
  } = useMigrationData(supabaseAuth);

  console.log('📊 MIGRACIÓN - ESTADO:', {
    maquinasEnSupabase: machines.length,
    reportesEnSupabase: reports.length,
    maquinasLocales: localMachinesCount,
    reportesLocales: localReportsCount,
    supabaseConectado: !!supabaseAuth.user
  });

  // Perfil básico para mostrar información
  const currentProfile = supabaseAuth.profile || supabaseAuth.user ? {
    id: supabaseAuth.user.id,
    name: supabaseAuth.user.email?.split('@')[0] || 'Usuario',
    email: supabaseAuth.user.email,
    role: 'Trabajador'
  } : {
    id: 'migration-user',
    name: 'Usuario de Migración',
    email: 'herramienta@migracion.com',
    role: 'Herramienta'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de confirmación de acceso libre */}
      <div className="bg-green-100 border-4 border-green-400 rounded-xl p-8 shadow-lg">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-green-800">
            ✅ HERRAMIENTA DE MIGRACIÓN ACTIVA
          </h1>
          <div className="text-xl text-green-700 font-semibold">
            🚀 Acceso completamente libre - Sin restricciones de autenticación
          </div>
          <div className="bg-green-200 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-800 font-mono">
              <div>📊 Datos locales: {localMachinesCount} máquinas | {localReportsCount} reportes</div>
              <div>💾 Supabase: {machines.length} máquinas | {reports.length} reportes</div>
            </div>
            <div className="mt-2 text-green-800 font-bold text-lg">
              🔓 Estado: ACCESO GARANTIZADO - Herramienta independiente ✓
            </div>
          </div>
        </div>
      </div>

      <MigrationHeader currentProfile={currentProfile} />

      <MigrationStatsCards
        machines={machines}
        reports={reports}
        currentProfile={currentProfile}
      />

      <LocalDataCard
        localMachinesCount={localMachinesCount}
        localReportsCount={localReportsCount}
      />

      <MigrationControl
        supabaseAuth={supabaseAuth}
        isMigrating={isMigrating}
        migrationStep={migrationStep}
        migrationProgress={migrationProgress}
        localMachinesCount={localMachinesCount}
        localReportsCount={localReportsCount}
        onMigrate={migrateLocalStorageData}
      />

      <NextStepsCard />

      {/* Información de debug mejorada */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
        <h3 className="font-bold text-blue-800 mb-4 text-xl">🔧 Estado de la Herramienta de Migración</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
          <div className="space-y-2">
            <p className="font-semibold">📱 Datos Locales:</p>
            <p>• {localMachinesCount} máquinas en localStorage</p>
            <p>• {localReportsCount} reportes en localStorage</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">🌐 Datos Supabase:</p>
            <p>• {machines.length} máquinas migradas</p>
            <p>• {reports.length} reportes migrados</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 rounded text-blue-800 font-bold text-center">
          🎯 ACCESO: COMPLETAMENTE LIBRE - Esta es una herramienta de migración independiente
        </div>
        <div className="mt-2 text-sm text-blue-600 text-center">
          ⏰ Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
