
import { useReportFormState } from './useReportFormState';
import { useReportFormData } from './useReportFormData';
import { useReportFormHandlers } from './useReportFormHandlers';
import { useReportFormSubmit } from './useReportFormSubmit';
import { useReportFormAuth } from './useReportFormAuth';

export const useReportForm = () => {
  const { user, selectedMachine } = useReportFormAuth();
  
  const {
    reportType, setReportType,
    description, setDescription,
    trips, setTrips,
    hours, setHours,
    value, setValue,
    reportDate, setReportDate,
    workSite, setWorkSite,
    origin, setOrigin,
    destination,
    selectedCliente, setSelectedCliente,
    selectedFinca, setSelectedFinca,
    maintenanceValue, setMaintenanceValue,
    cantidadM3, setCantidadM3,
    proveedor, setProveedor,
    kilometraje, setKilometraje,
    tipoMateria, setTipoMateria,
    selectedMaquinaria, setSelectedMaquinaria,
    isSubmitting, setIsSubmitting,
    lastSubmitSuccess, setLastSubmitSuccess,
    clearForm
  } = useReportFormState();
  
  const {
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    materiales
  } = useReportFormData();
  
  const {
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination
  } = useReportFormHandlers(
    setWorkSite,
    setSelectedCliente,
    setSelectedFinca,
    (value: string) => {
      // This is a bit of a hack since destination is computed, but we need to handle the setter
      // The actual destination value is computed in the handlers
    }
  );
  
  const { handleSubmit } = useReportFormSubmit({
    reportType,
    description,
    trips,
    hours,
    value,
    reportDate,
    workSite,
    origin,
    selectedCliente,
    selectedFinca,
    maintenanceValue,
    cantidadM3,
    proveedor,
    kilometraje,
    tipoMateria,
    selectedMaquinaria,
    inventarioAcopio,
    setIsSubmitting,
    setLastSubmitSuccess,
    clearForm
  });

  return {
    reportType, setReportType,
    description, setDescription,
    trips, setTrips,
    hours, setHours,
    value, setValue,
    reportDate, setReportDate,
    workSite, setWorkSite,
    origin, setOrigin,
    destination,
    selectedCliente, setSelectedCliente,
    selectedFinca, setSelectedFinca,
    maintenanceValue, setMaintenanceValue,
    cantidadM3, setCantidadM3,
    proveedor, setProveedor,
    kilometraje, setKilometraje,
    tipoMateria, setTipoMateria,
    selectedMaquinaria, setSelectedMaquinaria,
    isSubmitting,
    lastSubmitSuccess,
    
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    materiales,
    
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination,
    handleSubmit,
    
    user,
    selectedMachine
  };
};
