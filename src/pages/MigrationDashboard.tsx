
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

  // Debug exhaustivo para identificar el problema
  console.log('🔍 MIGRATION DEBUG COMPLETO:', {
    // Estado de autenticación local
    localAuthUser: localAuth.user,
    localAuthUserExists: !!localAuth.user,
    localAuthLoading: localAuth.isLoading,
    localAuthUserName: localAuth.user?.name,
    localAuthUserEmail: localAuth.user?.email,
    localAuthUserRole: localAuth.user?.role,
    
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
    isAnyLoading: supabaseAuth.loading || localAuth.isLoading,
    
    // Condiciones de acceso
    shouldShowLoading: (supabaseAuth.loading || localAuth.isLoading) && !(localAuth.user || supabaseAuth.user),
    shouldShowError: !(localAuth.user || supabaseAuth.user) && !supabaseAuth.loading && !localAuth.isLoading,
    shouldShowDashboard: !!(localAuth.user || supabaseAuth.user)
  });

  // LÓGICA SIMPLIFICADA: Solo verificar si hay usuario local
  const hasUser = !!localAuth.user;
  const isLoading = localAuth.isLoading; // Solo verificar loading local
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

  // Si está cargando Y no hay usuario local, mostrar loading
  if (isLoading && !hasUser) {
    console.log('🔄 Mostrando loading porque isLoading=true y hasUser=false');
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si NO hay usuario local y NO está cargando, mostrar error
  if (!hasUser && !isLoading) {
    console.log('❌ Mostrando error porque hasUser=false y isLoading=false');
    return (
      <AuthDebugInfo
        supabaseAuth={supabaseAuth}
        localAuth={localAuth}
        hasUser={hasUser}
        isLoading={isLoading}
      />
    );
  }

  // Si llegamos aquí, hay un usuario local autenticado - mostrar panel
  console.log('✅ Mostrando dashboard porque hasUser=true');
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
