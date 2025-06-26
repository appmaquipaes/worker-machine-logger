
import React from 'react';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { useMigrationData } from '@/hooks/useMigrationData';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';

const MigrationDashboard = () => {
  const supabaseAuth = useSupabaseAuthContext();

  console.log('🚀 MIGRATION DASHBOARD: Iniciando panel de migración');
  console.log('📊 Estado Supabase:', {
    user: supabaseAuth.user?.email || 'No autenticado',
    loading: supabaseAuth.loading,
    isAuthenticated: supabaseAuth.isAuthenticated
  });

  // PERFIL FIJO para el panel de migración - NO requiere autenticación
  const currentProfile = { 
    name: 'Sistema de Migración', 
    email: 'migration@system.com',
    role: 'Sistema'
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
  } = useMigrationData(supabaseAuth);

  console.log('✅ RENDERIZANDO PANEL COMPLETO - Sin restricciones de autenticación');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de confirmación - SIEMPRE visible */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="text-green-800 font-semibold text-lg">
          ✅ Panel de Migración Activo
        </h2>
        <p className="text-green-700 text-sm mt-1">
          Acceso libre garantizado - No se requiere autenticación para migrar datos
        </p>
        <div className="text-xs text-green-600 mt-2 font-mono">
          Estado: Panel funcionando correctamente | Datos locales: {localMachinesCount} máquinas, {localReportsCount} reportes
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
    </div>
  );
};

export default MigrationDashboard;
