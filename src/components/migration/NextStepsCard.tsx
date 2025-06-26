
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Database, Upload } from 'lucide-react';

export const NextStepsCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Pasos</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Conectar con Supabase - ✅ Completado
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Crear tablas en la base de datos - ✅ Completado
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Implementar autenticación - ✅ Completado
          </li>
          <li className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-600" />
            Migrar datos existentes - En proceso
          </li>
          <li className="flex items-center gap-2">
            <Upload className="h-4 w-4 text-gray-400" />
            Actualizar toda la aplicación para usar Supabase
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};
