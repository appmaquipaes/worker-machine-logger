
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { toast } from "sonner";
import { useReportFormState } from './useReportFormState';
import { useReportFormHandlers } from './useReportFormHandlers';
import { useReportFormValidation } from './useReportFormValidation';
import { useReportFormSubmission } from './useReportFormSubmission';

export const useReportForm = () => {
  const { user } = useAuth();
  const { selectedMachine } = useMachine();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState<string>('');
  
  const formState = useReportFormState();
  const { validateReportForm } = useReportFormValidation();
  const { submitReport } = useReportFormSubmission();
  
  const handlers = useReportFormHandlers(
    formState.setWorkSite,
    formState.setSelectedCliente,
    formState.setSelectedFinca,
    setDestination
  );

  // Actualizar destination cuando cambie cliente o finca
  useEffect(() => {
    if (formState.selectedCliente && formState.selectedFinca) {
      const newDestination = `${formState.selectedCliente} - ${formState.selectedFinca}`;
      console.log('🎯 Actualizando destination:', newDestination);
      setDestination(newDestination);
    } else if (formState.selectedCliente && !formState.selectedFinca) {
      // Para clientes sin fincas registradas
      console.log('🎯 Cliente sin fincas, usando cliente como destino:', formState.selectedCliente);
      setDestination(formState.selectedCliente);
    } else if (!formState.selectedCliente) {
      setDestination('');
    }
  }, [formState.selectedCliente, formState.selectedFinca]);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina primero');
      navigate('/machines');
    }
  }, [user, selectedMachine, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    formState.setIsSubmitting(true);
    
    // Log para debug
    console.log('🔍 Validando formulario con:', {
      destination,
      selectedCliente: formState.selectedCliente,
      selectedFinca: formState.selectedFinca,
      reportType: formState.reportType
    });
    
    const isValid = validateReportForm(
      formState.reportType,
      formState.description,
      formState.reportDate,
      formState.trips,
      formState.hours,
      formState.value,
      formState.workSite,
      formState.origin,
      destination,
      formState.cantidadM3,
      selectedMachine,
      formState.maintenanceValue,
      formState.proveedor,
      formState.kilometraje
    );
    
    if (!isValid) {
      formState.setIsSubmitting(false);
      return;
    }
    
    try {
      submitReport(selectedMachine, {
        reportType: formState.reportType,
        description: formState.description,
        reportDate: formState.reportDate,
        trips: formState.trips,
        hours: formState.hours,
        value: formState.value,
        workSite: formState.workSite,
        origin: formState.origin,
        selectedCliente: formState.selectedCliente,
        selectedFinca: formState.selectedFinca,
        maintenanceValue: formState.maintenanceValue,
        cantidadM3: formState.cantidadM3,
        proveedor: formState.proveedor,
        kilometraje: formState.kilometraje,
        tipoMateria: formState.tipoMateria
      });
      
      formState.setLastSubmitSuccess(true);
      formState.clearForm();
      setDestination(''); // Limpiar destination también
      
      setTimeout(() => {
        formState.setLastSubmitSuccess(false);
      }, 8000);
      
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      toast.error('Error al enviar el reporte. Intente nuevamente.');
    } finally {
      formState.setIsSubmitting(false);
    }
  };

  return {
    // All state from formState
    ...formState,
    
    // Additional state
    destination,
    
    // Handlers
    ...handlers,
    handleSubmit,
    
    // Computed
    user,
    selectedMachine,
  };
};
