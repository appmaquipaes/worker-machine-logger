
import React from 'react';
import { useMigrationData } from '@/hooks/useMigrationData';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';
import { Navigate } from 'react-router-dom';

const MigrationDashboard = () => {
  const supabaseAuth = useSupabaseAuthContext();
  
  console.log('🎯 MIGRATION DASHBOARD: Verificando autenticación...');
  console.log('📊 Estado de autenticación:', {
    isAuthenticated: supabaseAuth.isAuthenticated,
    user: supabaseAuth.user,
    loading: supabaseAuth.loading
  });

  // Mostrar loading mientras se verifica la autenticación
  if (supabaseAuth.loading) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Verificando autenticación...</h2>
          <p className="text-blue-600">Por favor espera mientras verificamos tu sesión.</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!supabaseAuth.isAuthenticated || !supabaseAuth.user) {
    console.log('❌ MIGRATION DASHBOARD: Usuario no autenticado, redirigiendo al login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ MIGRATION DASHBOARD: Usuario autenticado correctamente');

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
    usuarioAutenticado: supabaseAuth.user?.email
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de confirmación de acceso autenticado */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
        <h1 className="text-green-800 font-bold text-3xl mb-3">
          ✅ Panel de Migración - Usuario Autenticado
        </h1>
        <p className="text-green-700 text-xl mb-3">
          🚀 Bienvenido {supabaseAuth.user.email} - Acceso autorizado
        </p>
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="text-green-800 font-mono text-sm">
            📈 Estado actual: {localMachinesCount} máquinas locales | {localReportsCount} reportes locales
          </div>
          <div className="text-green-800 font-mono text-sm">
            💾 Supabase: {machines.length} máquinas | {reports.length} reportes
          </div>
          <div className="text-green-800 font-mono text-sm font-bold">
            🔐 Usuario: {supabaseAuth.user.email} - Autenticado con Supabase
          </div>
        </div>
      </div>

      <MigrationHeader currentProfile={supabaseAuth.profile || { name: supabaseAuth.user.email, email: supabaseAuth.user.email }} />

      <MigrationStatsCards
        machines={machines}
        reports={reports}
        currentProfile={supabaseAuth.profile || { name: supabaseAuth.user.email, email: supabaseAuth.user.email }}
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

      {/* Debug info con información de autenticación real */}
      <div className="bg-green-50 border border-green-300 rounded p-4 text-sm">
        <h3 className="font-bold text-green-800 mb-2">🔧 Información de Debug - Autenticación Supabase</h3>
        <div className="text-green-700">
          <p>✅ Usuario autenticado: {supabaseAuth.user.email}</p>
          <p>📊 Datos locales: {localMachinesCount + localReportsCount} elementos</p>
          <p>🌐 Datos Supabase: {machines.length + reports.length} elementos</p>
          <p>🔐 Autenticación: Verificada con Supabase</p>
          <p>🔥 Timestamp: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
