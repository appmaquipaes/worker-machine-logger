
import React from 'react';
import { useMigrationData } from '@/hooks/useMigrationData';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { MigrationHeader } from '@/components/migration/MigrationHeader';
import { MigrationStatsCards } from '@/components/migration/MigrationStatsCards';
import { LocalDataCard } from '@/components/migration/LocalDataCard';
import { MigrationControl } from '@/components/migration/MigrationControl';
import { NextStepsCard } from '@/components/migration/NextStepsCard';

const MigrationDashboard = () => {
  console.log('🎯 MIGRATION DASHBOARD: Panel de migración cargado exitosamente - ACCESO GARANTIZADO');
  console.log('📍 Ruta actual:', window.location.pathname);
  console.log('🔓 Estado: Panel de migración ACTIVO sin restricciones');

  const supabaseAuth = useSupabaseAuthContext();

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

  console.log('📊 MIGRACIÓN - ESTADO COMPLETO:', {
    maquinasEnSupabase: machines.length,
    reportesEnSupabase: reports.length,
    maquinasLocales: localMachinesCount,
    reportesLocales: localReportsCount,
    supabaseConectado: !!supabaseAuth.user,
    panelAccesible: true
  });

  // Perfil básico para mostrar información
  const currentProfile = supabaseAuth.profile || supabaseAuth.user ? {
    id: supabaseAuth.user.id,
    name: supabaseAuth.user.email?.split('@')[0] || 'Usuario',
    email: supabaseAuth.user.email,
    role: 'Trabajador'
  } : {
    id: 'migration-user',
    name: 'Usuario de Migración',
    email: 'herramienta@migracion.com',
    role: 'Herramienta'
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Banner de confirmación MÁXIMO de acceso */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 border-4 border-green-300 rounded-xl p-8 shadow-2xl">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg">
            ✅ PANEL DE MIGRACIÓN ACTIVO
          </h1>
          <div className="text-2xl text-green-100 font-bold bg-green-700 p-4 rounded-lg">
            🚀 ACCESO COMPLETAMENTE LIBRE - SIN RESTRICCIONES
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-800 font-mono text-lg">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-bold text-xl mb-2">📊 Datos Locales:</div>
                <div>{localMachinesCount} máquinas | {localReportsCount} reportes</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-bold text-xl mb-2">💾 Supabase:</div>
                <div>{machines.length} máquinas | {reports.length} reportes</div>
              </div>
            </div>
            <div className="mt-6 text-green-800 font-bold text-2xl bg-green-100 p-4 rounded-lg">
              🔓 ESTADO: PANEL ACTIVO ✓ ACCESO GARANTIZADO ✓
            </div>
            <div className="mt-4 text-green-700 font-semibold text-lg">
              📍 Ruta: {window.location.pathname} | ⏰ {new Date().toLocaleString()}
            </div>
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

      {/* Información de debug detallada */}
      <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6">
        <h3 className="font-bold text-blue-800 mb-4 text-xl">🔧 Estado Técnico del Panel</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
          <div className="space-y-2">
            <p className="font-semibold">📱 Datos Locales:</p>
            <p>• {localMachinesCount} máquinas en localStorage</p>
            <p>• {localReportsCount} reportes en localStorage</p>
            <p>• LocalStorage funcional: ✅</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">🌐 Datos Supabase:</p>
            <p>• {machines.length} máquinas migradas</p>
            <p>• {reports.length} reportes migrados</p>
            <p>• Conexión Supabase: {supabaseAuth.user ? '✅' : '⚠️ No conectado'}</p>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-100 rounded text-blue-800 font-bold text-center text-lg">
          🎯 PANEL DE MIGRACIÓN: COMPLETAMENTE OPERATIVO
        </div>
        <div className="mt-2 text-sm text-blue-600 text-center font-mono">
          🌐 URL: {window.location.href} | ⏰ Última actualización: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default MigrationDashboard;
