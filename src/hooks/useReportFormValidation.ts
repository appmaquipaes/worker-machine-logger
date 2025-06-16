
import { ReportType } from '@/types/report';
import { validateReportForm } from '@/utils/reportValidation';

interface UseReportFormValidationProps {
  reportType: ReportType;
  description: string;
  trips?: number;
  hours?: number;
  value?: number;
  origin: string;
  selectedCliente: string;
  selectedFinca: string;
  workSite: string;
  maintenanceValue?: number;
  cantidadM3?: number;
  proveedor: string;
  kilometraje?: number;
  tipoMateria: string;
  inventarioAcopio: any[];
  selectedMaquinaria: string;
  machineType?: string;
}

export const useReportFormValidation = () => {
  const validateForm = (data: UseReportFormValidationProps): string | null => {
    return validateReportForm({
      reportType: data.reportType,
      description: data.description,
      trips: data.trips,
      hours: data.hours,
      value: data.value,
      origin: data.origin,
      selectedCliente: data.selectedCliente,
      selectedFinca: data.selectedFinca,
      workSite: data.workSite,
      maintenanceValue: data.maintenanceValue,
      cantidadM3: data.cantidadM3,
      proveedor: data.proveedor,
      kilometraje: data.kilometraje,
      tipoMateria: data.tipoMateria,
      inventarioAcopio: data.inventarioAcopio,
      selectedMaquinaria: data.selectedMaquinaria,
      machineType: data.machineType
    });
  };

  return { validateForm };
};
