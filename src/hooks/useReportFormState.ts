
import { useState, useEffect } from 'react';
import { ReportType } from '@/types/report';
import { loadProveedores } from '@/models/Proveedores';
import { loadMateriales } from '@/models/Materiales';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';

export const useReportFormState = () => {
  const [reportType, setReportType] = useState<ReportType>('Horas Trabajadas');
  const [description, setDescription] = useState('');
  const [trips, setTrips] = useState<number | undefined>(undefined);
  const [hours, setHours] = useState<number | undefined>(undefined);
  const [value, setValue] = useState<number | undefined>(undefined);
  const [reportDate, setReportDate] = useState<Date>(new Date());
  const [workSite, setWorkSite] = useState('');
  const [origin, setOrigin] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('');
  const [selectedFinca, setSelectedFinca] = useState('');
  const [maintenanceValue, setMaintenanceValue] = useState<number | undefined>(undefined);
  const [cantidadM3, setCantidadM3] = useState<number | undefined>(undefined);
  const [proveedor, setProveedor] = useState('');
  const [kilometraje, setKilometraje] = useState<number | undefined>(undefined);
  const [tipoMateria, setTipoMateria] = useState('');
  const [selectedMaquinaria, setSelectedMaquinaria] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitSuccess, setLastSubmitSuccess] = useState(false);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [tiposMaterial, setTiposMaterial] = useState<string[]>([]);
  const [inventarioAcopio, setInventarioAcopio] = useState<any[]>([]);

  useEffect(() => {
    const loadedProveedores = loadProveedores();
    const loadedMateriales = loadMateriales();
    const loadedInventario = loadInventarioAcopio();

    setProveedores(loadedProveedores);
    setTiposMaterial(loadedMateriales.map(m => m.nombre));
    setInventarioAcopio(loadedInventario);
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
    setCantidadM3(undefined);
    setProveedor('');
    setKilometraje(undefined);
    setTipoMateria(''); // Asegurar que se resetee
    setSelectedMaquinaria('');
    setReportDate(new Date());
    console.log('✓ Formulario limpiado correctamente - todos los campos reseteados');
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
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    clearForm,
  };
};
