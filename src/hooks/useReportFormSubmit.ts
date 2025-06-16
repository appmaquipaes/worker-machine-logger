
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport } from '@/context/ReportContext';
import { ReportType } from '@/types/report';
import { toast } from "sonner";
import { useReportFormValidation } from './useReportFormValidation';
import { createReportData } from '@/utils/reportFormUtils';

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
  const { validateForm } = useReportFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    props.setIsSubmitting(true);
    
    const validationError = validateForm({
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
      const reportData = createReportData(
        props.reportType,
        props.description,
        props.reportDate,
        props.trips,
        props.hours,
        props.value,
        props.workSite,
        props.origin,
        props.selectedCliente,
        props.selectedFinca,
        props.maintenanceValue,
        props.cantidadM3,
        props.proveedor,
        props.kilometraje,
        props.tipoMateria,
        props.selectedMaquinaria
      );

      // Usar addReport del contexto que ya maneja la creación automática de ventas
      addReport(
        selectedMachine.id,
        selectedMachine.name,
        reportData.reportType,
        reportData.description,
        reportData.reportDate,
        reportData.trips,
        reportData.hours,
        reportData.value,
        reportData.workSite,
        reportData.origin,
        reportData.destination,
        reportData.cantidadM3,
        reportData.proveedor,
        reportData.kilometraje
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
      
      // Log para debugging - mostrar que se incluye tipo de materia
      if (props.reportType === 'Viajes' && props.tipoMateria) {
        console.log('📦 Reporte con tipo de materia:', props.tipoMateria);
      }
      
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
