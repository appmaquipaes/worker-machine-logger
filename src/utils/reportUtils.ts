
import { Report } from '@/types/report';

export const extractClienteFromDestination = (destination: string): string => {
  if (!destination) return '';
  return destination.split(' - ')[0] || '';
};

export const extractFincaFromDestination = (destination: string): string => {
  if (!destination) return '';
  return destination.split(' - ')[1] || '';
};

export const parseStoredReports = (storedReports: string): Report[] => {
  return JSON.parse(storedReports).map((report: any) => ({
    ...report,
    createdAt: new Date(report.createdAt),
    reportDate: report.reportDate ? new Date(report.reportDate) : new Date(report.createdAt),
  }));
};

export const filterReports = (reports: Report[], filters: any): Report[] => {
  console.log('🔍 FILTRANDO REPORTES - Datos de entrada:');
  console.log('Total reportes:', reports.length);
  console.log('Filtros aplicados:', filters);
  
  let filtered = [...reports];
  
  // Log de todos los reportes antes de filtrar
  console.log('📊 Reportes disponibles:');
  reports.forEach((report, index) => {
    console.log(`${index + 1}. ID: ${report.id}, Máquina: ${report.machineName}, Usuario: ${report.userName}, Tipo: ${report.reportType}, Fecha: ${report.reportDate}`);
  });
  
  if (filters.reportType && filters.reportType !== 'all') {
    const beforeFilter = filtered.length;
    filtered = filtered.filter(report => report.reportType === filters.reportType);
    console.log(`Filtro por tipo de reporte '${filters.reportType}': ${beforeFilter} → ${filtered.length}`);
  }
  
  if (filters.machineId && filters.machineId !== 'all') {
    const beforeFilter = filtered.length;
    filtered = filtered.filter(report => report.machineId === filters.machineId);
    console.log(`Filtro por máquina '${filters.machineId}': ${beforeFilter} → ${filtered.length}`);
  }

  if (filters.userId && filters.userId !== 'all') {
    const beforeFilter = filtered.length;
    filtered = filtered.filter(report => report.userId === filters.userId);
    console.log(`Filtro por usuario '${filters.userId}': ${beforeFilter} → ${filtered.length}`);
  }

  // Filter by cliente
  if (filters.cliente && filters.cliente !== 'all') {
    const beforeFilter = filtered.length;
    filtered = filtered.filter(report => {
      const reportCliente = report.workSite || extractClienteFromDestination(report.destination);
      return reportCliente === filters.cliente;
    });
    console.log(`Filtro por cliente '${filters.cliente}': ${beforeFilter} → ${filtered.length}`);
  }

  // Filter by finca
  if (filters.finca && filters.finca !== 'all') {
    const beforeFilter = filtered.length;
    filtered = filtered.filter(report => {
      const reportFinca = extractFincaFromDestination(report.destination);
      return reportFinca === filters.finca;
    });
    console.log(`Filtro por finca '${filters.finca}': ${beforeFilter} → ${filtered.length}`);
  }
  
  if (filters.startDate) {
    const beforeFilter = filtered.length;
    const startDate = new Date(filters.startDate);
    filtered = filtered.filter(report => {
      const reportDate = new Date(report.reportDate);
      return reportDate >= startDate;
    });
    console.log(`Filtro por fecha inicio '${filters.startDate}': ${beforeFilter} → ${filtered.length}`);
  }
  
  if (filters.endDate) {
    const beforeFilter = filtered.length;
    const endDate = new Date(filters.endDate);
    // Ajustar la fecha final al final del día
    endDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(report => {
      const reportDate = new Date(report.reportDate);
      return reportDate <= endDate;
    });
    console.log(`Filtro por fecha fin '${filters.endDate}': ${beforeFilter} → ${filtered.length}`);
  }
  
  console.log('✅ RESULTADO FINAL DEL FILTRADO:', filtered.length, 'reportes');
  return filtered;
};
