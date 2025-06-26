
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, FileText, Users } from 'lucide-react';

interface MigrationStatsCardsProps {
  machines: any[];
  reports: any[];
  currentProfile: any;
}

export const MigrationStatsCards: React.FC<MigrationStatsCardsProps> = ({
  machines,
  reports,
  currentProfile
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Máquinas en Supabase</CardTitle>
          <Truck className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{machines.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reportes en Supabase</CardTitle>
          <FileText className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reports.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuario Actual</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{currentProfile?.role || 'Usuario'}</div>
          <p className="text-xs text-gray-600">{currentProfile?.name || currentProfile?.email}</p>
        </CardContent>
      </Card>
    </div>
  );
};
