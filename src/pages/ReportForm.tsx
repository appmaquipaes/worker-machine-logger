
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useReport, ReportType } from '@/context/ReportContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { DatePicker } from '@/components/DatePicker';

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
    
    // Limpiar el formulario
    setDescription('');
    setTrips(undefined);
    setHours(undefined);
    setValue(undefined);
    setWorkSite('');
    setOrigin('');
    setDestination('');
    
    // Opcional: redirigir al dashboard después de enviar
    // navigate('/dashboard');
  };
  
  const isShowingTripInput = reportType === 'Viajes' && selectedMachine?.type === 'Camión';
  const shouldShowHoursInput = reportType === 'Horas Trabajadas' || reportType === 'Horas Extras' || reportType === 'Mantenimiento';
  const shouldShowValueInput = reportType === 'Combustible';
  const shouldShowWorkSiteInput = reportType === 'Horas Trabajadas' && selectedMachine?.type !== 'Camión';
  const shouldShowOriginDestination = reportType === 'Viajes' && selectedMachine?.type === 'Camión';
  
  if (!user || !selectedMachine) return null;
  
  return (
    <div className="container max-w-xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Enviar Reporte</CardTitle>
          <CardDescription>
            Máquina: <span className="font-medium">{selectedMachine.name}</span>
            {selectedMachine.plate && (
              <span className="ml-2">({selectedMachine.plate})</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="report-date">Fecha del Reporte</Label>
              <DatePicker date={reportDate} setDate={setReportDate} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="report-type">Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={(value) => setReportType(value as ReportType)}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Seleccione tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Horas Trabajadas">Horas Trabajadas</SelectItem>
                  <SelectItem value="Horas Extras">Horas Extras</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="Combustible">Combustible</SelectItem>
                  <SelectItem value="Novedades">Novedades</SelectItem>
                  {selectedMachine.type === 'Camión' && (
                    <SelectItem value="Viajes">Viajes</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {shouldShowWorkSiteInput && (
              <div className="space-y-2">
                <Label htmlFor="work-site">Sitio de Trabajo</Label>
                <Input 
                  id="work-site"
                  type="text"
                  placeholder="Ej: Obra Norte"
                  value={workSite}
                  onChange={(e) => setWorkSite(e.target.value)}
                  required
                />
              </div>
            )}
            
            {isShowingTripInput && (
              <div className="space-y-2">
                <Label htmlFor="trips">Número de Viajes</Label>
                <Input 
                  id="trips"
                  type="number"
                  min="1"
                  placeholder="Ej: 5"
                  value={trips === undefined ? '' : trips}
                  onChange={(e) => setTrips(parseInt(e.target.value) || undefined)}
                />
              </div>
            )}
            
            {shouldShowOriginDestination && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="origin">Origen</Label>
                  <Input 
                    id="origin"
                    type="text"
                    placeholder="Lugar de origen"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Input 
                    id="destination"
                    type="text"
                    placeholder="Lugar de destino"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            
            {shouldShowHoursInput && (
              <div className="space-y-2">
                <Label htmlFor="hours">Número de Horas</Label>
                <Input 
                  id="hours"
                  type="number"
                  min="1"
                  step="0.5"
                  placeholder="Ej: 8"
                  value={hours === undefined ? '' : hours}
                  onChange={(e) => setHours(parseFloat(e.target.value) || undefined)}
                />
              </div>
            )}
            
            {shouldShowValueInput && (
              <div className="space-y-2">
                <Label htmlFor="value">Valor del Combustible</Label>
                <Input 
                  id="value"
                  type="number"
                  min="1"
                  placeholder="Ej: 50000"
                  value={value === undefined ? '' : value}
                  onChange={(e) => setValue(parseFloat(e.target.value) || undefined)}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Ingrese los detalles del reporte"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
              />
            </div>
            
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancelar
              </Button>
              <Button type="submit">
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
