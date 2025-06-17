
import { Report } from '@/types/report';
import { Venta } from '@/models/Ventas';
import { InventarioAcopio } from '@/models/InventarioAcopio';

export interface DataMismatch {
  reportId: string;
  field: string;
  expectedValue: any;
  actualValue: any;
  impact: 'critical' | 'moderate' | 'minor';
}

export const compareReportWithSale = (report: Report, sale: Venta): DataMismatch[] => {
  const mismatches: DataMismatch[] = [];
  
  // Verificar cliente
  const reportCliente = report.destination?.split(' - ')[0] || '';
  if (reportCliente !== sale.cliente) {
    mismatches.push({
      reportId: report.id,
      field: 'cliente',
      expectedValue: reportCliente,
      actualValue: sale.cliente,
      impact: 'critical'
    });
  }
  
  // Verificar fecha (tolerancia de 1 día)
  const timeDiff = Math.abs(report.reportDate.getTime() - new Date(sale.fecha).getTime());
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  if (daysDiff > 1) {
    mismatches.push({
      reportId: report.id,
      field: 'fecha',
      expectedValue: report.reportDate.toISOString().split('T')[0],
      actualValue: new Date(sale.fecha).toISOString().split('T')[0],
      impact: 'moderate'
    });
  }
  
  // Verificar origen/destino
  if (report.origin !== sale.origen_material) {
    mismatches.push({
      reportId: report.id,
      field: 'origen',
      expectedValue: report.origin,
      actualValue: sale.origen_material,
      impact: 'moderate'
    });
  }
  
  return mismatches;
};

export const validateInventoryMovement = (
  report: Report, 
  inventoryItem: InventarioAcopio
): boolean => {
  if (report.reportType !== 'Viajes' || !report.cantidadM3 || !report.tipoMateria) {
    return true; // No aplica validación
  }
  
  return inventoryItem.cantidad_disponible >= report.cantidadM3;
};

export const findOrphanedSales = (reports: Report[], sales: Venta[]): Venta[] => {
  return sales.filter(sale => {
    if (!sale.observaciones?.includes('Venta generada automáticamente')) {
      return false; // No es venta automática
    }
    
    const reportId = sale.observaciones.match(/ID: (\w+)/)?.[1];
    if (!reportId) return true; // Venta automática sin ID de reporte
    
    return !reports.find(r => r.id === reportId);
  });
};

export const findMissingSales = (reports: Report[], sales: Venta[]): Report[] => {
  return reports.filter(report => {
    if (report.reportType !== 'Viajes' || report.value <= 0) {
      return false; // No debería generar venta
    }
    
    // Buscar venta correspondiente
    return !sales.find(sale => 
      sale.observaciones?.includes(report.id) ||
      (sale.cliente === report.destination?.split(' - ')[0] &&
       Math.abs(new Date(sale.fecha).getTime() - report.reportDate.getTime()) < 24 * 60 * 60 * 1000)
    );
  });
};

export const calculateReconciliationScore = (
  totalReports: number,
  totalDiscrepancies: number
): number => {
  if (totalReports === 0) return 100;
  
  const score = Math.max(0, 100 - (totalDiscrepancies / totalReports) * 100);
  return Math.round(score * 100) / 100;
};

export const generateReconciliationReport = (
  reports: Report[],
  sales: Venta[],
  inventory: InventarioAcopio[]
) => {
  const orphanedSales = findOrphanedSales(reports, sales);
  const missingSales = findMissingSales(reports, sales);
  
  // Corregir: remover la verificación de umbral_minimo que no existe
  const inventoryIssues = inventory.filter(item => 
    item.cantidad_disponible < 0
  );
  
  const totalIssues = orphanedSales.length + missingSales.length + inventoryIssues.length;
  const reconciliationScore = calculateReconciliationScore(reports.length, totalIssues);
  
  return {
    score: reconciliationScore,
    summary: {
      totalReports: reports.length,
      totalSales: sales.length,
      totalInventoryItems: inventory.length,
      totalIssues
    },
    issues: {
      orphanedSales,
      missingSales,
      inventoryIssues
    },
    recommendations: generateRecommendations(orphanedSales, missingSales, inventoryIssues)
  };
};

const generateRecommendations = (
  orphanedSales: Venta[],
  missingSales: Report[],
  inventoryIssues: InventarioAcopio[]
): string[] => {
  const recommendations: string[] = [];
  
  if (orphanedSales.length > 0) {
    recommendations.push(`Revisar ${orphanedSales.length} venta(s) huérfana(s) sin reporte correspondiente`);
  }
  
  if (missingSales.length > 0) {
    recommendations.push(`Generar ${missingSales.length} venta(s) faltante(s) para reportes de viajes`);
  }
  
  if (inventoryIssues.length > 0) {
    recommendations.push(`Corregir ${inventoryIssues.length} problema(s) de inventario con stock negativo`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ No se encontraron problemas. Los datos están consistentes.');
  }
  
  return recommendations;
};
