
import React from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Venta } from '@/models/Ventas';

interface VentasStatsProps {
  ventasFiltradas: Venta[];
  totalVentas: number;
}

const VentasStats: React.FC<VentasStatsProps> = ({ ventasFiltradas, totalVentas }) => {
  const esVentaAutomatica = (venta: Venta): boolean => {
    return venta.observaciones?.includes('Venta automática') || false;
  };

  const ventasAutomaticas = ventasFiltradas.filter(esVentaAutomatica);
  const ventasManuales = ventasFiltradas.filter(v => !esVentaAutomatica(v));
  
  const totalVentasAutomaticas = ventasAutomaticas.reduce((sum, v) => sum + v.total_venta, 0);
  const totalVentasManuales = ventasManuales.reduce((sum, v) => sum + v.total_venta, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6">
      <Card className="shadow-xs border border-muted bg-accent/40">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs">Total Ventas</CardDescription>
          <CardTitle className="text-2xl font-extrabold text-primary">{ventasFiltradas.length}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-xs border border-muted bg-accent/40">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs">Valor Total</CardDescription>
          <CardTitle className="text-2xl font-extrabold text-primary">${totalVentas.toLocaleString()}</CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-xs border border-muted bg-green-50 border-green-200">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs text-green-700">Ventas Automáticas</CardDescription>
          <CardTitle className="text-2xl font-extrabold text-green-600">
            {ventasAutomaticas.length}
          </CardTitle>
          <CardDescription className="text-xs text-green-600">
            ${totalVentasAutomaticas.toLocaleString()}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="shadow-xs border border-muted bg-blue-50 border-blue-200">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs text-blue-700">Ventas Manuales</CardDescription>
          <CardTitle className="text-2xl font-extrabold text-blue-600">
            {ventasManuales.length}
          </CardTitle>
          <CardDescription className="text-xs text-blue-600">
            ${totalVentasManuales.toLocaleString()}
          </CardDescription>
        </CardHeader>
      </Card>
      <Card className="shadow-xs border border-muted bg-accent/40">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs">Promedio por Venta</CardDescription>
          <CardTitle className="text-2xl font-extrabold text-primary">
            ${ventasFiltradas.length > 0 ? (totalVentas / ventasFiltradas.length).toLocaleString() : '0'}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-xs border border-muted bg-accent/40">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs">Clientes Únicos</CardDescription>
          <CardTitle className="text-2xl font-extrabold text-primary">
            {new Set(ventasFiltradas.map(v => v.cliente)).size}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="shadow-xs border border-muted bg-purple-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardDescription className="uppercase text-xs text-purple-700">% Automáticas</CardDescription>
          <CardTitle className="text-2xl font-extrabold text-purple-600">
            {ventasFiltradas.length > 0 ? Math.round((ventasAutomaticas.length / ventasFiltradas.length) * 100) : 0}%
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};

export default VentasStats;
