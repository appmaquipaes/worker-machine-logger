
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport } from '@/context/ReportContext';
import { toast } from "sonner";
import { useReportFormState } from './useReportFormState';
import { useReportFormHandlers } from './useReportFormHandlers';
import { useReportFormValidation } from './useReportFormValidation';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';

export const useReportForm = () => {
  const { user } = useAuth();
  const { selectedMachine } = useMachine();
  const { addReport } = useReport();
  const { isCargador } = useMachineSpecificReports();
  const navigate = useNavigate();
  
  const [destination, setDestination] = useState<string>('');
  
  const formState = useReportFormState();
  const { validateForm } = useReportFormValidation();
  
  const handlers = useReportFormHandlers(
    formState.setWorkSite,
    formState.setSelectedCliente,
    formState.setSelectedFinca,
    setDestination
  );
  
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
    } else if (reportType === 'Viajes' && origin === 'Acopio Maquipaes' && tipoMateria) {
      // Para cualquier vehículo que transporte desde acopio, usar el material seleccionado
      reportDescription = tipoMateria;
      console.log('Viaje desde acopio - usando tipoMateria como descripción:', tipoMateria);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    formState.setIsSubmitting(true);
    
    const validationError = validateForm({
      reportType: formState.reportType,
      description: formState.description,
      trips: formState.trips,
      hours: formState.hours,
      value: formState.value,
      origin: formState.origin,
      selectedCliente: formState.selectedCliente,
      selectedFinca: formState.selectedFinca,
      workSite: formState.workSite,
      maintenanceValue: formState.maintenanceValue,
      cantidadM3: formState.cantidadM3,
      proveedor: formState.proveedor,
      kilometraje: formState.kilometraje,
      tipoMateria: formState.tipoMateria,
      inventarioAcopio: formState.inventarioAcopio,
      selectedMaquinaria: formState.selectedMaquinaria
    });
    
    if (validationError) {
      toast.error(validationError);
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
