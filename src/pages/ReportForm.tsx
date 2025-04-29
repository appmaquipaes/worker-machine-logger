
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
  AlarmClock, 
  Wrench as ToolIcon, 
  Fuel, 
  Info, 
  Truck,
  Calendar,
  MapPin,
  Save,
  Send
} from 'lucide-react';
import { Material, loadMateriales } from '@/models/Materiales';
import { CompraMaterial, createCompraMaterial, loadComprasMaterial, saveComprasMaterial } from '@/models/ComprasMaterial';
import { InventarioAcopio, loadInventarioAcopio, saveInventarioAcopio, updateInventarioAfterCompra } from '@/models/InventarioAcopio';
import { loadTarifas } from '@/models/Tarifas';

// Constante para el destino especial que activa la automatización
const ACOPIO_DESTINO = "ACOPIO MAQUIPAES";

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
  const [maintenanceValue, setMaintenanceValue] = useState<number | undefined>(undefined);
  const [cantidadM3, setCantidadM3] = useState<number | undefined>(undefined);
  
  // Nuevos estados para cargar datos de materiales y tarifas
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [tarifas, setTarifas] = useState<any[]>([]);
  
  // Cargar materiales y tarifas al montar el componente
  useEffect(() => {
    setMateriales(loadMateriales());
    setTarifas(loadTarifas());
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
  
  // Función para actualizar inventario cuando el destino es el acopio
  const procesarCompraAcopio = (
    fecha: Date,
    origen: string,
    tipoMaterial: string,
    cantidadM3: number
  ) => {
    try {
      // 1. Buscar datos adicionales (valores predefinidos)
      const material = materiales.find(m => m.nombre_material === tipoMaterial);
      const tarifa = tarifas.find(t => 
        t.origen.toLowerCase() === origen.toLowerCase() && 
        t.destino.toLowerCase() === ACOPIO_DESTINO.toLowerCase()
      );
      
      // 2. Determinar valores
      const valorPorM3 = material ? material.valor_por_m3 : 0;
      const valorFlete = tarifa ? tarifa.valor_por_m3 * cantidadM3 : 0;
      
      // 3. Crear compra en compras_material
      const nuevaCompra = createCompraMaterial(
        fecha,
        origen,
        tipoMaterial,
        cantidadM3,
        valorPorM3,
        valorFlete
      );
      
      // Guardar la compra en localStorage
      const comprasExistentes = loadComprasMaterial();
      const comprasActualizadas = [...comprasExistentes, nuevaCompra];
      saveComprasMaterial(comprasActualizadas);
      
      // 4. Actualizar inventario
      const inventarioExistente = loadInventarioAcopio();
      const inventarioActualizado = updateInventarioAfterCompra(
        inventarioExistente,
        {
          tipo_material: tipoMaterial,
          cantidad_m3: cantidadM3,
          costo_unitario_total: nuevaCompra.costo_unitario_total
        }
      );
      saveInventarioAcopio(inventarioActualizado);
      
      console.log('Compra e inventario actualizados automáticamente:', {
        compra: nuevaCompra,
        inventario: inventarioActualizado
      });
      
      toast.success('Material registrado en inventario automáticamente');
    } catch (error) {
      console.error('Error al procesar compra de material:', error);
      toast.error('Error al actualizar el inventario');
    }
  };
  
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

      // Validar cantidad de m3 transportados para viajes
      if (cantidadM3 === undefined || cantidadM3 <= 0) {
        toast.error('Debe ingresar una cantidad válida de m³ transportados');
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

    // Add validation for maintenance value
    if (reportType === 'Mantenimiento' && (maintenanceValue === undefined || maintenanceValue <= 0)) {
      toast.error('Debe ingresar un valor válido para el mantenimiento');
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
      (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') ? hours : undefined,
      reportType === 'Combustible' ? value : 
      reportType === 'Mantenimiento' ? maintenanceValue : undefined,
      (reportType === 'Horas Trabajadas' && selectedMachine.type !== 'Camión') ? workSite : undefined,
      (reportType === 'Viajes' && selectedMachine.type === 'Camión') ? origin : undefined,
      (reportType === 'Viajes' && selectedMachine.type === 'Camión') ? destination : undefined,
      (reportType === 'Viajes' && selectedMachine.type === 'Camión') ? cantidadM3 : undefined
    );
    
    // Procesar actualización automática de inventario si es un viaje al acopio
    if (reportType === 'Viajes' && 
        destination.trim().toUpperCase() === ACOPIO_DESTINO.toUpperCase() && 
        cantidadM3 !== undefined && 
        cantidadM3 > 0) {
      procesarCompraAcopio(
        reportDate,
        origin,
        description, // Asumimos que la descripción contiene el tipo de material
        cantidadM3
      );
    }
    
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
    setMaintenanceValue(undefined);
    setCantidadM3(undefined);
    
    // Opcional: redirigir al dashboard después de enviar
    navigate('/dashboard');
  };
  
  const isShowingTripInput = reportType === 'Viajes' && selectedMachine?.type === 'Camión';
  const shouldShowHoursInput = (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras');
  const shouldShowValueInput = reportType === 'Combustible';
  const shouldShowWorkSiteInput = reportType === 'Horas Trabajadas' && selectedMachine?.type !== 'Camión';
  const shouldShowOriginDestination = reportType === 'Viajes' && selectedMachine?.type === 'Camión';
  
  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'Horas Trabajadas':
        return <Clock size={28} />;
      case 'Horas Extras':
        return <AlarmClock size={28} />;
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
          Máquina: <span className="font-bold">{selectedMachine?.name}</span>
          {selectedMachine?.plate && (
            <span className="ml-2">({selectedMachine.plate})</span>
          )}
        </p>
        
        <Button 
          variant="back" 
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
                  <AlarmClock size={36} />
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
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck size={24} />
                    <Label htmlFor="cantidad-m3" className="text-lg">Cantidad de m³ Transportados</Label>
                  </div>
                  <Input 
                    id="cantidad-m3"
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="Ej: 6"
                    value={cantidadM3 === undefined ? '' : cantidadM3}
                    onChange={(e) => setCantidadM3(parseFloat(e.target.value) || undefined)}
                    className="text-lg p-6"
                    required
                  />
                  {destination.trim().toUpperCase() === ACOPIO_DESTINO.toUpperCase() && (
                    <p className="text-sm text-green-600 mt-1">
                      ⚠️ Este material será registrado automáticamente en el inventario de acopio
                    </p>
                  )}
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

            {reportType === 'Mantenimiento' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <ToolIcon size={24} />
                  <Label htmlFor="maintenance-value" className="text-lg">Valor del Mantenimiento</Label>
                </div>
                <Input 
                  id="maintenance-value"
                  type="number"
                  min="1"
                  placeholder="Ej: 100000"
                  value={maintenanceValue === undefined ? '' : maintenanceValue}
                  onChange={(e) => setMaintenanceValue(parseFloat(e.target.value) || undefined)}
                  className="text-lg p-6"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                {getReportTypeIcon(reportType)}
                <Label htmlFor="description" className="text-lg">
                  {reportType === 'Viajes' ? 'Tipo de Material' : 'Descripción'}
                </Label>
              </div>
              <Textarea
                id="description"
                placeholder={reportType === 'Viajes' ? "Ingrese el tipo de material transportado" : "Ingrese los detalles del reporte"}
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
                variant="back" 
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
