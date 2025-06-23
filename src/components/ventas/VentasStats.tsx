
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Package, Users } from 'lucide-react';
import { Venta } from '@/models/Ventas';

interface VentasStatsProps {
  ventasFiltradas: Venta[];
  totalVentas: number;
}

const VentasStats: React.FC<VentasStatsProps> = ({ ventasFiltradas, totalVentas }) => {
  const calcularEstadisticas = () => {
    const ventasAutomaticas = ventasFiltradas.filter(venta => 
      venta.observaciones?.includes('Venta automática')
    ).length;
    
    const ventasManuales = ventasFiltradas.length - ventasAutomaticas;
    
    const clientesUnicos = new Set(ventasFiltradas.map(venta => venta.cliente)).size;
    
    const promedioVenta = ventasFiltradas.length > 0 ? totalVentas / ventasFiltradas.length : 0;

    return {
      ventasAutomaticas,
      ventasManuales,
      clientesUnicos,
      promedioVenta
    };
  };

  const stats = calcularEstadisticas();

  const estadisticas = [
    {
      titulo: 'Total Ventas',
      valor: `$${totalVentas.toLocaleString()}`,
      icono: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      descripcion: `${ventasFiltradas.length} transacciones`
    },
    {
      titulo: 'Promedio por Venta',
      valor: `$${stats.promedioVenta.toLocaleString()}`,
      icono: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      descripcion: 'Valor promedio'
    },
    {
      titulo: 'Clientes Únicos',
      valor: stats.clientesUnicos.toString(),
      icono: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      descripcion: 'Clientes diferentes'
    },
    {
      titulo: 'Ventas Automáticas',
      valor: stats.ventasAutomaticas.toString(),
      icono: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      descripcion: `${stats.ventasManuales} manuales`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {estadisticas.map((stat, index) => {
        const IconComponent = stat.icono;
        return (
          <Card key={index} className="bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-slate-700">
                  {stat.titulo}
                </CardTitle>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <IconComponent className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className={`text-3xl font-bold ${stat.color}`}>
                  {stat.valor}
                </p>
                <p className="text-sm text-slate-500 font-medium">
                  {stat.descripcion}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default VentasStats;
