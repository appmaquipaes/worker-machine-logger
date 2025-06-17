
import { useState, useEffect } from 'react';
import { ReportType } from '@/types/report';
import { loadProveedores, getUniqueProviderMaterialTypes } from '@/models/Proveedores';

export const useReportFormState = () => {
  const [reportType, setReportType] = useState<ReportType>('Horas Trabajadas');
  const [description, setDescription] = useState('');
  const [trips, setTrips] = useState<number | undefined>(undefined);
  const [hours, setHours] = useState<number | undefined>(undefined);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [reportDate, setReportDate] = useState<Date>(new Date());
  const [workSite, setWorkSite] = useState<string>('');
  const [origin, setOrigin] = useState<string>('');
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
  const [tipoVolqueta, setTipoVolqueta] = useState<'Sencilla' | 'Doble Troque'>('Sencilla');
  
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [tiposMaterial, setTiposMaterial] = useState<string[]>([]);
  const [inventarioAcopio, setInventarioAcopio] = useState<any[]>([]);

  useEffect(() => {
    setProveedores(loadProveedores());
    setTiposMaterial(getUniqueProviderMaterialTypes());
    
    const inventario = localStorage.getItem('inventario_acopio');
    if (inventario) {
      setInventarioAcopio(JSON.parse(inventario));
    }
  }, []);

  const clearForm = () => {
    setDescription('');
    setTrips(undefined);
    setHours(undefined);
    setValue(undefined);
    setWorkSite('');
    setOrigin('');
    setSelectedCliente('');
    setSelectedFinca('');
    setMaintenanceValue(undefined);
    setCantidadM3(15);
    setProveedor('');
    setKilometraje(undefined);
    setTipoMateria('');
    setSelectedMaquinaria('');
    setTipoVolqueta('Sencilla');
  };

  return {
    // State values
    reportType, setReportType,
    description, setDescription,
    trips, setTrips,
    hours, setHours,
    value, setValue,
    reportDate, setReportDate,
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
    isSubmitting, setIsSubmitting,
    lastSubmitSuccess, setLastSubmitSuccess,
    tipoVolqueta, setTipoVolqueta,
    
    // Data
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    
    // Actions
    clearForm,
  };
};
