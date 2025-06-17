
import { validateReportForm } from '@/utils/reportValidation';
import { ReportType } from '@/types/report';

export const useReportFormValidation = () => {
  const validateForm = (formData: {
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
  }) => {
    return validateReportForm(formData);
  };

  return {
    validateForm,
  };
};
