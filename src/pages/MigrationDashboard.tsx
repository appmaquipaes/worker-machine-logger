
import React from 'react';
import { useMigrationData } from '@/hooks/useMigrationData';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';

const MigrationDashboard = () => {
  console.log('🎯 MIGRATION DASHBOARD: Renderizando panel de migración LIBRE');
  console.log('✅ SIN AUTENTICACIÓN - Panel completamente libre');
  console.log('🔥 CONFIRMACIÓN: El MigrationDashboard se está ejecutando');

  // MOCK de supabaseAuth para evitar dependencias
  const mockSupabaseAuth = {
    user: null,
    profile: null,
    loading: false,
    isAuthenticated: true, // Cambiar a true para que funcione el botón de migración
    isAdmin: false,
    signIn: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => {}
  };

  // PERFIL FIJO - Funciona sin autenticación real
  const currentProfile = { 
    name: 'Usuario del Panel de Migración', 
    email: 'migracion@maquipaes.com',
    role: 'Sistema de Migración Libre'
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

  console.log('📊 DATOS DE MIGRACIÓN:', {
    maquinasEnSupabase: machines.length,
    reportesEnSupabase: reports.length,
    maquinasLocales: localMachinesCount,
    reportesLocales: localReportsCount
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de confirmación SIEMPRE visible */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
        <h1 className="text-green-800 font-bold text-3xl mb-3">
          ✅ Panel de Migración - Acceso Completamente Libre
        </h1>
        <p className="text-green-700 text-xl mb-3">
          🚀 Sistema funcionando sin restricciones de autenticación
        </p>
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="text-green-800 font-mono text-sm">
            📈 Estado actual: {localMachinesCount} máquinas locales | {localReportsCount} reportes locales
          </div>
          <div className="text-green-800 font-mono text-sm">
            💾 Supabase: {machines.length} máquinas | {reports.length} reportes
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

      {/* Debug info */}
      <div className="bg-yellow-50 border border-yellow-300 rounded p-4 text-sm">
        <h3 className="font-bold text-yellow-800 mb-2">🔧 Información de Debug</h3>
        <div className="text-yellow-700">
          <p>✅ Panel renderizado correctamente</p>
          <p>📊 Datos locales: {localMachinesCount + localReportsCount} elementos</p>
          <p>🌐 Datos Supabase: {machines.length + reports.length} elementos</p>
          <p>🔥 Timestamp: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
