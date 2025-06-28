
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Database, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const MigrationAccess: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Verificar el estado de autenticación directamente con Supabase
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('MigrationAccess - Direct Supabase session:', session);
      console.log('MigrationAccess - Auth context user:', user);
      console.log('MigrationAccess - Auth context loading:', isLoading);
      setAuthChecked(true);
    };

    checkAuth();
  }, [user, isLoading]);

  console.log('MigrationAccess - Current user:', user);
  console.log('MigrationAccess - Loading state:', isLoading);
  console.log('MigrationAccess - User role:', user?.role);
  console.log('MigrationAccess - Auth checked:', authChecked);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-slate-600 font-medium">Verificando acceso...</p>
          <p className="text-xs text-slate-500">Cargando: {isLoading ? 'Sí' : 'No'} | Verificado: {authChecked ? 'Sí' : 'No'}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">Acceso Denegado</CardTitle>
            <CardDescription>
              Debes iniciar sesión para acceder al panel de migración
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-600 mb-4">
              Solo usuarios administradores pueden realizar migraciones
            </p>
            <a 
              href="/login" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar que el usuario tenga rol de Administrador
  if (user.role !== 'Administrador') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-xl">Permisos Insuficientes</CardTitle>
            <CardDescription>
              Solo administradores pueden acceder a la migración
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2 mb-4">
              <p className="text-sm text-slate-600">
                <strong>Usuario actual:</strong> {user.name}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Email:</strong> {user.email}
              </p>
              <p className="text-sm text-slate-600">
                <strong>Rol actual:</strong> {user.role}
              </p>
              <p className="text-sm text-red-600 font-medium">
                <strong>Rol requerido:</strong> Administrador
              </p>
            </div>
            <a 
              href="/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Volver al Dashboard
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Usuario autorizado (Administrador)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">Acceso Autorizado</CardTitle>
          <CardDescription>
            Panel de migración disponible
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="space-y-2 mb-4">
            <p className="text-sm text-slate-600">
              <strong>Bienvenido:</strong> {user.name}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Email:</strong> {user.email}
            </p>
            <p className="text-sm text-slate-600">
              <strong>Rol:</strong> {user.role}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
            <Database className="w-4 h-4" />
            <span className="text-sm font-medium">Listo para migrar datos</span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Tienes permisos de administrador para ejecutar la migración de datos desde localStorage a Supabase.
          </p>
          
          {/* Información adicional de debug */}
          <div className="mt-4 p-3 bg-slate-50 rounded-lg text-left">
            <p className="text-xs text-slate-600 font-medium mb-1">Estado de autenticación:</p>
            <p className="text-xs text-slate-500">✅ Usuario autenticado</p>
            <p className="text-xs text-slate-500">✅ Rol: {user.role}</p>
            <p className="text-xs text-slate-500">✅ ID: {user.id}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MigrationAccess;
