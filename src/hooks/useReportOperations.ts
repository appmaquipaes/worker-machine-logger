
import { Report, ReportType } from '@/types/report';

export const useReportOperations = () => {
  const createReport = (
    reports: Report[],
    machineId: string,
    machineName: string,
    reportType: ReportType,
    description: string,
    reportDate: Date,
    trips?: number,
    hours?: number,
    value?: number,
    workSite?: string,
    origin?: string,
    destination?: string,
    cantidadM3?: number,
    proveedor?: string,
    kilometraje?: number
  ): Report => {
    const newReport: Report = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      machineId,
      machineName,
      userName: 'Usuario', // Se actualizará en el contexto con el usuario real
      userId: '', // Se actualizará en el contexto con el usuario real
      reportType,
      description,
      reportDate,
      createdAt: new Date(),
      trips,
      hours,
      value: value || 0,
      workSite,
      origin,
      destination,
      cantidadM3,
      proveedor,
      kilometraje
    };

    console.log('🏗️ Reporte base creado:', {
      id: newReport.id,
      machineId: newReport.machineId,
      machineName: newReport.machineName,
      reportType: newReport.reportType,
      description: newReport.description,
      reportDate: newReport.reportDate,
      createdAt: newReport.createdAt
    });

    return newReport;
  };

  const getReportsByMachine = (reports: Report[], machineId: string) => {
    const machineReports = reports.filter(report => report.machineId === machineId);
    console.log(`📊 Reportes para máquina ${machineId}:`, machineReports.length);
    return machineReports;
  };

  const getTotalByType = (reports: Report[], type: string) => {
    const typeReports = reports.filter(report => report.reportType === type);
    const total = typeReports.reduce((total, report) => total + (report.value || 0), 0);
    console.log(`💰 Total para tipo ${type}:`, total);
    return total;
  };

  return {
    createReport,
    getReportsByMachine,
    getTotalByType
  };
};
