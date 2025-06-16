import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport } from '@/context/ReportContext';
import { ReportType } from '@/types/report';
import { toast } from "sonner";
import { loadProveedores, getUniqueProviderMaterialTypes } from '@/models/Proveedores';
import { getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { validateReportForm } from '@/utils/reportValidation';

export const useReportForm = () => {
  const { user } = useAuth();
  const { selectedMachine } = useMachine();
  const { addReport } = useReport();
  const navigate = useNavigate();
  
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

  const handleClienteChangeForWorkSite = (cliente: string) => {
    setWorkSite(cliente);
  };

  const handleClienteChangeForDestination = (cliente: string) => {
    setSelectedCliente(cliente);
    setSelectedFinca('');
    
    if (cliente) {
      const clienteData = getClienteByName(cliente);
      if (clienteData) {
        const fincas = getFincasByCliente(clienteData.id);
        if (fincas.length === 0) {
          setDestination(cliente);
        } else {
          setDestination('');
        }
      }
    } else {
      setDestination('');
    }
  };

  const handleFincaChangeForDestination = (finca: string) => {
    setSelectedFinca(finca);
    setDestination(finca);
  };

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    setIsSubmitting(true);
    
    const validationError = validateReportForm({
      reportType,
      description,
      trips,
      hours,
      value,
      origin,
      selectedCliente,
      selectedFinca,
      workSite,
      maintenanceValue,
      cantidadM3,
      proveedor,
      kilometraje,
      tipoMateria,
      inventarioAcopio,
      selectedMaquinaria,
      machineType: selectedMachine.type
    });
    
    if (validationError) {
      toast.error(validationError);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const reportDescription = reportType === 'Novedades' ? description : '';
      const finalDestination = reportType === 'Viajes' 
        ? `${selectedCliente} - ${selectedFinca}`
        : destination;
      
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
      
      setLastSubmitSuccess(true);
      toast.success('¡REPORTE REGISTRADO CON ÉXITO!', {
        duration: 5000,
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
          backgroundColor: '#22c55e',
          color: 'white'
        }
      });
      
      clearForm();
      
      setTimeout(() => {
        setLastSubmitSuccess(false);
      }, 8000);
      
    } catch (error) {
      console.error('Error al enviar reporte:', error);
      toast.error('Error al enviar el reporte. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
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
    isSubmitting,
    lastSubmitSuccess,
    
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination,
    handleSubmit,
    
    user,
    selectedMachine
  };
};
