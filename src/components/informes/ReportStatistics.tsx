
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Statistics {
  totalReports: number;
  totalHours: number;
  totalTrips: number;
  totalValue: number;
  totalCommission: number;
  uniqueMachines: number;
  uniqueClientes: number;
}

interface ReportStatisticsProps {
  stats: Statistics | null;
}

const ReportStatistics: React.FC<ReportStatisticsProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <Card className="corporate-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalReports}</div>
          <div className="text-sm text-slate-600 font-medium">Total Reportes</div>
        </CardContent>
      </Card>
      <Card className="corporate-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{stats.totalHours}</div>
          <div className="text-sm text-slate-600 font-medium">Total Horas</div>
        </CardContent>
      </Card>
      <Card className="corporate-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">{stats.totalTrips}</div>
          <div className="text-sm text-slate-600 font-medium">Total Viajes</div>
        </CardContent>
      </Card>
      <Card className="corporate-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-amber-600 mb-1">${stats.totalValue.toLocaleString()}</div>
          <div className="text-sm text-slate-600 font-medium">Valor Total</div>
        </CardContent>
      </Card>
      <Card className="corporate-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">${stats.totalCommission.toLocaleString()}</div>
          <div className="text-sm text-slate-600 font-medium">Comisiones</div>
        </CardContent>
      </Card>
      <Card className="corporate-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.uniqueMachines}</div>
          <div className="text-sm text-slate-600 font-medium">Máquinas</div>
        </CardContent>
      </Card>
      <Card className="corporate-card">
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-teal-600 mb-1">{stats.uniqueClientes}</div>
          <div className="text-sm text-slate-600 font-medium">Clientes</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportStatistics;
