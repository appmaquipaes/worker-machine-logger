import { useState, useEffect } from 'react';
import { ReportType } from '@/types/report';
import { useMachine } from '@/context/MachineContext';
import { useReportFormSubmission } from './useReportFormSubmission';
import { toast } from "sonner";

export const useReportForm = () => {
  const [reportType, setReportType] = useState<ReportType>('Horas Trabajadas');
  const [reportDate, setReportDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const [trips, setTrips] = useState<number | undefined>();
  const [hours, setHours] = useState<number | undefined>();
  const [value, setValue] = useState<number | undefined>();
  const [workSite, setWorkSite] = useState('');
  const [origin, setOrigin] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedFinca, setSelectedFinca] = useState('');
  const [maintenanceValue, setMaintenanceValue] = useState<number | undefined>();
  const [cantidadM3, setCantidadM3] = useState<number | undefined>();
  const [proveedor, setProveedor] = useState('');
  const [kilometraje, setKilometraje] = useState<number | undefined>();
  const [tipoMateria, setTipoMateria] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { selectedMachine } = useMachine();
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
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Reset form
      resetForm();
    }
  };

  const resetForm = () => {
    setDescription('');
    setTrips(undefined);
    setHours(undefined);
    setValue(undefined);
    setWorkSite('');
    setOrigin('');
    setSelectedCliente('');
    setSelectedFinca('');
    setMaintenanceValue(undefined);
    setCantidadM3(undefined);
    setProveedor('');
    setKilometraje(undefined);
    setTipoMateria('');
  };

  const handleReportTypeChange = (value: ReportType) => {
    setReportType(value);
  };

  const handleReportDateChange = (date: Date) => {
    setReportDate(date);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleTripsChange = (value: number | undefined) => {
    setTrips(value);
  };

  const handleHoursChange = (value: number | undefined) => {
    setHours(value);
  };

  const handleValueChange = (value: number | undefined) => {
    setValue(value);
  };

  const handleWorkSiteChange = (value: string) => {
    setWorkSite(value);
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
  };

  const handleSelectedClienteChange = (value: string) => {
    setSelectedCliente(value);
  };

  const handleSelectedFincaChange = (value: string) => {
    setSelectedFinca(value);
  };

  const handleMaintenanceValueChange = (value: number | undefined) => {
    setMaintenanceValue(value);
  };

  const handleCantidadM3Change = (value: number | undefined) => {
    setCantidadM3(value);
  };

  const handleProveedorChange = (value: string) => {
    setProveedor(value);
  };

  const handleKilometrajeChange = (value: number | undefined) => {
    setKilometraje(value);
  };

  const handleTipoMateriaChange = (value: string) => {
    setTipoMateria(value);
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
    showSuccess,
    isSubmitting,
    
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
  };
};
