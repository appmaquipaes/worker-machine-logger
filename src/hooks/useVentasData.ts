
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Venta, loadVentas } from '@/models/Ventas';
import { migrateTarifas } from '@/models/Tarifas';
import * as XLSX from 'xlsx';

export const useVentasData = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    migrateTarifas();
    loadData();
  }, []);

  const loadData = () => {
    const ventasData = loadVentas();
    setVentas(ventasData);
  };

  const exportToExcel = (ventasFiltradas: Venta[]) => {
    if (ventasFiltradas.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = ventasFiltradas.map(venta => ({
      'Fecha': new Date(venta.fecha).toLocaleDateString(),
      'Cliente': venta.cliente,
      'Finca': venta.destino_material ? venta.destino_material.split(' - ')[1] || '' : '',
      'Tipo de Venta': venta.tipo_venta,
      'Ciudad Entrega': venta.ciudad_entrega,
      'Origen Material': venta.origen_material,
      'Forma de Pago': venta.forma_pago,
      'Total Venta': venta.total_venta,
      'Observaciones': venta.observaciones || '',
      'Tipo Registro': venta.observaciones?.includes('Venta automática') ? 'Automática' : 'Manual'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    
    const fileName = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte exportado correctamente');
  };

  return {
    ventas,
    loadData,
    exportToExcel
  };
};
