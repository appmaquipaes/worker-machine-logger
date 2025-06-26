
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, AlertCircle, CheckCircle2 } from 'lucide-react';

interface MigrationControlProps {
  supabaseAuth: any;
  isMigrating: boolean;
  migrationStep: string;
  migrationProgress: number;
  localMachinesCount: number;
  localReportsCount: number;
  onMigrate: () => void;
}

export const MigrationControl: React.FC<MigrationControlProps> = ({
  supabaseAuth,
  isMigrating,
  migrationStep,
  migrationProgress,
  localMachinesCount,
  localReportsCount,
  onMigrate
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Migración de Datos
        </CardTitle>
        <CardDescription>
          Migra tus datos desde localStorage a Supabase para mayor seguridad y persistencia.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!supabaseAuth.isAuthenticated && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Para migrar datos necesitas estar autenticado con Supabase. 
              <a href="/login" className="text-blue-600 hover:underline ml-1">
                Inicia sesión aquí
              </a>
            </AlertDescription>
          </Alert>
        )}
        
        {isMigrating ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{migrationStep}</span>
            </div>
            <Progress value={migrationProgress} className="w-full" />
            <p className="text-sm text-gray-600">
              Progreso: {Math.round(migrationProgress)}%
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                La migración copiará todos tus datos de localStorage a Supabase. 
                Este proceso no eliminará tus datos locales.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={onMigrate} 
              className="w-full"
              size="lg"
              disabled={!supabaseAuth.isAuthenticated || (localMachinesCount === 0 && localReportsCount === 0)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Iniciar Migración ({localMachinesCount} máquinas, {localReportsCount} reportes)
            </Button>

            {localMachinesCount === 0 && localReportsCount === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No se encontraron datos para migrar en localStorage.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
