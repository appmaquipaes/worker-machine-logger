
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle2 } from 'lucide-react';

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
  console.log('🎛️ MIGRATION CONTROL: Datos recibidos:', {
    userEmail: supabaseAuth?.user?.email,
    isAuthenticated: supabaseAuth?.isAuthenticated,
    localData: { machines: localMachinesCount, reports: localReportsCount }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Migración de Datos a Supabase
        </CardTitle>
        <CardDescription>
          Migra tus datos desde localStorage a Supabase
          {supabaseAuth?.user?.email && ` - Usuario: ${supabaseAuth.user.email}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            ✅ Conexión verificada con Supabase
            {supabaseAuth?.user?.email && ` como ${supabaseAuth.user.email}`}.
            La migración transferirá todos tus datos de localStorage a la base de datos de Supabase.
          </AlertDescription>
        </Alert>
        
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
            <Button 
              onClick={onMigrate} 
              className="w-full"
              size="lg"
              disabled={localMachinesCount === 0 && localReportsCount === 0}
            >
              <Upload className="h-4 w-4 mr-2" />
              Iniciar Migración ({localMachinesCount} máquinas, {localReportsCount} reportes)
            </Button>

            {localMachinesCount === 0 && localReportsCount === 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
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
