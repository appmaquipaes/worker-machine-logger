
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport, ReportType } from '@/context/ReportContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { DatePicker } from '@/components/DatePicker';
import { 
  ArrowLeft, 
  Clock, 
  Alarm, 
  Wrench as ToolIcon, 
  Fuel, 
  Info, 
  Truck,
  Calendar,
  MapPin,
  Save,
  Send
} from 'lucide-react';

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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    if (!description.trim()) {
      toast.error('La descripción no puede estar vacía');
      return;
    }
    
    // Si el tipo de reporte es "Viajes" y es un camión, validar el número de viajes
    if (reportType === 'Viajes') {
      if (trips === undefined || trips <= 0) {
        toast.error('Debe ingresar un número válido de viajes');
        return;
      }
      
      // Para todos los camiones (volquetas), validar origen y destino
      if (selectedMachine.type === 'Camión' && (!origin.trim() || !destination.trim())) {
        toast.error('Debe ingresar el origen y destino del viaje');
        return;
      }
    }
    
    // Validar el número de horas para tipos de reporte relevantes
    if (shouldShowHoursInput && (hours === undefined || hours <= 0)) {
      toast.error('Debe ingresar un número válido de horas');
      return;
    }
    
    // Validar el sitio de trabajo para horas trabajadas (solo para máquinas que no son camiones)
    if (reportType === 'Horas Trabajadas' && selectedMachine.type !== 'Camión' && !workSite.trim()) {
      toast.error('Debe ingresar el sitio de trabajo');
      return;
    }
    
    // Validar el valor para reportes de combustible
    if (reportType === 'Combustible' && (value === undefined || value <= 0)) {
      toast.error('Debe ingresar un valor válido para el combustible');
      return;
    }
    
    // Enviar el reporte
    addReport(
      selectedMachine.id,
      selectedMachine.name,
      reportType,
      description,
      reportDate,
      reportType === 'Viajes' ? trips : undefined,
      shouldShowHoursInput ? hours : undefined,
      reportType === 'Combustible' ? value : undefined,
      (reportType === 'Horas Trabajadas' && selectedMachine.type !== 'Camión') ? workSite : undefined,
      (reportType === 'Viajes' && selectedMachine.type === 'Camión') ? origin : undefined,
      (reportType === 'Viajes' && selectedMachine.type === 'Camión') ? destination : undefined
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
    setDestination('');
    
    // Opcional: redirigir al dashboard después de enviar
    navigate('/dashboard');
  };
  
  const isShowingTripInput = reportType === 'Viajes' && selectedMachine?.type === 'Camión';
  const shouldShowHoursInput = reportType === 'Horas Trabajadas' || reportType === 'Horas Extras' || reportType === 'Mantenimiento';
  const shouldShowValueInput = reportType === 'Combustible';
  const shouldShowWorkSiteInput = reportType === 'Horas Trabajadas' && selectedMachine?.type !== 'Camión';
  const shouldShowOriginDestination = reportType === 'Viajes' && selectedMachine?.type === 'Camión';
  
  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'Horas Trabajadas':
        return <Clock size={28} />;
      case 'Horas Extras':
        return <Alarm size={28} />;
      case 'Mantenimiento':
        return <ToolIcon size={28} />;
      case 'Combustible':
        return <Fuel size={28} />;
      case 'Viajes':
        return <Truck size={28} />;
      case 'Novedades':
        return <Info size={28} />;
      default:
        return <Info size={28} />;
    }
  };
  
  if (!user || !selectedMachine) return null;
  
  return (
    <div className="container max-w-xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Enviar Reporte</h1>
        <p className="text-xl mt-2">
          Máquina: <span className="font-bold">{selectedMachine.name}</span>
          {selectedMachine.plate && (
            <span className="ml-2">({selectedMachine.plate})</span>
          )}
        </p>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-lg mt-4"
        >
          <ArrowLeft size={24} />
          Volver al inicio
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={24} />
                <Label htmlFor="report-date" className="text-lg">Fecha del Reporte</Label>
              </div>
              <DatePicker date={reportDate} setDate={setReportDate} />
            </div>
            
            <div className="space-y-2">
              <p className="text-lg font-medium mb-4">Selecciona el tipo de reporte:</p>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  type="button"
                  variant={reportType === 'Horas Trabajadas' ? 'default' : 'outline'}
                  className={`flex flex-col items-center gap-2 h-auto py-4 ${
                    reportType === 'Horas Trabajadas' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setReportType('Horas Trabajadas')}
                >
                  <Clock size={36} />
                  <span className="text-lg">Horas Trabajadas</span>
                </Button>
                
                <Button
                  type="button"
                  variant={reportType === 'Horas Extras' ? 'default' : 'outline'}
                  className={`flex flex-col items-center gap-2 h-auto py-4 ${
                    reportType === 'Horas Extras' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setReportType('Horas Extras')}
                >
                  <Alarm size={36} />
                  <span className="text-lg">Horas Extras</span>
                </Button>
                
                <Button
                  type="button"
                  variant={reportType === 'Mantenimiento' ? 'default' : 'outline'}
                  className={`flex flex-col items-center gap-2 h-auto py-4 ${
                    reportType === 'Mantenimiento' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setReportType('Mantenimiento')}
                >
                  <ToolIcon size={36} />
                  <span className="text-lg">Mantenimiento</span>
                </Button>
                
                <Button
                  type="button"
                  variant={reportType === 'Combustible' ? 'default' : 'outline'}
                  className={`flex flex-col items-center gap-2 h-auto py-4 ${
                    reportType === 'Combustible' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setReportType('Combustible')}
                >
                  <Fuel size={36} />
                  <span className="text-lg">Combustible</span>
                </Button>
                
                <Button
                  type="button"
                  variant={reportType === 'Novedades' ? 'default' : 'outline'}
                  className={`flex flex-col items-center gap-2 h-auto py-4 ${
                    reportType === 'Novedades' ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setReportType('Novedades')}
                >
                  <Info size={36} />
                  <span className="text-lg">Novedades</span>
                </Button>
                
                {selectedMachine.type === 'Camión' && (
                  <Button
                    type="button"
                    variant={reportType === 'Viajes' ? 'default' : 'outline'}
                    className={`flex flex-col items-center gap-2 h-auto py-4 ${
                      reportType === 'Viajes' ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setReportType('Viajes')}
                  >
                    <Truck size={36} />
                    <span className="text-lg">Viajes</span>
                  </Button>
                )}
              </div>
            </div>
            
            {shouldShowWorkSiteInput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={24} />
                  <Label htmlFor="work-site" className="text-lg">Sitio de Trabajo</Label>
                </div>
                <Input 
                  id="work-site"
                  type="text"
                  placeholder="Ej: Obra Norte"
                  value={workSite}
                  onChange={(e) => setWorkSite(e.target.value)}
                  className="text-lg p-6"
                  required
                />
              </div>
            )}
            
            {isShowingTripInput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={24} />
                  <Label htmlFor="trips" className="text-lg">Número de Viajes</Label>
                </div>
                <Input 
                  id="trips"
                  type="number"
                  min="1"
                  placeholder="Ej: 5"
                  value={trips === undefined ? '' : trips}
                  onChange={(e) => setTrips(parseInt(e.target.value) || undefined)}
                  className="text-lg p-6"
                />
              </div>
            )}
            
            {shouldShowOriginDestination && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={24} />
                    <Label htmlFor="origin" className="text-lg">Origen</Label>
                  </div>
                  <Input 
                    id="origin"
                    type="text"
                    placeholder="Lugar de origen"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="text-lg p-6"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={24} />
                    <Label htmlFor="destination" className="text-lg">Destino</Label>
                  </div>
                  <Input 
                    id="destination"
                    type="text"
                    placeholder="Lugar de destino"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="text-lg p-6"
                    required
                  />
                </div>
              </>
            )}
            
            {shouldShowHoursInput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={24} />
                  <Label htmlFor="hours" className="text-lg">Número de Horas</Label>
                </div>
                <Input 
                  id="hours"
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="Ej: 8"
                  value={hours === undefined ? '' : hours}
                  onChange={(e) => setHours(parseFloat(e.target.value) || undefined)}
                  className="text-lg p-6"
                />
              </div>
            )}
            
            {shouldShowValueInput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel size={24} />
                  <Label htmlFor="value" className="text-lg">Valor del Combustible</Label>
                </div>
                <Input 
                  id="value"
                  type="number"
                  min="1"
                  placeholder="Ej: 50000"
                  value={value === undefined ? '' : value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || undefined)}
                  className="text-lg p-6"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                {getReportTypeIcon(reportType)}
                <Label htmlFor="description" className="text-lg">Descripción</Label>
              </div>
              <Textarea
                id="description"
                placeholder="Ingrese los detalles del reporte"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="text-lg p-4"
                required
              />
            </div>
            
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
