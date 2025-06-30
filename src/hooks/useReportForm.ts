
import { useState } from 'react';
import { useMachine } from '@/context/MachineContext';
import { useAuth } from '@/context/AuthContext';
import { useReportFormSubmission } from './useReportFormSubmission';
import { useReportFormStateManagement } from './useReportFormStateManagement';
import { useReportFormEventHandlers } from './useReportFormEventHandlers';
import { toast } from "sonner";

export const useReportForm = () => {
  const {
    reportType, setReportType,
    reportDate, setReportDate,
    description, setDescription,
    trips, setTrips,
    hours, setHours,
    value, setValue,
    workSite, setWorkSite,
    origin, setOrigin,
    selectedCliente, setSelectedCliente,
    selectedFinca, setSelectedFinca,
    maintenanceValue, setMaintenanceValue,
    cantidadM3, setCantidadM3,
    proveedor, setProveedor,
    kilometraje, setKilometraje,
    tipoMateria, setTipoMateria,
    selectedMaquinaria, setSelectedMaquinaria,
    showSuccess, setShowSuccess,
    lastSubmitSuccess, setLastSubmitSuccess,
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    resetForm
  } = useReportFormStateManagement();

  const {
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination,
    handleReportTypeChange,
    handleReportDateChange,
    handleDescriptionChange,
    handleTripsChange,
    handleHoursChange,
    handleValueChange,
    handleWorkSiteChange,
    handleOriginChange,
    handleSelectedClienteChange,
    handleSelectedFincaChange,
    handleMaintenanceValueChange,
    handleCantidadM3Change,
    handleProveedorChange,
    handleKilometrajeChange,
    handleTipoMateriaChange,
  } = useReportFormEventHandlers(
    setReportType,
    setReportDate,
    setDescription,
    setTrips,
    setHours,
    setValue,
    setWorkSite,
    setOrigin,
    setSelectedCliente,
    setSelectedFinca,
    setMaintenanceValue,
    setCantidadM3,
    setProveedor,
    setKilometraje,
    setTipoMateria
  );

  const { selectedMachine } = useMachine();
  const { user } = useAuth();
  const { submitReport, isSubmitting } = useReportFormSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Por favor selecciona una máquina');
      return;
    }

    // Validaciones básicas
    if (reportType === 'Horas Trabajadas' && (!hours || hours <= 0)) {
      toast.error('Por favor ingresa las horas trabajadas');
      return;
    }

    if (reportType === 'Horas Extras' && (!hours || hours <= 0)) {
      toast.error('Por favor ingresa las horas extras');
      return;
    }

    if (reportType === 'Viajes' && (!trips || trips <= 0)) {
      toast.error('Por favor ingresa el número de viajes');
      return;
    }

    if ((reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') && !workSite) {
      toast.error('Por favor selecciona el cliente/sitio de trabajo');
      return;
    }

    // Determinar destino para viajes
    let destination = '';
    if (reportType === 'Viajes' && selectedCliente) {
      destination = selectedFinca 
        ? `${selectedCliente} - ${selectedFinca}`
        : selectedCliente;
    }

    // Usar el valor del mantenimiento si es reporte de mantenimiento
    const finalValue = reportType === 'Mantenimiento' ? maintenanceValue : value;

    console.log('📤 Enviando reporte:', {
      reportType,
      machineId: selectedMachine.id,
      machineName: selectedMachine.name,
      description,
      reportDate,
      trips,
      hours,
      value: finalValue,
      workSite,
      origin,
      destination,
      cantidadM3,
      proveedor,
      kilometraje
    });

    const success = await submitReport(
      selectedMachine.id,
      selectedMachine.name,
      reportType,
      description,
      reportDate,
      trips,
      hours,
      finalValue,
      workSite,
      origin,
      destination,
      cantidadM3,
      proveedor,
      kilometraje
    );

    if (success) {
      setShowSuccess(true);
      setLastSubmitSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setLastSubmitSuccess(false);
      }, 3000);
      
      // Reset form
      resetForm();
    }
  };

  return {
    // Form state
    reportType,
    setReportType,
    reportDate,
    setReportDate,
    description,
    setDescription,
    trips,
    setTrips,
    hours,
    setHours,
    value,
    setValue,
    workSite,
    setWorkSite,
    origin,
    setOrigin,
    selectedCliente,
    setSelectedCliente,
    selectedFinca,
    setSelectedFinca,
    maintenanceValue,
    setMaintenanceValue,
    cantidadM3,
    setCantidadM3,
    proveedor,
    setProveedor,
    kilometraje,
    setKilometraje,
    tipoMateria,
    setTipoMateria,
    selectedMaquinaria,
    setSelectedMaquinaria,
    showSuccess,
    lastSubmitSuccess,
    isSubmitting,
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    user,
    selectedMachine,
    
    // Form handlers
    handleSubmit,
    resetForm,
    handleReportTypeChange,
    handleReportDateChange,
    handleDescriptionChange,
    handleTripsChange,
    handleHoursChange,
    handleValueChange,
    handleWorkSiteChange,
    handleOriginChange,
    handleSelectedClienteChange,
    handleSelectedFincaChange,
    handleMaintenanceValueChange,
    handleCantidadM3Change,
    handleProveedorChange,
    handleKilometrajeChange,
    handleTipoMateriaChange,
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination,
  };
};
