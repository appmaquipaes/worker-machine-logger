
import React from 'react';
import { MovimientoInventario } from '@/types/inventario';

interface MovimientosInventarioStatsProps {
  filteredMovimientos: MovimientoInventario[];
}

const MovimientosInventarioStats: React.FC<MovimientosInventarioStatsProps> = ({
  filteredMovimientos
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
        <div className="text-green-600 text-sm font-medium">Total Entradas</div>
        <div className="text-2xl font-bold text-green-700">
          {filteredMovimientos.filter(mov => mov.tipo === 'entrada').length}
        </div>
      </div>
      <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl border border-red-200">
        <div className="text-red-600 text-sm font-medium">Total Salidas</div>
        <div className="text-2xl font-bold text-red-700">
          {filteredMovimientos.filter(mov => mov.tipo === 'salida').length}
        </div>
      </div>
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
        <div className="text-blue-600 text-sm font-medium">Total Movimientos</div>
        <div className="text-2xl font-bold text-blue-700">
          {filteredMovimientos.length}
        </div>
      </div>
    </div>
  );
};

export default MovimientosInventarioStats;
