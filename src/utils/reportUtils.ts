
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
    // Asegurar que los nuevos campos existan en reportes existentes
    proveedorId: report.proveedorId || undefined,
    proveedorNombre: report.proveedorNombre || undefined,
  }));
};

export const filterReports = (reports: Report[], filters: any): Report[] => {
  let filtered = [...reports];
  
  if (filters.reportType && filters.reportType !== 'all') {
    filtered = filtered.filter(report => report.reportType === filters.reportType);
  }
  
  if (filters.machineId && filters.machineId !== 'all') {
    filtered = filtered.filter(report => report.machineId === filters.machineId);
  }

  if (filters.userId && filters.userId !== 'all') {
    filtered = filtered.filter(report => report.userId === filters.userId);
  }

  // Filter by cliente
  if (filters.cliente && filters.cliente !== 'all') {
    filtered = filtered.filter(report => {
      const reportCliente = report.workSite || extractClienteFromDestination(report.destination);
      return reportCliente === filters.cliente;
    });
  }

  // Filter by finca
  if (filters.finca && filters.finca !== 'all') {
    filtered = filtered.filter(report => {
      const reportFinca = extractFincaFromDestination(report.destination);
      return reportFinca === filters.finca;
    });
  }

  // NEW: Filter by proveedor
  if (filters.proveedorId && filters.proveedorId !== 'all') {
    filtered = filtered.filter(report => report.proveedorId === filters.proveedorId);
  }
  
  if (filters.startDate) {
    filtered = filtered.filter(report => report.reportDate >= new Date(filters.startDate));
  }
  
  if (filters.endDate) {
    filtered = filtered.filter(report => report.reportDate <= new Date(filters.endDate));
  }
  
  return filtered;
};
