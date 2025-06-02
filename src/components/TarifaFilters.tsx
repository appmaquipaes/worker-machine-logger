
import React from 'react';
import { Label } from '@/components/ui/label';

interface TarifaFiltersProps {
  filtroTipo: 'todos' | 'transporte' | 'alquiler_maquina';
  onFiltroChange: (filtro: 'todos' | 'transporte' | 'alquiler_maquina') => void;
}

const TarifaFilters: React.FC<TarifaFiltersProps> = ({
  filtroTipo,
  onFiltroChange
}) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="filtro-tipo">Filtrar por tipo:</Label>
      <select
        id="filtro-tipo"
        value={filtroTipo}
        onChange={(e) => onFiltroChange(e.target.value as any)}
        className="p-2 border rounded-md text-sm"
      >
        <option value="todos">Todos</option>
        <option value="transporte">Transporte</option>
        <option value="alquiler_maquina">Alquiler Maquinaria</option>
      </select>
    </div>
  );
};

export default TarifaFilters;
