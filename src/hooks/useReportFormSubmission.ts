
import { useReport } from '@/context/ReportContext';
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';
import { toast } from "sonner";
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';

export const useReportFormSubmission = () => {
  const { addReport } = useReport();
  const { isCargador } = useMachineSpecificReports();

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
      description,
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

    // Para viajes del Cargador, usar el tipo de materia como descripción
    let reportDescription = '';
    if (reportType === 'Viajes' && isCargador(selectedMachine) && tipoMateria) {
      reportDescription = tipoMateria;
      console.log('Cargador - usando tipoMateria como descripción:', tipoMateria);
    } else if (reportType === 'Novedades') {
      reportDescription = description;
    } else if (reportType === 'Recepción Escombrera') {
      reportDescription = `Recepción ${tipoMateria} - ${trips} volquetas`;
    } else {
      reportDescription = description;
    }
    
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
        reportType === 'Horas Trabajadas' ? workSite : undefined,
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
