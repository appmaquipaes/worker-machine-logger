
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface MovimientosInventarioFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  tipoFilter: string;
  setTipoFilter: (value: string) => void;
  materialFilter: string;
  setMaterialFilter: (value: string) => void;
  materialesUnicos: string[];
  onClearFilters: () => void;
}

const MovimientosInventarioFilters: React.FC<MovimientosInventarioFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  tipoFilter,
  setTipoFilter,
  materialFilter,
  setMaterialFilter,
  materialesUnicos,
  onClearFilters
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <Input
          placeholder="Buscar movimientos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 border-slate-300 focus:border-blue-500"
        />
      </div>
      
      <Select value={tipoFilter} onValueChange={setTipoFilter}>
        <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-xl border border-slate-200 z-50">
          <SelectItem value="all">Todos los tipos</SelectItem>
          <SelectItem value="entrada">Entradas</SelectItem>
          <SelectItem value="salida">Salidas</SelectItem>
          <SelectItem value="desglose">Desgloses</SelectItem>
          <SelectItem value="ajuste_manual">Ajustes Manuales</SelectItem>
        </SelectContent>
      </Select>

      <Select value={materialFilter} onValueChange={setMaterialFilter}>
        <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
          <SelectValue placeholder="Filtrar por material" />
        </SelectTrigger>
        <SelectContent className="bg-white shadow-xl border border-slate-200 z-50">
          <SelectItem value="all">Todos los materiales</SelectItem>
          {materialesUnicos.map(material => (
            <SelectItem key={material} value={material}>
              {material}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={onClearFilters}
        className="h-12 border-slate-300 text-slate-700 hover:bg-slate-50"
      >
        <Filter className="h-4 w-4 mr-2" />
        Limpiar Filtros
      </Button>
    </div>
  );
};

export default MovimientosInventarioFilters;
