
import { useReport } from '@/context/ReportContext';
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';
import { toast } from "sonner";
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';

export const useReportFormSubmission = () => {
  const { addReport } = useReport();
  const { isCargador } = useMachineSpecificReports();

  const generateReportDescription = (
    reportType: ReportType,
    machine: Machine,
    formData: any
  ): string => {
    switch (reportType) {
      case 'Horas Trabajadas':
        return `Horas trabajadas - ${formData.hours} horas en ${formData.workSite}`;
      
      case 'Horas Extras':
        return `Horas extras - ${formData.hours} horas en ${formData.workSite}`;
      
      case 'Combustible':
        return `Combustible - $${formData.value} - Km: ${formData.kilometraje}`;
      
      case 'Mantenimiento':
        return `Mantenimiento - $${formData.maintenanceValue} - ${formData.proveedor}`;
      
      case 'Viajes':
        if (isCargador(machine) && formData.tipoMateria) {
          return formData.tipoMateria;
        } else if (formData.origin === 'Acopio Maquipaes' && formData.tipoMateria) {
          return formData.tipoMateria;
        }
        return `Viaje desde ${formData.origin} hasta ${formData.selectedCliente}`;
      
      case 'Recepción Escombrera':
        return `Recepción ${formData.tipoMateria} - ${formData.trips} volquetas`;
      
      case 'Novedades':
        return formData.description; // Para novedades sí usar la descripción manual
      
      default:
        return `${reportType} - ${machine.name}`;
    }
  };

  const submitReport = (
    selectedMachine: Machine,
    formData: {
      reportType: ReportType;
      description: string;
      reportDate: Date;
      trips?: number;
      hours?: number;
      value?: number;
      workSite: string;
      origin: string;
      selectedCliente: string;
      selectedFinca: string;
      maintenanceValue?: number;
      cantidadM3?: number;
      proveedor: string;
      kilometraje?: number;
      tipoMateria: string;
    }
  ) => {
    const {
      reportType,
      reportDate,
      trips,
      hours,
      value,
      workSite,
      origin,
      selectedCliente,
      selectedFinca,
      maintenanceValue,
      cantidadM3,
      proveedor,
      kilometraje,
      tipoMateria
    } = formData;

    // Generar descripción automática basada en el tipo de reporte
    const reportDescription = generateReportDescription(reportType, selectedMachine, formData);
    
    const finalDestination = reportType === 'Viajes' 
      ? `${selectedCliente} - ${selectedFinca}`
      : selectedCliente;
    
    if (reportType === 'Recepción Escombrera') {
      addReport(
        selectedMachine.id,
        selectedMachine.name,
        reportType,
        reportDescription,
        reportDate,
        trips, // cantidad de volquetas
        undefined, // hours
        undefined, // value se calculará automáticamente
        undefined, // workSite
        'Escombrera MAQUIPAES', // origin
        selectedCliente, // destination (cliente)
        undefined, // cantidadM3
        undefined, // proveedor
        undefined // kilometraje
      );
    } else {
      addReport(
        selectedMachine.id,
        selectedMachine.name,
        reportType,
        reportDescription,
        reportDate,
        reportType === 'Viajes' ? trips : undefined,
        (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') ? hours : undefined,
        reportType === 'Combustible' ? value : 
        reportType === 'Mantenimiento' ? maintenanceValue : undefined,
        reportType === 'Horas Trabajadas' || reportType === 'Horas Extras' ? workSite : undefined,
        reportType === 'Viajes' ? origin : undefined,
        reportType === 'Viajes' ? finalDestination : undefined,
        reportType === 'Viajes' ? cantidadM3 : undefined,
        reportType === 'Mantenimiento' ? proveedor : undefined,
        reportType === 'Combustible' ? kilometraje : undefined
      );
    }

    toast.success('¡REPORTE REGISTRADO CON ÉXITO!', {
      duration: 5000,
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        backgroundColor: '#22c55e',
        color: 'white'
      }
    });
  };

  return {
    submitReport,
  };
};
