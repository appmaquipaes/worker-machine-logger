
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
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
          <CardDescription className="uppercase text-xs">Ventas Automáticas</CardDescription>
          <CardTitle className="text-2xl font-extrabold text-green-600">
            {ventasFiltradas.filter(esVentaAutomatica).length}
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
    </div>
  );
};

export default VentasStats;
