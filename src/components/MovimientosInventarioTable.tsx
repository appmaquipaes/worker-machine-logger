
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInventarioMovimientos } from '@/hooks/useInventarioMovimientos';
import { MovimientoInventario } from '@/types/inventario';
import { Download, History } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from "sonner";
import MovimientosInventarioStats from '@/components/inventario/MovimientosInventarioStats';
import MovimientosInventarioFilters from '@/components/inventario/MovimientosInventarioFilters';
import MovimientosInventarioTableContent from '@/components/inventario/MovimientosInventarioTableContent';

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

  const exportarMovimientos = () => {
    if (filteredMovimientos.length === 0) {
      toast.error('No hay movimientos para exportar');
      return;
    }

    const getTipoLabel = (tipo: string) => {
      switch (tipo) {
        case 'entrada': return 'Entrada';
        case 'salida': return 'Salida';
        case 'desglose': return 'Desglose';
        case 'ajuste_manual': return 'Ajuste Manual';
        default: return tipo;
      }
    };

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

  const handleClearFilters = () => {
    setSearchTerm('');
    setTipoFilter('all');
    setMaterialFilter('all');
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
        <MovimientosInventarioFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          tipoFilter={tipoFilter}
          setTipoFilter={setTipoFilter}
          materialFilter={materialFilter}
          setMaterialFilter={setMaterialFilter}
          materialesUnicos={materialesUnicos}
          onClearFilters={handleClearFilters}
        />

        <MovimientosInventarioStats filteredMovimientos={filteredMovimientos} />

        <MovimientosInventarioTableContent filteredMovimientos={filteredMovimientos} />
      </CardContent>
    </Card>
  );
};

export default MovimientosInventarioTable;
