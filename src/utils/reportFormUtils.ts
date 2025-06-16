
import { ReportType } from '@/types/report';

export const createReportData = (
  reportType: ReportType,
  description: string,
  reportDate: Date,
  trips?: number,
  hours?: number,
  value?: number,
  workSite?: string,
  origin?: string,
  selectedCliente?: string,
  selectedFinca?: string,
  maintenanceValue?: number,
  cantidadM3?: number,
  proveedor?: string,
  kilometraje?: number,
  tipoMateria?: string,
  selectedMaquinaria?: string
) => {
  const reportDescription = reportType === 'Novedades' ? description : '';
  const finalDestination = reportType === 'Viajes' 
    ? `${selectedCliente} - ${selectedFinca}`
    : selectedCliente || '';
  
  return {
    reportType,
    description: reportDescription,
    reportDate,
    trips: reportType === 'Viajes' ? trips : undefined,
    hours: (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') ? hours : undefined,
    value: reportType === 'Combustible' ? value : 
           reportType === 'Mantenimiento' ? maintenanceValue : undefined,
    workSite: reportType === 'Horas Trabajadas' ? workSite : undefined,
    origin: reportType === 'Viajes' ? origin : undefined,
    destination: reportType === 'Viajes' ? finalDestination : undefined,
    cantidadM3: reportType === 'Viajes' ? cantidadM3 : undefined,
    proveedor: reportType === 'Mantenimiento' ? proveedor : undefined,
    kilometraje: reportType === 'Combustible' ? kilometraje : undefined,
    tipoMateria: reportType === 'Viajes' ? tipoMateria : undefined,
    selectedMaquinaria: reportType === 'Viajes' ? selectedMaquinaria : undefined
  };
};
