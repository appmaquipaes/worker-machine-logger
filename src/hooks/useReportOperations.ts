
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
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      machineId,
      machineName,
      reportType,
      description,
      reportDate,
      trips,
      hours,
      value,
      workSite,
      origin,
      destination,
      cantidadM3,
      proveedor,
      kilometraje,
      createdAt: new Date()
    };
  };

  const getReportsByMachine = (reports: Report[], machineId: string) => {
    return reports.filter(report => report.machineId === machineId);
  };

  const getTotalByType = (reports: Report[], type: string) => {
    return reports
      .filter(report => report.reportType === type)
      .reduce((total, report) => total + (report.value || 0), 0);
  };

  return {
    createReport,
    getReportsByMachine,
    getTotalByType
  };
};
