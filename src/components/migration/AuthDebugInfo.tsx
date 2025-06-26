
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface AuthDebugInfoProps {
  supabaseAuth: any;
  localAuth: any;
  hasUser: boolean;
  isLoading: boolean;
}

export const AuthDebugInfo: React.FC<AuthDebugInfoProps> = ({
  supabaseAuth,
  localAuth,
  hasUser,
  isLoading
}) => {
  if (!isLoading && !hasUser) {
    return (
      <div className="container mx-auto p-6">
        <Alert className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium">Debes iniciar sesión para acceder al panel de migración.</p>
              
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <p><strong>Estado detallado:</strong></p>
                <p>• Supabase autenticado: {supabaseAuth.isAuthenticated ? '✅ Sí' : '❌ No'}</p>
                <p>• Usuario Supabase: {supabaseAuth.user?.email || 'Ninguno'}</p>
                <p>• Usuario local: {localAuth.user?.email || 'Ninguno'}</p>
                <p>• Cargando Supabase: {supabaseAuth.loading ? 'Sí' : 'No'}</p>
                <p>• Cargando local: {localAuth.isLoading ? 'Sí' : 'No'}</p>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button asChild size="sm">
                  <a href="/login">Ir a Login</a>
                </Button>
                <Button variant="outline" asChild size="sm">
                  <a href="/dashboard">Volver al Dashboard</a>
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
};
