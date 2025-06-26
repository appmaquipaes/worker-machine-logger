
import React from 'react';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { useAuth } from '@/context/AuthContext';
import { useMigrationData } from '@/hooks/useMigrationData';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';

const MigrationDashboard = () => {
  const supabaseAuth = useSupabaseAuthContext();
  const localAuth = useAuth();

  // Debug para identificar el problema
  console.log('🔍 MIGRATION DASHBOARD LOADING:', {
    // Estado de autenticación local
    localAuthUser: localAuth.user,
    localAuthUserExists: !!localAuth.user,
    localAuthLoading: localAuth.isLoading,
    
    // Estado de autenticación Supabase
    supabaseAuthUser: supabaseAuth.user,
    supabaseAuthUserExists: !!supabaseAuth.user,
    supabaseAuthLoading: supabaseAuth.loading,
    supabaseAuthAuthenticated: supabaseAuth.isAuthenticated,
    supabaseAuthProfile: supabaseAuth.profile,
    
    // Evaluaciones lógicas
    hasLocalUser: !!localAuth.user,
    hasSupabaseUser: !!supabaseAuth.user,
    hasAnyUser: !!(localAuth.user || supabaseAuth.user),
    isAnyLoading: supabaseAuth.loading || localAuth.isLoading
  });

  // PANEL DE MIGRACIÓN: ACCESO COMPLETAMENTE LIBRE
  // No hay restricciones de autenticación para el panel de migración
  const currentProfile = { 
    name: 'Panel de Migración', 
    email: 'acceso@libre.com',
    role: 'Sistema'
  };

  console.log('✅ MIGRATION DASHBOARD: Acceso libre garantizado');

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

  // El panel de migración NUNCA debe mostrar loading por autenticación
  // Solo por problemas técnicos reales
  const showTechnicalLoading = supabaseAuth.loading && localAuth.isLoading;
  
  if (showTechnicalLoading) {
    console.log('🔄 Cargando contextos técnicos...');
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Inicializando panel de migración...</p>
        </div>
      </div>
    );
  }

  // RENDERIZADO GARANTIZADO: El panel de migración siempre debe ser accesible
  console.log('🎯 RENDERIZANDO PANEL DE MIGRACIÓN - Acceso garantizado');
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="text-green-800 font-semibold">✅ Panel de Migración Activo</h2>
        <p className="text-green-700 text-sm">
          Acceso libre al panel de migración - No se requiere autenticación
        </p>
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
