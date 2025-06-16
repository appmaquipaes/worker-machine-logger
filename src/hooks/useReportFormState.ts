
import { useState } from 'react';
import { ReportType } from '@/types/report';

export const useReportFormState = () => {
  const [reportType, setReportType] = useState<ReportType>('Horas Trabajadas');
  const [description, setDescription] = useState('');
  const [trips, setTrips] = useState<number | undefined>(undefined);
  const [hours, setHours] = useState<number | undefined>(undefined);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [reportDate, setReportDate] = useState<Date>(new Date());
  const [workSite, setWorkSite] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [selectedCliente, setSelectedCliente] = useState<string>('');
  const [selectedFinca, setSelectedFinca] = useState<string>('');
  const [maintenanceValue, setMaintenanceValue] = useState<number | undefined>(undefined);
  const [cantidadM3, setCantidadM3] = useState<number | undefined>(15);
  const [proveedor, setProveedor] = useState<string>('');
  const [kilometraje, setKilometraje] = useState<number | undefined>(undefined);
  const [tipoMateria, setTipoMateria] = useState<string>('');
  const [selectedMaquinaria, setSelectedMaquinaria] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitSuccess, setLastSubmitSuccess] = useState(false);

  const clearForm = () => {
    setDescription('');
    setTrips(undefined);
    setHours(undefined);
    setValue(undefined);
    setWorkSite('');
    setOrigin('');
    setSelectedCliente('');
    setSelectedFinca('');
    setDestination('');
    setMaintenanceValue(undefined);
    setCantidadM3(15);
    setProveedor('');
    setKilometraje(undefined);
    setTipoMateria('');
    setSelectedMaquinaria('');
  };

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
    isSubmitting, setIsSubmitting,
    lastSubmitSuccess, setLastSubmitSuccess,
    clearForm
  };
};
