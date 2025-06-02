
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport, ReportType } from '@/context/ReportContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "sonner";
import { ArrowLeft, Send } from 'lucide-react';
import { loadProveedores, getUniqueProviderMaterialTypes } from '@/models/Proveedores';
import { getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import ReportTypeSelector from '@/components/ReportTypeSelector';
import ReportInputFields from '@/components/ReportInputFields';
import { validateReportForm } from '@/utils/reportValidation';

const ReportForm = () => {
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
  
  // Cargar proveedores, tipos de materia e inventario
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [tiposMaterial, setTiposMaterial] = useState<string[]>([]);
  const [inventarioAcopio, setInventarioAcopio] = useState<any[]>([]);
  
  useEffect(() => {
    setProveedores(loadProveedores());
    setTiposMaterial(getUniqueProviderMaterialTypes());
    
    // Cargar inventario de acopio para mostrar materiales disponibles
    const inventario = localStorage.getItem('inventario_acopio');
    if (inventario) {
      setInventarioAcopio(JSON.parse(inventario));
    }
  }, []);
  
  // Redirigir si no hay un usuario autenticado o no se ha seleccionado una máquina
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

  // Manejar cambio de cliente para viajes (workSite)
  const handleClienteChangeForWorkSite = (cliente: string) => {
    setWorkSite(cliente);
  };

  // Manejar cambio de cliente para viajes (destino)
  const handleClienteChangeForDestination = (cliente: string) => {
    setSelectedCliente(cliente);
    setSelectedFinca(''); // Reset finca selection
    
    // Verificar si el cliente tiene fincas
    if (cliente) {
      const clienteData = getClienteByName(cliente);
      if (clienteData) {
        const fincas = getFincasByCliente(clienteData.id);
        if (fincas.length === 0) {
          // Si no tiene fincas, usar el nombre del cliente como destino
          setDestination(cliente);
        } else {
          // Si tiene fincas, limpiar el destino para que se seleccione una finca
          setDestination('');
        }
      }
    } else {
      setDestination('');
    }
  };

  // Manejar cambio de finca para viajes (destino)
  const handleFincaChangeForDestination = (finca: string) => {
    setSelectedFinca(finca);
    setDestination(finca);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    // Validar formulario usando la utilidad
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
      inventarioAcopio
    });
    
    if (validationError) {
      toast.error(validationError);
      return;
    }
    
    // Preparar descripción y destino final
    const reportDescription = (reportType === 'Viajes' && origin === 'Acopio Maquipaes') 
      ? tipoMateria 
      : description;
    
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
    
    // Mostrar confirmación
    toast.success('¡Reporte enviado con éxito!');
    
    // Limpiar el formulario
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
    
    // Redirigir al dashboard
    navigate('/dashboard');
  };
  
  if (!user || !selectedMachine) return null;
  
  return (
    <div className="container max-w-xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Enviar Reporte</h1>
        <p className="text-xl mt-2">
          Máquina: <span className="font-bold">{selectedMachine?.name}</span>
          {selectedMachine?.plate && (
            <span className="ml-2">({selectedMachine.plate})</span>
          )}
        </p>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-lg mt-4 mx-auto"
        >
          <ArrowLeft size={24} />
          Volver al inicio
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ReportTypeSelector 
              reportType={reportType}
              onReportTypeChange={setReportType}
            />
            
            <ReportInputFields
              reportType={reportType}
              reportDate={reportDate}
              setReportDate={setReportDate}
              description={description}
              setDescription={setDescription}
              trips={trips}
              setTrips={setTrips}
              hours={hours}
              setHours={setHours}
              value={value}
              setValue={setValue}
              workSite={workSite}
              setWorkSite={setWorkSite}
              origin={origin}
              setOrigin={setOrigin}
              selectedCliente={selectedCliente}
              setSelectedCliente={setSelectedCliente}
              selectedFinca={selectedFinca}
              setSelectedFinca={setSelectedFinca}
              maintenanceValue={maintenanceValue}
              setMaintenanceValue={setMaintenanceValue}
              cantidadM3={cantidadM3}
              setCantidadM3={setCantidadM3}
              proveedor={proveedor}
              setProveedor={setProveedor}
              kilometraje={kilometraje}
              setKilometraje={setKilometraje}
              tipoMateria={tipoMateria}
              setTipoMateria={setTipoMateria}
              proveedores={proveedores}
              tiposMaterial={tiposMaterial}
              inventarioAcopio={inventarioAcopio}
              onClienteChangeForWorkSite={handleClienteChangeForWorkSite}
              onClienteChangeForDestination={handleClienteChangeForDestination}
              onFincaChangeForDestination={handleFincaChangeForDestination}
            />
            
            <div className="flex justify-between pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-lg py-6 px-6"
              >
                <ArrowLeft size={24} />
                Cancelar
              </Button>
              
              <Button 
                type="submit"
                className="flex items-center gap-2 text-lg py-6 px-8"
              >
                <Send size={24} />
                Enviar Reporte
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;
