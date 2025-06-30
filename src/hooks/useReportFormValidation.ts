
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import { toast } from "sonner";

export const useReportFormValidation = () => {
  const validateReportForm = (
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
    selectedMachine?: Machine,
    maintenanceValue?: number,
    proveedor?: string,
    kilometraje?: number
  ): boolean => {
    // Validaciones básicas
    if (!reportType) {
      toast.error("Selecciona un tipo de reporte");
      return false;
    }

    if (!reportDate) {
      toast.error("Selecciona una fecha para el reporte");
      return false;
    }

    // Solo validar descripción para tipos específicos que la requieren explícitamente
    const requiresExplicitDescription = ['Novedades'];
    if (requiresExplicitDescription.includes(reportType) && !description?.trim()) {
      toast.error("Ingresa una descripción para el reporte");
      return false;
    }

    // Validaciones específicas por tipo de reporte
    switch (reportType) {
      case 'Horas Trabajadas':
        if (!hours || hours <= 0) {
          toast.error("Ingresa las horas trabajadas");
          return false;
        }
        if (!workSite?.trim()) {
          toast.error("Ingresa el sitio de trabajo");
          return false;
        }
        break;

      case 'Horas Extras':
        if (!hours || hours <= 0) {
          toast.error("Ingresa las horas extras");
          return false;
        }
        if (!workSite?.trim()) {
          toast.error("Ingresa el sitio de trabajo");
          return false;
        }
        break;

      case 'Combustible':
        if (!value || value <= 0) {
          toast.error("Ingresa el valor del combustible");
          return false;
        }
        if (!kilometraje || kilometraje <= 0) {
          toast.error("Ingresa el kilometraje");
          return false;
        }
        break;

      case 'Mantenimiento':
        if (!maintenanceValue || maintenanceValue <= 0) {
          toast.error("Ingresa el costo del mantenimiento");
          return false;
        }
        break;

      case 'Viajes':
        if (!origin?.trim()) {
          toast.error("Selecciona el origen");
          return false;
        }
        if (!destination?.trim()) {
          console.log('❌ Error de validación - destination vacío:', destination);
          toast.error("Selecciona el cliente y punto de entrega");
          return false;
        }
        if (!trips || trips <= 0) {
          toast.error("Ingresa el número de viajes");
          return false;
        }
        
        // Solo validar m³ si NO es Camabaja
        const isCamabaja = selectedMachine?.type === 'Camabaja';
        if (!isCamabaja) {
          // Para otras máquinas, validar según el tipo de máquina
          const requiresMaterial = selectedMachine?.type === 'Cargador' || 
                                  selectedMachine?.type === 'Volqueta' || 
                                  selectedMachine?.type === 'Camión';
          
          if (requiresMaterial && (!cantidadM3 || cantidadM3 <= 0)) {
            toast.error("Ingresa la cantidad de m³ transportados");
            return false;
          }
        }
        break;

      case 'Recepción Escombrera':
        if (!trips || trips <= 0) {
          toast.error("Ingresa el número de volquetas");
          return false;
        }
        if (!destination?.trim()) {
          toast.error("Selecciona el cliente");
          return false;
        }
        break;

      case 'Novedades':
        // Ya se validó arriba con requiresExplicitDescription
        break;

      default:
        toast.error("Tipo de reporte no válido");
        return false;
    }

    return true;
  };

  return {
    validateReportForm
  };
};
