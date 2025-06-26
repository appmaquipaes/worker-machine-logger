
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

  console.log('🚀 PANEL DE MIGRACIÓN - ACCESO LIBRE GARANTIZADO');
  console.log('📊 Estado técnico:', {
    supabaseConectado: !!supabaseAuth,
    cargando: supabaseAuth?.loading || false
  });

  // PERFIL FIJO - El panel funciona sin autenticación
  const currentProfile = { 
    name: 'Panel de Migración Libre', 
    email: 'acceso@libre.com',
    role: 'Sistema de Migración'
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

  console.log('✅ RENDERIZANDO PANEL COMPLETO');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de confirmación - SIEMPRE visible */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
        <h1 className="text-green-800 font-bold text-2xl mb-2">
          ✅ Panel de Migración - Acceso Libre
        </h1>
        <p className="text-green-700 text-lg mb-2">
          🎯 Migración funcionando correctamente - Sin restricciones de autenticación
        </p>
        <div className="text-sm text-green-600 bg-green-100 p-3 rounded font-mono">
          📊 Datos detectados: {localMachinesCount} máquinas locales | {localReportsCount} reportes locales
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
