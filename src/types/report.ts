
export type ReportType = 'Horas Trabajadas' | 'Horas Extras' | 'Combustible' | 'Mantenimiento' | 'Novedades' | 'Viajes' | 'Recepción Escombrera';

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
  // Nuevos campos para trazabilidad mejorada
  proveedorId?: string; // ID del proveedor cuando el origen es un proveedor
  proveedorNombre?: string; // Nombre limpio del proveedor
  kilometraje?: number;
  detalleCalculo?: string;
  tarifaEncontrada?: boolean;
  // Nuevos campos para escombrera
  clienteEscombrera?: string;
  tipoVolqueta?: 'Sencilla' | 'Doble Troque';
  cantidadVolquetas?: number;
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
