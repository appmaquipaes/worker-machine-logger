
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface LocalDataCardProps {
  localMachinesCount: number;
  localReportsCount: number;
}

export const LocalDataCard: React.FC<LocalDataCardProps> = ({
  localMachinesCount,
  localReportsCount
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos Locales Disponibles</CardTitle>
        <CardDescription>
          Datos encontrados en tu navegador listos para migrar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="font-medium">Máquinas en localStorage:</span>
            <span className="text-blue-600 font-bold">{localMachinesCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Reportes en localStorage:</span>
            <span className="text-green-600 font-bold">{localReportsCount}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
