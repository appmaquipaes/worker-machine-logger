
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MovimientoInventario } from '@/types/inventario';
import { History } from 'lucide-react';

interface MovimientosInventarioTableContentProps {
  filteredMovimientos: MovimientoInventario[];
}

const MovimientosInventarioTableContent: React.FC<MovimientosInventarioTableContentProps> = ({
  filteredMovimientos
}) => {
  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return 'Entrada';
      case 'salida': return 'Salida';
      case 'desglose': return 'Desglose';
      case 'ajuste_manual': return 'Ajuste Manual';
      default: return tipo;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return 'bg-green-100 text-green-800';
      case 'salida': return 'bg-red-100 text-red-800';
      case 'desglose': return 'bg-yellow-100 text-yellow-800';
      case 'ajuste_manual': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (filteredMovimientos.length === 0) {
    return (
      <div className="text-center py-16 space-y-6">
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
          <History className="w-12 h-12 text-slate-400" />
        </div>
        <div className="space-y-2">
          <p className="text-xl font-semibold text-slate-600">No hay movimientos registrados</p>
          <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
            Los movimientos de inventario aparecerán aquí cuando se procesen reportes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-bold text-slate-700 h-14">Fecha</TableHead>
            <TableHead className="font-bold text-slate-700 h-14">Tipo</TableHead>
            <TableHead className="font-bold text-slate-700 h-14">Material</TableHead>
            <TableHead className="font-bold text-slate-700 h-14">Cantidad</TableHead>
            <TableHead className="font-bold text-slate-700 h-14">Stock Anterior</TableHead>
            <TableHead className="font-bold text-slate-700 h-14">Stock Posterior</TableHead>
            <TableHead className="font-bold text-slate-700 h-14">Origen/Destino</TableHead>
            <TableHead className="font-bold text-slate-700 h-14">Máquina</TableHead>
            <TableHead className="font-bold text-slate-700 h-14">Usuario</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMovimientos.map((movimiento) => (
            <TableRow 
              key={movimiento.id}
              className="hover:bg-blue-50/50 transition-colors duration-200"
            >
              <TableCell className="py-4">
                <div className="text-sm">
                  <div className="font-semibold text-slate-800">
                    {new Date(movimiento.fecha).toLocaleDateString()}
                  </div>
                  <div className="text-slate-500">
                    {new Date(movimiento.fecha).toLocaleTimeString()}
                  </div>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <Badge className={`${getTipoColor(movimiento.tipo)} border-0`}>
                  {getTipoLabel(movimiento.tipo)}
                </Badge>
              </TableCell>
              <TableCell className="font-semibold text-slate-800 py-4">
                {movimiento.material}
              </TableCell>
              <TableCell className="py-4">
                <span className={`font-bold ${
                  movimiento.tipo === 'entrada' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {movimiento.tipo === 'entrada' ? '+' : '-'}{movimiento.cantidad} m³
                </span>
              </TableCell>
              <TableCell className="py-4 text-slate-600">
                {movimiento.cantidadAnterior} m³
              </TableCell>
              <TableCell className="py-4">
                <span className="font-semibold text-blue-600">
                  {movimiento.cantidadPosterior} m³
                </span>
              </TableCell>
              <TableCell className="py-4 text-slate-600">
                {movimiento.origen || movimiento.destino || '-'}
              </TableCell>
              <TableCell className="py-4 text-slate-600">
                {movimiento.maquinaNombre || '-'}
              </TableCell>
              <TableCell className="py-4 text-slate-600">
                {movimiento.usuario || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MovimientosInventarioTableContent;
