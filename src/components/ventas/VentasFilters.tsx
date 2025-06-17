
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, Download, Users, MapPin } from 'lucide-react';
import { tiposVenta, formasPago } from '@/models/Ventas';

interface VentasFiltersProps {
  filtroCliente: string;
  setFiltroCliente: (value: string) => void;
  filtroFinca: string;
  setFiltroFinca: (value: string) => void;
  filtroTipoVenta: string;
  setFiltroTipoVenta: (value: string) => void;
  filtroFormaPago: string;
  setFiltroFormaPago: (value: string) => void;
  filtroFechaInicio: string;
  setFiltroFechaInicio: (value: string) => void;
  filtroFechaFin: string;
  setFiltroFechaFin: (value: string) => void;
  clientes: any[];
  fincas: any[];
  onLimpiarFiltros: () => void;
  onExportToExcel: () => void;
  totalFiltrado: number;
}

const VentasFilters: React.FC<VentasFiltersProps> = ({
  filtroCliente,
  setFiltroCliente,
  filtroFinca,
  setFiltroFinca,
  filtroTipoVenta,
  setFiltroTipoVenta,
  filtroFormaPago,
  setFiltroFormaPago,
  filtroFechaInicio,
  setFiltroFechaInicio,
  filtroFechaFin,
  setFiltroFechaFin,
  clientes,
  fincas,
  onLimpiarFiltros,
  onExportToExcel,
  totalFiltrado
}) => {
  return (
    <Card className="mb-6 shadow-xs border border-muted">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filtros de Búsqueda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Cliente */}
          <div>
            <Label className="flex items-center gap-1 text-xs mb-1">
              <Users size={15} /> Cliente
            </Label>
            <Select onValueChange={setFiltroCliente} value={filtroCliente}>
              <SelectTrigger className="bg-white border hover:bg-accent shadow-sm transition">
                <SelectValue placeholder="Todos los clientes" />
              </SelectTrigger>
              <SelectContent className="z-[51]">
                <SelectItem value="all">Todos los clientes</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.nombre_cliente}>
                    {cliente.nombre_cliente}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Finca */}
          <div>
            <Label className="flex items-center gap-1 text-xs mb-1">
              <MapPin size={15} /> Finca
            </Label>
            <Select 
              onValueChange={setFiltroFinca} 
              value={filtroFinca}
              disabled={filtroCliente === 'all' || fincas.length === 0}
            >
              <SelectTrigger className="bg-white border hover:bg-accent shadow-sm transition">
                <SelectValue placeholder={
                  filtroCliente === 'all' 
                    ? "Primero seleccione un cliente" 
                    : fincas.length === 0 
                      ? "El cliente no tiene fincas"
                      : "Todas las fincas"
                } />
              </SelectTrigger>
              <SelectContent className="z-[51]">
                <SelectItem value="all">Todas las fincas</SelectItem>
                {fincas.map((finca) => (
                  <SelectItem key={finca.id} value={finca.nombre_finca}>
                    {finca.nombre_finca} - {finca.ciudad}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tipo de Venta */}
          <div>
            <Label className="text-xs mb-1">Tipo de Venta</Label>
            <Select onValueChange={setFiltroTipoVenta} value={filtroTipoVenta}>
              <SelectTrigger className="bg-white border hover:bg-accent shadow-sm transition">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent className="z-[51]">
                <SelectItem value="all">Todos los tipos</SelectItem>
                {tiposVenta.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Forma de Pago */}
          <div>
            <Label className="text-xs mb-1">Forma de Pago</Label>
            <Select onValueChange={setFiltroFormaPago} value={filtroFormaPago}>
              <SelectTrigger className="bg-white border hover:bg-accent shadow-sm transition">
                <SelectValue placeholder="Todas las formas" />
              </SelectTrigger>
              <SelectContent className="z-[51]">
                <SelectItem value="all">Todas las formas</SelectItem>
                {formasPago.map((forma) => (
                  <SelectItem key={forma} value={forma}>
                    {forma}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Fecha Inicio */}
          <div>
            <Label className="text-xs mb-1">Fecha Inicio</Label>
            <Input
              id="fecha-inicio"
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
              className="bg-white border hover:bg-accent shadow-sm transition"
            />
          </div>
          
          {/* Fecha Fin */}
          <div>
            <Label className="text-xs mb-1">Fecha Fin</Label>
            <Input
              id="fecha-fin"
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
              className="bg-white border hover:bg-accent shadow-sm transition"
            />
          </div>
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-5 gap-4">
          <Button 
            variant="ghost"
            className="text-sm bg-accent/70 hover:bg-accent transition"
            onClick={onLimpiarFiltros}
          >
            Limpiar Filtros
          </Button>
          <div className="flex gap-2 items-center">
            <Button onClick={onExportToExcel} variant="outline" className="flex items-center gap-2 transition" size="sm">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
            <div className="text-sm md:text-base font-semibold whitespace-nowrap">
              Total Filtrado: <span className="text-primary">${totalFiltrado.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VentasFilters;
