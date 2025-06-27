
import React from 'react';
import { useMigrationData } from '@/hooks/useMigrationData';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';

const MigrationDashboard = () => {
  const supabaseAuth = useSupabaseAuthContext();

  console.log('🎯 MIGRATION DASHBOARD: Estado de autenticación completo:', {
    isAuthenticated: supabaseAuth.isAuthenticated,
    user: supabaseAuth.user,
    profile: supabaseAuth.profile,
    loading: supabaseAuth.loading,
    userEmail: supabaseAuth.user?.email
  });

  // La página de migración debe ser accesible siempre - es una herramienta de migración
  console.log('✅ MIGRATION DASHBOARD: Acceso garantizado - Herramienta de migración');

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

  console.log('📊 MIGRACIÓN - DATOS:', {
    maquinasEnSupabase: machines.length,
    reportesEnSupabase: reports.length,
    maquinasLocales: localMachinesCount,
    reportesLocales: localReportsCount,
    estadoSupabase: supabaseAuth.user ? `Conectado como ${supabaseAuth.user.email}` : 'No conectado a Supabase'
  });

  // Crear perfil básico independientemente del estado de Supabase
  const currentProfile = supabaseAuth.profile || supabaseAuth.user ? {
    id: supabaseAuth.user.id,
    name: supabaseAuth.user.email?.split('@')[0] || 'Usuario',
    email: supabaseAuth.user.email,
    role: 'Trabajador'
  } : {
    id: 'migration-user',
    name: 'Usuario de Migración',
    email: 'migracion@maquipaes.com',
    role: 'Trabajador'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de acceso garantizado */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
        <h1 className="text-green-800 font-bold text-3xl mb-3">
          ✅ Panel de Migración - Acceso Garantizado
        </h1>
        <p className="text-green-700 text-xl mb-3">
          🚀 Herramienta de Migración Activa - Sin Restricciones de Acceso
        </p>
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="text-green-800 font-mono text-sm">
            📈 Datos locales: {localMachinesCount} máquinas | {localReportsCount} reportes
          </div>
          <div className="text-green-800 font-mono text-sm">
            💾 Supabase: {machines.length} máquinas | {reports.length} reportes
          </div>
          <div className="text-green-800 font-mono text-sm font-bold">
            🔐 Estado: {supabaseAuth.user ? `Conectado como ${supabaseAuth.user.email}` : 'Herramienta independiente'} ✓
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

      {/* Debug info actualizada */}
      <div className="bg-green-50 border border-green-300 rounded p-4 text-sm">
        <h3 className="font-bold text-green-800 mb-2">🔧 Debug - Estado de Migración</h3>
        <div className="text-green-700 space-y-1">
          <p>📊 Datos locales: {localMachinesCount + localReportsCount} elementos</p>
          <p>🌐 Datos Supabase: {machines.length + reports.length} elementos</p>
          <p>🔐 Supabase: {supabaseAuth.user ? `✓ ${supabaseAuth.user.email}` : '⚠️ No conectado'}</p>
          <p>🎯 Acceso: GARANTIZADO (Herramienta de migración)</p>
          <p>⏰ Timestamp: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
