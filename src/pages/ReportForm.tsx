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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from "sonner";
import { DatePicker } from '@/components/DatePicker';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
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
  Send,
  Gauge
} from 'lucide-react';
import { loadProveedores, getUniqueProviderMaterialTypes } from '@/models/Proveedores';
import { getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';

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
  
  // Función para determinar si es un vehículo de transporte
  const isTransportVehicle = () => {
    return selectedMachine && ['Volqueta', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(selectedMachine.type);
  };

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

  // Manejar cambio de finca para viajes (destino) - ahora maneja tanto fincas como destino automático
  const handleFincaChangeForDestination = (finca: string) => {
    setSelectedFinca(finca);
    setDestination(finca); // El componente ya maneja si es finca real o nombre de cliente
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine) {
      toast.error('Debe seleccionar una máquina');
      return;
    }
    
    if (!description.trim() && !(reportType === 'Viajes' && origin === 'Acopio Maquipaes')) {
      toast.error('La descripción no puede estar vacía');
      return;
    }
    
    // Validaciones específicas para cada tipo de reporte
    if (reportType === 'Viajes') {
      if (trips === undefined || trips <= 0) {
        toast.error('Debe ingresar un número válido de viajes');
        return;
      }
      
      // Validar origen desde proveedores
      if (!origin.trim()) {
        toast.error('Debe seleccionar el origen del viaje');
        return;
      }

      // Validar destino (cliente y finca)
      if (!selectedCliente.trim()) {
        toast.error('Debe seleccionar el cliente destino');
        return;
      }

      if (!selectedFinca.trim()) {
        toast.error('Debe seleccionar la finca destino');
        return;
      }

      // Para viajes desde Acopio Maquipaes, validar material del inventario
      if (origin === 'Acopio Maquipaes') {
        if (!tipoMateria.trim()) {
          toast.error('Debe seleccionar el tipo de material desde el inventario');
          return;
        }
        
        // Validar cantidad de m3 
        if (cantidadM3 === undefined || cantidadM3 <= 0) {
          toast.error('Debe ingresar una cantidad válida de m³ transportados');
          return;
        }
        
        // Verificar que hay suficiente material en inventario
        const materialEnInventario = inventarioAcopio.find(item => item.tipo_material === tipoMateria);
        if (!materialEnInventario) {
          toast.error('El material seleccionado no está disponible en el inventario');
          return;
        }
        
        if (materialEnInventario.cantidad_disponible < cantidadM3) {
          toast.error(`Solo hay ${materialEnInventario.cantidad_disponible} m³ disponibles de ${tipoMateria}`);
          return;
        }
      } else {
        // Para otros orígenes, validar tipo de materia general
        if (!tipoMateria.trim()) {
          toast.error('Debe seleccionar el tipo de materia');
          return;
        }
        
        // Validar cantidad de m3 para vehículos de transporte
        if (isTransportVehicle() && (cantidadM3 === undefined || cantidadM3 <= 0)) {
          toast.error('Debe ingresar una cantidad válida de m³ transportados');
          return;
        }
      }
    }
    
    // Validar horas para tipos de reporte relevantes
    if (shouldShowHoursInput && (hours === undefined || hours <= 0)) {
      toast.error('Debe ingresar un número válido de horas');
      return;
    }
    
    // Validar sitio de trabajo para horas trabajadas
    if (reportType === 'Horas Trabajadas' && !workSite.trim()) {
      toast.error('Debe seleccionar el cliente para el sitio de trabajo');
      return;
    }
    
    // Validar combustible
    if (reportType === 'Combustible') {
      if (value === undefined || value <= 0) {
        toast.error('Debe ingresar un valor válido para el combustible');
        return;
      }
      
      // Validar kilometraje actual
      if (kilometraje === undefined || kilometraje <= 0) {
        toast.error('Debe ingresar el kilometraje actual del vehículo');
        return;
      }
    }

    // Validar mantenimiento
    if (reportType === 'Mantenimiento') {
      if (maintenanceValue === undefined || maintenanceValue <= 0) {
        toast.error('Debe ingresar un valor válido para el mantenimiento');
        return;
      }
      
      // Validar proveedor
      if (!proveedor.trim()) {
        toast.error('Debe seleccionar un proveedor para el mantenimiento');
        return;
      }
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
  
  const isShowingTripInput = reportType === 'Viajes';
  const shouldShowHoursInput = (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras');
  const shouldShowValueInput = reportType === 'Combustible';
  const shouldShowWorkSiteInput = reportType === 'Horas Trabajadas';
  const shouldShowOriginDestination = reportType === 'Viajes';
  const shouldShowM3Input = reportType === 'Viajes' && (isTransportVehicle() || origin === 'Acopio Maquipaes');
  const shouldShowInventoryMaterialSelect = reportType === 'Viajes' && origin === 'Acopio Maquipaes';
  const shouldShowTipoMateriaInput = reportType === 'Viajes' && origin !== 'Acopio Maquipaes';
  const shouldShowKilometrajeInput = reportType === 'Combustible';
  const shouldShowProveedorInput = reportType === 'Mantenimiento';
  
  // Determinar si el cliente tiene fincas
  const clienteData = selectedCliente ? getClienteByName(selectedCliente) : null;
  const fincasDisponibles = clienteData ? getFincasByCliente(clienteData.id) : [];
  const clienteTieneFincas = fincasDisponibles.length > 0;
  
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
              </div>
            </div>
            
            {shouldShowWorkSiteInput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={24} />
                  <Label className="text-lg">Cliente del Sitio de Trabajo</Label>
                </div>
                <ClienteFincaSelector
                  selectedCliente={workSite}
                  selectedFinca=""
                  onClienteChange={handleClienteChangeForWorkSite}
                  onFincaChange={() => {}} // No necesitamos finca para sitio de trabajo
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
                    <Label htmlFor="origin" className="text-lg">Origen (Proveedor)</Label>
                  </div>
                  <Select onValueChange={setOrigin} value={origin}>
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="Selecciona el origen" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedores.map((prov) => (
                        <SelectItem key={prov.id} value={prov.nombre}>
                          {prov.nombre} - {prov.ciudad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={24} />
                    <Label className="text-lg">Destino (Cliente y Finca)</Label>
                  </div>
                  <ClienteFincaSelector
                    selectedCliente={selectedCliente}
                    selectedFinca={selectedFinca}
                    onClienteChange={handleClienteChangeForDestination}
                    onFincaChange={handleFincaChangeForDestination}
                    autoSetDestination={true}
                  />
                </div>
              </>
            )}

            {shouldShowInventoryMaterialSelect && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <ToolIcon size={24} />
                  <Label htmlFor="material-inventario" className="text-lg">Material del Inventario</Label>
                </div>
                <Select onValueChange={setTipoMateria} value={tipoMateria}>
                  <SelectTrigger className="text-lg p-6">
                    <SelectValue placeholder="Selecciona el material del inventario" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventarioAcopio.map((item) => (
                      <SelectItem key={item.id} value={item.tipo_material}>
                        {item.tipo_material} ({item.cantidad_disponible} m³ disponibles)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {shouldShowTipoMateriaInput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <ToolIcon size={24} />
                  <Label htmlFor="tipo-materia" className="text-lg">Tipo de Materia</Label>
                </div>
                <Select onValueChange={setTipoMateria} value={tipoMateria}>
                  <SelectTrigger className="text-lg p-6">
                    <SelectValue placeholder="Selecciona el tipo de materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposMaterial.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {shouldShowM3Input && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Truck size={24} />
                  <Label htmlFor="cantidad-m3" className="text-lg">
                    Cantidad de m³ Transportados
                    {shouldShowInventoryMaterialSelect && tipoMateria && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (Disponibles: {inventarioAcopio.find(item => item.tipo_material === tipoMateria)?.cantidad_disponible || 0} m³)
                      </span>
                    )}
                  </Label>
                </div>
                <Input 
                  id="cantidad-m3"
                  type="number"
                  min="0.1"
                  step="0.1"
                  max={shouldShowInventoryMaterialSelect && tipoMateria ? 
                    inventarioAcopio.find(item => item.tipo_material === tipoMateria)?.cantidad_disponible : undefined}
                  placeholder="Ej: 6"
                  value={cantidadM3 === undefined ? '' : cantidadM3}
                  onChange={(e) => setCantidadM3(parseFloat(e.target.value) || undefined)}
                  className="text-lg p-6"
                  required
                />
              </div>
            )}
            
            {shouldShowKilometrajeInput && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge size={24} />
                  <Label htmlFor="kilometraje" className="text-lg">Kilometraje Actual</Label>
                </div>
                <Input 
                  id="kilometraje"
                  type="number"
                  min="0"
                  placeholder="Ej: 150000"
                  value={kilometraje === undefined ? '' : kilometraje}
                  onChange={(e) => setKilometraje(parseFloat(e.target.value) || undefined)}
                  className="text-lg p-6"
                  required
                />
              </div>
            )}

            {reportType === 'Mantenimiento' && (
              <>
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

                {shouldShowProveedorInput && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <ToolIcon size={24} />
                      <Label htmlFor="proveedor" className="text-lg">Proveedor</Label>
                    </div>
                    <Select onValueChange={setProveedor} value={proveedor}>
                      <SelectTrigger className="text-lg p-6">
                        <SelectValue placeholder="Selecciona un proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {proveedores.map((prov) => (
                          <SelectItem key={prov.id} value={prov.nombre}>
                            {prov.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                {getReportTypeIcon(reportType)}
                <Label htmlFor="description" className="text-lg">
                  {shouldShowInventoryMaterialSelect ? 'Observaciones adicionales' : 'Descripción'}
                </Label>
              </div>
              
              <Textarea
                id="description"
                placeholder={shouldShowInventoryMaterialSelect ? 
                  'Observaciones adicionales del viaje (opcional)' : 
                  'Ingrese los detalles del reporte'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="text-lg p-4"
                required={!shouldShowInventoryMaterialSelect}
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
