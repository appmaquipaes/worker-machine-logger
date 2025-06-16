
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport } from '@/context/ReportContext';
import { ReportType } from '@/types/report';
import { toast } from "sonner";
import { validateReportForm } from '@/utils/reportValidation';

interface UseReportFormSubmitProps {
  reportType: ReportType;
  description: string;
  trips?: number;
  hours?: number;
  value?: number;
  reportDate: Date;
  workSite: string;
  origin: string;
  selectedCliente: string;
  selectedFinca: string;
  maintenanceValue?: number;
  cantidadM3?: number;
  proveedor: string;
  kilometraje?: number;
  tipoMateria: string;
  selectedMaquinaria: string;
  inventarioAcopio: any[];
  setIsSubmitting: (value: boolean) => void;
  setLastSubmitSuccess: (value: boolean) => void;
  clearForm: () => void;
}

export const useReportFormSubmit = (props: UseReportFormSubmitProps) => {
  const { selectedMachine } = useMachine();
  const { addReport } = useReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    props.setIsSubmitting(true);
    
    const validationError = validateReportForm({
      reportType: props.reportType,
      description: props.description,
      trips: props.trips,
      hours: props.hours,
      value: props.value,
      origin: props.origin,
      selectedCliente: props.selectedCliente,
      selectedFinca: props.selectedFinca,
      workSite: props.workSite,
      maintenanceValue: props.maintenanceValue,
      cantidadM3: props.cantidadM3,
      proveedor: props.proveedor,
      kilometraje: props.kilometraje,
      tipoMateria: props.tipoMateria,
      inventarioAcopio: props.inventarioAcopio,
      selectedMaquinaria: props.selectedMaquinaria,
      machineType: selectedMachine.type
    });
    
    if (validationError) {
      toast.error(validationError);
      props.setIsSubmitting(false);
      return;
    }
    
    try {
      const reportDescription = props.reportType === 'Novedades' ? props.description : '';
      const finalDestination = props.reportType === 'Viajes' 
        ? `${props.selectedCliente} - ${props.selectedFinca}`
        : props.selectedCliente || '';
      
      addReport(
        selectedMachine.id,
        selectedMachine.name,
        props.reportType,
        reportDescription,
        props.reportDate,
        props.reportType === 'Viajes' ? props.trips : undefined,
        (props.reportType === 'Horas Trabajadas' || props.reportType === 'Horas Extras') ? props.hours : undefined,
        props.reportType === 'Combustible' ? props.value : 
        props.reportType === 'Mantenimiento' ? props.maintenanceValue : undefined,
        props.reportType === 'Horas Trabajadas' ? props.workSite : undefined,
        props.reportType === 'Viajes' ? props.origin : undefined,
        props.reportType === 'Viajes' ? finalDestination : undefined,
        props.reportType === 'Viajes' ? props.cantidadM3 : undefined,
        props.reportType === 'Mantenimiento' ? props.proveedor : undefined,
        props.reportType === 'Combustible' ? props.kilometraje : undefined
      );
      
      props.setLastSubmitSuccess(true);
      toast.success('¡REPORTE REGISTRADO CON ÉXITO!', {
        duration: 5000,
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#22c55e',
          color: 'white'
        }
      });
      
      props.clearForm();
      
      setTimeout(() => {
        props.setLastSubmitSuccess(false);
      }, 8000);
      
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      toast.error('Error al enviar el reporte. Intente nuevamente.');
    } finally {
      props.setIsSubmitting(false);
    }
  };

  return { handleSubmit };
};
