
import { useState, useEffect } from 'react';
import { useEnhancedVentas } from '@/context/EnhancedVentasContext';
import { Venta } from '@/types/venta';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export const useVentasDataFixed = () => {
  const { ventas: contextVentas, isLoading, reloadVentas } = useEnhancedVentas();
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    setVentas(contextVentas);
  }, [contextVentas]);

  const loadData = async () => {
    try {
      await reloadVentas();
      console.log('✅ Datos de ventas recargados');
    } catch (error) {
      console.error('❌ Error recargando ventas:', error);
      toast.error('Error al cargar las ventas');
    }
  };

  const exportToExcel = (ventasToExport: Venta[]) => {
    if (ventasToExport.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    try {
      const exportData = ventasToExport.map(venta => ({
        'Fecha': new Date(venta.fecha).toLocaleDateString(),
        'Cliente': venta.cliente,
        'Ciudad de Entrega': venta.ciudad_entrega,
        'Tipo de Venta': venta.tipo_venta,
        'Origen Material': venta.origen_material,
        'Destino Material': venta.destino_material,
        'Forma de Pago': venta.forma_pago,
        'Total Venta': venta.total_venta,
        'Actividad Generadora': venta.actividad_generadora || '',
        'Tipo de Registro': venta.tipo_registro || '',
        'Máquina Utilizada': venta.maquina_utilizada || '',
        'Horas Trabajadas': venta.horas_trabajadas || '',
        'Viajes Realizados': venta.viajes_realizados || '',
        'Cantidad Material (m³)': venta.cantidad_material_m3 || '',
        'Observaciones': venta.observaciones || ''
      }));

      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
      
      const fileName = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success('Reporte exportado correctamente');
    } catch (error) {
      console.error('❌ Error exportando:', error);
      toast.error('Error al exportar el reporte');
    }
  };

  return {
    ventas,
    isLoading,
    loadData,
    exportToExcel
  };
};
