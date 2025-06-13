
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
      'Material': venta.tipo_material,
      'Cantidad (m³)': venta.cantidad_m3,
      'Costo Base': `$${venta.costo_base_m3.toLocaleString()}`,
      'Flete': `$${venta.flete_aplicado_m3.toLocaleString()}`,
      'Margen': `$${venta.margen_ganancia_m3.toLocaleString()}`,
      'Precio Venta': `$${venta.precio_venta_m3.toLocaleString()}`,
      'Total Venta': `$${venta.total_venta.toLocaleString()}`,
      'Ganancia': `$${venta.ganancia_total.toLocaleString()}`,
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

    const totalVentas = ventas.reduce((sum, venta) => sum + venta.total_venta, 0);
    const totalGanancias = ventas.reduce((sum, venta) => sum + venta.ganancia_total, 0);
    const totalCantidad = ventas.reduce((sum, venta) => sum + venta.cantidad_m3, 0);
    const clientesUnicos = new Set(ventas.map(venta => venta.cliente)).size;
    const materialesUnicos = new Set(ventas.map(venta => venta.tipo_material)).size;

    return {
      totalVentas,
      totalGanancias,
      totalCantidad,
      clientesUnicos,
      materialesUnicos,
      promedioVenta: totalVentas / ventas.length
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
                <div className="text-2xl font-bold text-blue-600">${stats.totalGanancias.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Ganancias</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="text-purple-600" size={20} />
              <div>
                <div className="text-2xl font-bold text-purple-600">{stats.totalCantidad.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">m³ Vendidos</div>
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
              <div className="text-lg font-semibold">{stats.materialesUnicos}</div>
              <div className="text-sm text-muted-foreground">Materiales Diferentes</div>
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
