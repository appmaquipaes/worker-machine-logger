
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInventarioMovimientos } from '@/hooks/useInventarioMovimientos';
import { MovimientoInventario } from '@/types/inventario';
import { Download, Search, Filter, History } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const MovimientosInventarioTable: React.FC = () => {
  const { loadMovimientos } = useInventarioMovimientos();
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [filteredMovimientos, setFilteredMovimientos] = useState<MovimientoInventario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tipoFilter, setTipoFilter] = useState<string>('all');
  const [materialFilter, setMaterialFilter] = useState<string>('all');

  useEffect(() => {
    cargarMovimientos();
  }, []);

  useEffect(() => {
    filtrarMovimientos();
  }, [movimientos, searchTerm, tipoFilter, materialFilter]);

  const cargarMovimientos = () => {
    const movimientosCargados = loadMovimientos();
    // Ordenar por fecha descendente
    const movimientosOrdenados = movimientosCargados.sort((a, b) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
    setMovimientos(movimientosOrdenados);
  };

  const filtrarMovimientos = () => {
    let filtered = [...movimientos];

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(mov => 
        mov.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mov.origen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mov.destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mov.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mov.maquinaNombre?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por tipo
    if (tipoFilter !== 'all') {
      filtered = filtered.filter(mov => mov.tipo === tipoFilter);
    }

    // Filtrar por material
    if (materialFilter !== 'all') {
      filtered = filtered.filter(mov => mov.material === materialFilter);
    }

    setFilteredMovimientos(filtered);
  };

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

  const exportarMovimientos = () => {
    if (filteredMovimientos.length === 0) {
      toast.error('No hay movimientos para exportar');
      return;
    }

    const exportData = filteredMovimientos.map(mov => ({
      'Fecha': new Date(mov.fecha).toLocaleString(),
      'Tipo': getTipoLabel(mov.tipo),
      'Material': mov.material,
      'Cantidad (m³)': mov.cantidad,
      'Cantidad Anterior': mov.cantidadAnterior,
      'Cantidad Posterior': mov.cantidadPosterior,
      'Origen': mov.origen || '-',
      'Destino': mov.destino || '-',
      'Máquina': mov.maquinaNombre || '-',
      'Usuario': mov.usuario || '-',
      'Observaciones': mov.observaciones || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Movimientos Inventario');
    
    const fileName = `movimientos_inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Movimientos exportados correctamente');
  };

  // Obtener materiales únicos para el filtro
  const materialesUnicos = Array.from(new Set(movimientos.map(mov => mov.material)));

  return (
    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <History className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Movimientos de Inventario
              </CardTitle>
              <p className="text-slate-600 mt-1">
                Historial completo de entradas y salidas
              </p>
            </div>
          </div>
          <Button 
            onClick={exportarMovimientos}
            variant="outline" 
            className="flex items-center gap-2 h-12 px-6 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Download size={16} />
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Filtros */}
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
            onClick={() => {
              setSearchTerm('');
              setTipoFilter('all');
              setMaterialFilter('all');
            }}
            className="h-12 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpiar Filtros
          </Button>
        </div>

        {/* Estadísticas rápidas */}
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

        {/* Tabla de movimientos */}
        {filteredMovimientos.length > 0 ? (
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
        ) : (
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
        )}
      </CardContent>
    </Card>
  );
};

export default MovimientosInventarioTable;
