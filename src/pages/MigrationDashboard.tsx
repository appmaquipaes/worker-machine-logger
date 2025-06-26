
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
  console.log('🔍 MIGRATION DEBUG:', {
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

  // ACCESO COMPLETAMENTE ABIERTO - Sin restricciones de autenticación
  const currentProfile = localAuth.user || supabaseAuth.profile || { 
    name: 'Usuario Anónimo', 
    email: 'migración@sistema.com',
    role: 'Migración'
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

  // Solo mostrar loading si hay problemas técnicos, no por autenticación
  if (supabaseAuth.loading && localAuth.isLoading) {
    console.log('🔄 Cargando contextos de autenticación...');
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Inicializando panel de migración...</p>
        </div>
      </div>
    );
  }

  // SIEMPRE mostrar el dashboard - Panel de migración sin restricciones
  console.log('✅ Panel de migración accesible - Mostrando dashboard');
  
  return (
    <div className="container mx-auto p-6 space-y-6">
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
