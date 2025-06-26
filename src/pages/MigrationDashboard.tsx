
import React from 'react';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { useAuth } from '@/context/AuthContext';
import { useMigrationData } from '@/hooks/useMigrationData';
import { AuthDebugInfo } from '@/components/migration/AuthDebugInfo';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';

const MigrationDashboard = () => {
  const supabaseAuth = useSupabaseAuthContext();
  const localAuth = useAuth();

  // Debug: mostrar estados de autenticación
  console.log('🔍 Migration Auth Debug:', { 
    supabaseAuthenticated: supabaseAuth.isAuthenticated,
    supabaseUser: supabaseAuth.user?.email,
    supabaseLoading: supabaseAuth.loading,
    localUser: localAuth.user?.email,
    localLoading: localAuth.isLoading,
    hasAnyUser: !!(localAuth.user || supabaseAuth.user)
  });

  // SIMPLIFICAR: Si tenemos cualquier usuario (local o supabase), permitir acceso
  const hasUser = !!(localAuth.user || supabaseAuth.user);
  const isLoading = supabaseAuth.loading || localAuth.isLoading;
  const currentUser = localAuth.user || supabaseAuth.user;
  const currentProfile = localAuth.user || supabaseAuth.profile;

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

  // Mostrar loading solo si ambos sistemas están cargando
  if (isLoading && !hasUser) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Mostrar error de autenticación si es necesario
  if (!isLoading && !hasUser) {
    return (
      <AuthDebugInfo
        supabaseAuth={supabaseAuth}
        localAuth={localAuth}
        hasUser={hasUser}
        isLoading={isLoading}
      />
    );
  }

  // Usuario autenticado - mostrar panel
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
