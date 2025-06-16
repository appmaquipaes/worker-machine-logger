
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Package, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';

interface InventarioStatsProps {
  stats: {
    totalMateriales: number;
    materialesConStock: number;
    materialesSinStock: number;
    valorTotalInventario: number;
  };
}

const InventarioStats: React.FC<InventarioStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Materiales</p>
              <p className="text-3xl font-bold text-blue-700">{stats.totalMateriales}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-xl">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Con Stock</p>
              <p className="text-3xl font-bold text-green-700">{stats.materialesConStock}</p>
            </div>
            <div className="p-3 bg-green-200 rounded-xl">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">Sin Stock</p>
              <p className="text-3xl font-bold text-red-700">{stats.materialesSinStock}</p>
            </div>
            <div className="p-3 bg-red-200 rounded-xl">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Valor Total</p>
              <p className="text-3xl font-bold text-purple-700">${stats.valorTotalInventario.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-xl">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventarioStats;
