
import { useState, useEffect } from 'react';
import { Venta, loadVentas, saveVentas } from '@/models/Ventas';
import { useVentaCalculationsFixed } from '@/hooks/useVentaCalculationsFixed';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

export const useVentasData = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const { recalculateAllVentaTotals } = useVentaCalculationsFixed();

  const loadData = () => {
    console.log('📊 Cargando ventas con corrección de totales...');
    let ventasFromStorage = loadVentas();
    
    // CORREGIR totales automáticamente
    const ventasCorregidas = recalculateAllVentaTotals(ventasFromStorage);
    
    // Verificar si hubo cambios y guardar si es necesario
    const huboCambios = ventasCorregidas.some((venta, index) => 
      venta.total_venta !== ventasFromStorage[index]?.total_venta
    );
    
    if (huboCambios) {
      console.log('🔧 Se encontraron ventas con totales incorrectos, corrigiendo...');
      saveVentas(ventasCorregidas);
      toast.success('Totales de ventas corregidos automáticamente', {
        duration: 3000
      });
    }
    
    setVentas(ventasCorregidas);
  };

  const exportToExcel = (ventasFiltradas: Venta[]) => {
    if (ventasFiltradas.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = ventasFiltradas.map(venta => ({
      'Fecha': new Date(venta.fecha).toLocaleDateString('es-CO'),
      'Cliente': venta.cliente,
      'Finca/Destino': venta.destino_material,
      'Tipo de Venta': venta.tipo_venta,
      'Actividad': venta.actividad_generadora || 'Venta manual',
      'Máquina Utilizada': venta.maquina_utilizada || 'No especificada',
      'Horas Trabajadas': venta.horas_trabajadas || '',
      'Viajes Realizados': venta.viajes_realizados || '',
      'Material (m³)': venta.cantidad_material_m3 || '',
      'Origen': venta.origen_material,
      'Total Venta': venta.total_venta,
      'Tipo de Registro': venta.tipo_registro || 'Manual',
      'Observaciones': venta.observaciones || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    
    const fileName = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte de ventas exportado correctamente');
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    ventas,
    loadData,
    exportToExcel
  };
};
