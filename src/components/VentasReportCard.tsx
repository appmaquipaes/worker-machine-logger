
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, DollarSign, Package } from 'lucide-react';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface VentasReportCardProps {
  ventas: any[];
}

const VentasReportCard: React.FC<VentasReportCardProps> = ({ ventas }) => {
  const exportarReporte = () => {
    if (ventas.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = ventas.map(venta => ({
      'Fecha': new Date(venta.fecha).toLocaleDateString(),
      'Cliente': venta.cliente,
      'Material': venta.tipo_material || 'N/A',
      'Cantidad (m³)': venta.cantidad_m3 || venta.cantidad_material_m3 || 0,
      'Horas Trabajadas': venta.horas_trabajadas || 0,
      'Viajes Realizados': venta.viajes_realizados || 0,
      'Máquina Utilizada': venta.maquina_utilizada || 'No especificada',
      'Total Venta': `$${(venta.total_venta || 0).toLocaleString()}`,
      'Tipo Registro': venta.tipo_registro || 'Manual',
      'Actividad': venta.actividad_generadora || 'No especificada'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Ventas');
    
    const fileName = `reporte_ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte de ventas exportado correctamente');
  };

  const calcularEstadisticas = () => {
    if (ventas.length === 0) return null;

    // Mejorar el cálculo del total de ventas considerando diferentes estructuras de datos
    const totalVentas = ventas.reduce((sum, venta) => {
      const total = venta.total_venta || 0;
      return sum + total;
    }, 0);
    
    const totalGanancias = ventas.reduce((sum, venta) => {
      const ganancia = venta.ganancia_total || 0;
      return sum + ganancia;
    }, 0);
    
    const totalCantidad = ventas.reduce((sum, venta) => {
      const cantidad = venta.cantidad_m3 || venta.cantidad_material_m3 || 0;
      return sum + cantidad;
    }, 0);
    
    const totalHoras = ventas.reduce((sum, venta) => {
      const horas = venta.horas_trabajadas || 0;
      return sum + horas;
    }, 0);
    
    const totalViajes = ventas.reduce((sum, venta) => {
      const viajes = venta.viajes_realizados || 0;
      return sum + viajes;
    }, 0);
    
    const clientesUnicos = new Set(ventas.map(venta => venta.cliente)).size;
    const maquinasUnicas = new Set(ventas.map(venta => venta.maquina_utilizada).filter(Boolean)).size;

    return {
      totalVentas,
      totalGanancias,
      totalCantidad,
      totalHoras,
      totalViajes,
      clientesUnicos,
      maquinasUnicas,
      promedioVenta: ventas.length > 0 ? totalVentas / ventas.length : 0
    };
  };

  const stats = calcularEstadisticas();

  if (!stats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No hay ventas registradas para generar reportes</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="text-green-600" size={20} />
              <div>
                <div className="text-2xl font-bold text-green-600">${stats.totalVentas.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Ventas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              <div>
                <div className="text-2xl font-bold text-blue-600">{stats.totalHoras.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Horas</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="text-purple-600" size={20} />
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.totalViajes.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Viajes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Métricas adicionales */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Resumen de Ventas</CardTitle>
            <Button onClick={exportarReporte} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Exportar Reporte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold">{ventas.length}</div>
              <div className="text-sm text-muted-foreground">Total Transacciones</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{stats.clientesUnicos}</div>
              <div className="text-sm text-muted-foreground">Clientes Únicos</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{stats.maquinasUnicas}</div>
              <div className="text-sm text-muted-foreground">Máquinas Utilizadas</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">${stats.promedioVenta.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Promedio por Venta</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VentasReportCard;
