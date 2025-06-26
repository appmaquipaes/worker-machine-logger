
import React from 'react';
import { useMigrationData } from '@/hooks/useMigrationData';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';

const MigrationDashboard = () => {
  console.log('🎯 MIGRATION DASHBOARD: Panel de migración COMPLETAMENTE LIBRE');
  console.log('✅ SIN RESTRICCIONES - Panel configurado para acceso libre');

  // CONFIGURACIÓN LIBRE - No requiere autenticación real de Supabase
  const mockSupabaseAuth = {
    user: { id: 'migration-free-user', email: 'libre@maquipaes.com' },
    profile: { name: 'Usuario Libre', email: 'libre@maquipaes.com', role: 'Migración' },
    loading: false,
    isAuthenticated: true, // SIEMPRE true para acceso libre
    isAdmin: false,
    signIn: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => {}
  };

  // PERFIL LIBRE - Funciona sin autenticación real
  const currentProfile = { 
    name: 'Usuario del Panel de Migración Libre', 
    email: 'migracion-libre@maquipaes.com',
    role: 'Acceso Libre para Migración'
  };

  const {
    machines,
    reports,
    migrationProgress,
    migrationStep,
    isMigrating,
    localMachinesCount,
    localReportsCount,
    migrateLocalStorageData
  } = useMigrationData(mockSupabaseAuth);

  console.log('📊 MIGRACIÓN LIBRE - DATOS:', {
    maquinasEnSupabase: machines.length,
    reportesEnSupabase: reports.length,
    maquinasLocales: localMachinesCount,
    reportesLocales: localReportsCount,
    accesoLibre: true
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de confirmación de ACCESO LIBRE */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
        <h1 className="text-green-800 font-bold text-3xl mb-3">
          ✅ Panel de Migración - ACCESO COMPLETAMENTE LIBRE
        </h1>
        <p className="text-green-700 text-xl mb-3">
          🚀 Sistema funcionando SIN restricciones de autenticación
        </p>
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="text-green-800 font-mono text-sm">
            📈 Estado actual: {localMachinesCount} máquinas locales | {localReportsCount} reportes locales
          </div>
          <div className="text-green-800 font-mono text-sm">
            💾 Supabase: {machines.length} máquinas | {reports.length} reportes
          </div>
          <div className="text-green-800 font-mono text-sm font-bold">
            🔓 ACCESO: Completamente libre - No requiere login
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
        supabaseAuth={mockSupabaseAuth}
        isMigrating={isMigrating}
        migrationStep={migrationStep}
        migrationProgress={migrationProgress}
        localMachinesCount={localMachinesCount}
        localReportsCount={localReportsCount}
        onMigrate={migrateLocalStorageData}
      />

      <NextStepsCard />

      {/* Debug info con confirmación de acceso libre */}
      <div className="bg-green-50 border border-green-300 rounded p-4 text-sm">
        <h3 className="font-bold text-green-800 mb-2">🔧 Información de Debug - ACCESO LIBRE</h3>
        <div className="text-green-700">
          <p>✅ Panel renderizado correctamente SIN autenticación</p>
          <p>📊 Datos locales: {localMachinesCount + localReportsCount} elementos</p>
          <p>🌐 Datos Supabase: {machines.length + reports.length} elementos</p>
          <p>🔓 Acceso: COMPLETAMENTE LIBRE</p>
          <p>🔥 Timestamp: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
