
import React, { useEffect, useState } from 'react';
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
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Esperar a que la autenticación se inicialice completamente
  useEffect(() => {
    if (!supabaseAuth.loading) {
      setIsInitialized(true);
    }
  }, [supabaseAuth.loading]);

  console.log('🎯 MIGRATION DASHBOARD: Estado de autenticación completo:', {
    isAuthenticated: supabaseAuth.isAuthenticated,
    user: supabaseAuth.user,
    profile: supabaseAuth.profile,
    loading: supabaseAuth.loading,
    isInitialized,
    userEmail: supabaseAuth.user?.email
  });

  // Mostrar loading mientras se verifica la autenticación
  if (supabaseAuth.loading || !isInitialized) {
    console.log('⏳ MIGRATION DASHBOARD: Cargando autenticación...');
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-800 mb-2">Verificando autenticación...</h2>
          <p className="text-blue-600">Por favor espera mientras verificamos tu sesión de Supabase.</p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Verificar si hay usuario autenticado SOLO después de la inicialización
  if (isInitialized && !supabaseAuth.user) {
    console.log('❌ MIGRATION DASHBOARD: No hay usuario después de inicialización, redirigiendo al login');
    return (
      <div className="container mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-800 mb-2">Acceso Denegado</h2>
          <p className="text-red-600 mb-4">Debes iniciar sesión para acceder al panel de migración.</p>
          <p className="text-sm text-red-500">Redirigiendo al login...</p>
        </div>
      </div>
    );
  }

  // Si llegamos aquí, el usuario está autenticado
  console.log('✅ MIGRATION DASHBOARD: Usuario autenticado correctamente');
  console.log('👤 Usuario:', supabaseAuth.user?.email);

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

  // Crear perfil básico si no existe
  const currentProfile = supabaseAuth.profile || {
    id: supabaseAuth.user.id,
    name: supabaseAuth.user.email?.split('@')[0] || 'Usuario',
    email: supabaseAuth.user.email,
    role: 'Trabajador'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de confirmación de acceso */}
      <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6">
        <h1 className="text-green-800 font-bold text-3xl mb-3">
          ✅ Panel de Migración - Acceso Confirmado
        </h1>
        <p className="text-green-700 text-xl mb-3">
          🚀 Bienvenido {supabaseAuth.user.email} - Sesión Supabase Activa
        </p>
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="text-green-800 font-mono text-sm">
            📈 Datos locales: {localMachinesCount} máquinas | {localReportsCount} reportes
          </div>
          <div className="text-green-800 font-mono text-sm">
            💾 Supabase: {machines.length} máquinas | {reports.length} reportes
          </div>
          <div className="text-green-800 font-mono text-sm font-bold">
            🔐 Usuario: {supabaseAuth.user.email} - ✓ CONECTADO
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
        <h3 className="font-bold text-green-800 mb-2">🔧 Debug - Sesión Supabase</h3>
        <div className="text-green-700 space-y-1">
          <p>✅ Email: {supabaseAuth.user.email}</p>
          <p>🆔 ID: {supabaseAuth.user.id}</p>
          <p>📊 Datos locales: {localMachinesCount + localReportsCount} elementos</p>
          <p>🌐 Datos Supabase: {machines.length + reports.length} elementos</p>
          <p>🔐 Sesión: ACTIVA ✓</p>
          <p>⏰ Timestamp: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
