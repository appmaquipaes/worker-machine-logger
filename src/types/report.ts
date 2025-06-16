
export type ReportType = 'Horas Trabajadas' | 'Horas Extras' | 'Combustible' | 'Mantenimiento' | 'Novedades' | 'Viajes';

export interface Report {
  id: string;
  machineId: string;
  machineName: string;
  userName: string;
  userId?: string;
  reportType: ReportType;
  description: string;
  value: number;
  createdAt: Date;
  reportDate: Date;
  origin?: string;
  destination?: string;
  cantidadM3?: number;
  trips?: number;
  hours?: number;
  workSite?: string;
  proveedor?: string;
  kilometraje?: number;
  detalleCalculo?: string;
  tarifaEncontrada?: boolean;
  tipoMateria?: string; // NUEVO: Agregado para mejorar la trazabilidad en ventas
}

export interface ReportContextType {
  reports: Report[];
  addReport: (
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
  ) => void;
  updateReport: (id: string, updatedReport: Partial<Report>) => void;
  deleteReport: (id: string) => void;
  getReportsByMachine: (machineId: string) => Report[];
  getTotalByType: (type: string) => number;
  getFilteredReports: (filters: any) => Report[];
}
