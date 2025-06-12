import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport, ReportType } from '@/context/ReportContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmitSuccess, setLastSubmitSuccess] = useState(false);
  
  // Cargar proveedores, tipos de materia e inventario
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

  // Manejar cambio de cliente para viajes (workSite)
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    setIsSubmitting(true);
    
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
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Preparar descripción final solo para Novedades
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
      
      // Mostrar confirmación prominente
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
      
      // Limpiar el formulario PERO mantener al usuario en la pantalla
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
      
      // Ocultar la alerta de éxito después de 8 segundos
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

      {/* Alerta de éxito prominente */}
      {lastSubmitSuccess && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <AlertTitle className="text-xl font-bold">¡REGISTRO EXITOSO!</AlertTitle>
          <AlertDescription className="text-lg">
            Su reporte de <strong>{reportType}</strong> ha sido registrado correctamente en el sistema.
            Puede continuar registrando más reportes o volver al menú principal.
          </AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ReportTypeSelector 
              reportType={reportType}
              onReportTypeChange={setReportType}
              selectedMachine={selectedMachine}
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
                disabled={isSubmitting}
              >
                <ArrowLeft size={24} />
                Volver al Menú
              </Button>
              
              <Button 
                type="submit"
                className="flex items-center gap-2 text-lg py-6 px-8 bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <AlertCircle size={24} className="animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <Send size={24} />
                    Registrar Reporte
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;
