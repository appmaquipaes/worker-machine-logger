
import { useCallback, useState, useEffect } from 'react';
import { Report } from '@/types/report';
import { Venta, loadVentas } from '@/models/Ventas';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';
import { useReport } from '@/context/ReportContext';

interface DiscrepancyItem {
  id: string;
  type: 'inventory' | 'sales' | 'report';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affectedItems: string[];
  suggestedAction: string;
  timestamp: Date;
}

interface ReconciliationResults {
  totalDiscrepancies: number;
  inventoryDiscrepancies: DiscrepancyItem[];
  salesDiscrepancies: DiscrepancyItem[];
  reportDiscrepancies: DiscrepancyItem[];
  lastReconciliation: Date;
}

export const useDataReconciliation = () => {
  const { reports } = useReport();
  const [reconciliationResults, setReconciliationResults] = useState<ReconciliationResults>({
    totalDiscrepancies: 0,
    inventoryDiscrepancies: [],
    salesDiscrepancies: [],
    reportDiscrepancies: [],
    lastReconciliation: new Date()
  });
  const [isReconciling, setIsReconciling] = useState(false);

  const checkInventoryConsistency = useCallback((reports: Report[]): DiscrepancyItem[] => {
    const discrepancies: DiscrepancyItem[] = [];
    const inventario = loadInventarioAcopio();
    
    // Verificar salidas de inventario vs reportes de viajes desde acopio
    const reportesDesdeAcopio = reports.filter(r => 
      r.reportType === 'Viajes' && 
      r.origin?.toLowerCase().includes('acopio') &&
      r.cantidadM3 &&
      r.tipoMateria
    );

    reportesDesdeAcopio.forEach(reporte => {
      const materialInventario = inventario.find(item => 
        item.tipo_material === reporte.tipoMateria
      );

      if (!materialInventario) {
        discrepancies.push({
          id: `inv_missing_${reporte.id}`,
          type: 'inventory',
          severity: 'high',
          description: `Material "${reporte.tipoMateria}" en reporte no existe en inventario`,
          affectedItems: [reporte.id],
          suggestedAction: 'Verificar tipo de material o actualizar inventario',
          timestamp: new Date()
        });
      } else if (materialInventario.cantidad_disponible < 0) {
        discrepancies.push({
          id: `inv_negative_${materialInventario.id}`,
          type: 'inventory',
          severity: 'high',
          description: `Inventario negativo para ${materialInventario.tipo_material}`,
          affectedItems: [materialInventario.id],
          suggestedAction: 'Revisar movimientos de inventario y corregir',
          timestamp: new Date()
        });
      }
    });

    return discrepancies;
  }, []);

  const checkSalesConsistency = useCallback((reports: Report[]): DiscrepancyItem[] => {
    const discrepancies: DiscrepancyItem[] = [];
    const ventas = loadVentas();
    
    // Verificar que cada reporte de viaje tenga una venta correspondiente
    const reportesViajes = reports.filter(r => r.reportType === 'Viajes');
    
    reportesViajes.forEach(reporte => {
      const ventaCorrespondiente = ventas.find(venta => 
        venta.observaciones?.includes(reporte.id) ||
        (venta.cliente === reporte.destination?.split(' - ')[0] &&
         Math.abs(new Date(venta.fecha).getTime() - reporte.reportDate.getTime()) < 24 * 60 * 60 * 1000)
      );

      if (!ventaCorrespondiente && reporte.value > 0) {
        discrepancies.push({
          id: `sales_missing_${reporte.id}`,
          type: 'sales',
          severity: 'medium',
          description: `Reporte de viaje sin venta automática generada`,
          affectedItems: [reporte.id],
          suggestedAction: 'Generar venta manualmente o verificar configuración automática',
          timestamp: new Date()
        });
      }
    });

    // Verificar ventas huérfanas (sin reporte correspondiente)
    const ventasAutomaticas = ventas.filter(v => 
      v.observaciones?.includes('Venta generada automáticamente')
    );

    ventasAutomaticas.forEach(venta => {
      const reporteId = venta.observaciones?.match(/ID: (\w+)/)?.[1];
      if (reporteId) {
        const reporteCorrespondiente = reports.find(r => r.id === reporteId);
        if (!reporteCorrespondiente) {
          discrepancies.push({
            id: `sales_orphan_${venta.id}`,
            type: 'sales',
            severity: 'low',
            description: `Venta automática sin reporte correspondiente`,
            affectedItems: [venta.id],
            suggestedAction: 'Revisar y posiblemente eliminar venta huérfana',
            timestamp: new Date()
          });
        }
      }
    });

    return discrepancies;
  }, []);

  const checkReportConsistency = useCallback((reports: Report[]): DiscrepancyItem[] => {
    const discrepancies: DiscrepancyItem[] = [];
    
    // Verificar reportes con valores calculados vs manuales
    reports.forEach(reporte => {
      if (reporte.reportType === 'Viajes' && !reporte.tarifaEncontrada && reporte.value > 0) {
        discrepancies.push({
          id: `report_manual_${reporte.id}`,
          type: 'report',
          severity: 'low',
          description: `Reporte con valor manual - sin tarifa automática`,
          affectedItems: [reporte.id],
          suggestedAction: 'Verificar si existe tarifa para este cliente/ruta',
          timestamp: new Date()
        });
      }

      // Verificar reportes de viajes sin tipo de materia
      if (reporte.reportType === 'Viajes' && 
          ['Volqueta', 'Cargador', 'Camión'].includes(reporte.machineName) &&
          !reporte.tipoMateria) {
        discrepancies.push({
          id: `report_no_material_${reporte.id}`,
          type: 'report',
          severity: 'medium',
          description: `Reporte de transporte sin tipo de materia especificado`,
          affectedItems: [reporte.id],
          suggestedAction: 'Actualizar reporte con tipo de materia',
          timestamp: new Date()
        });
      }
    });

    return discrepancies;
  }, []);

  const runReconciliation = useCallback(async () => {
    setIsReconciling(true);
    
    try {
      console.log('🔄 Iniciando reconciliación de datos...');
      
      const inventoryDiscrepancies = checkInventoryConsistency(reports);
      const salesDiscrepancies = checkSalesConsistency(reports);
      const reportDiscrepancies = checkReportConsistency(reports);
      
      const results: ReconciliationResults = {
        totalDiscrepancies: inventoryDiscrepancies.length + salesDiscrepancies.length + reportDiscrepancies.length,
        inventoryDiscrepancies,
        salesDiscrepancies,
        reportDiscrepancies,
        lastReconciliation: new Date()
      };
      
      setReconciliationResults(results);
      
      console.log('✅ Reconciliación completada:', {
        total: results.totalDiscrepancies,
        inventario: inventoryDiscrepancies.length,
        ventas: salesDiscrepancies.length,
        reportes: reportDiscrepancies.length
      });
      
    } catch (error) {
      console.error('❌ Error en reconciliación:', error);
    } finally {
      setIsReconciling(false);
    }
  }, [reports, checkInventoryConsistency, checkSalesConsistency, checkReportConsistency]);

  // Ejecutar reconciliación automática cada vez que cambien los reportes
  useEffect(() => {
    if (reports.length > 0) {
      runReconciliation();
    }
  }, [reports.length, runReconciliation]);

  const getDiscrepanciesBySeverity = useCallback((severity: 'high' | 'medium' | 'low') => {
    return [
      ...reconciliationResults.inventoryDiscrepancies,
      ...reconciliationResults.salesDiscrepancies,
      ...reconciliationResults.reportDiscrepancies
    ].filter(d => d.severity === severity);
  }, [reconciliationResults]);

  return {
    reconciliationResults,
    isReconciling,
    runReconciliation,
    getDiscrepanciesBySeverity
  };
};
