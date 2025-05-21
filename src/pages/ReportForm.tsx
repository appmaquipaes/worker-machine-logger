
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
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
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
  Plus,
  Send
} from 'lucide-react';
import { Material, loadMateriales } from '@/models/Materiales';
import { CompraMaterial, createCompraMaterial, loadComprasMaterial, saveComprasMaterial } from '@/models/ComprasMaterial';
import { InventarioAcopio, loadInventarioAcopio, saveInventarioAcopio, updateInventarioAfterCompra } from '@/models/InventarioAcopio';
import { loadTarifas } from '@/models/Tarifas';
import { Proveedor, loadProveedores, saveProveedores, createProveedor } from '@/models/Proveedores';
import { Cliente, loadClientes, saveClientes, createCliente, tiposCliente } from '@/models/Clientes';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';

// Constante para el destino especial que activa la automatización
const ACOPIO_DESTINO = "ACOPIO MAQUIPAES";

// Esquemas de validación con Zod
const proveedorSchema = z.object({
  nombre_proveedor: z.string().min(1, { message: "El nombre del proveedor es obligatorio" }),
  tipo_material: z.string().min(1, { message: "El tipo de material es obligatorio" }),
  cantidad: z.coerce.number().min(0, { message: "La cantidad debe ser un número positivo" }),
  valor_unitario: z.coerce.number().min(0, { message: "El valor debe ser un número positivo" }),
  ciudad: z.string().min(1, { message: "La ciudad es obligatoria" }),
  fecha_compra: z.date(),
  observaciones: z.string().optional()
});

const clienteSchema = z.object({
  nombre_cliente: z.string().min(1, { message: "El nombre del cliente es obligatorio" }),
  ciudad: z.string().min(1, { message: "La ciudad es obligatoria" }),
  contacto_nombre: z.string().min(1, { message: "El nombre del contacto es obligatorio" }),
  contacto_telefono: z.string().min(1, { message: "El teléfono del contacto es obligatorio" }),
  direccion: z.string().optional(),
  tipo_cliente: z.string().optional(),
  observaciones: z.string().optional()
});

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
  const [cantidadM3, setCantidadM3] = useState<number | undefined>(15); // Default value set to 15
  
  // Nuevos estados para proveedores y clientes
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [proveedorDialogOpen, setProveedorDialogOpen] = useState(false);
  const [clienteDialogOpen, setClienteDialogOpen] = useState(false);
  
  // Nuevo estado para guardar el tipo de material del proveedor seleccionado
  const [materialTipoProveedor, setMaterialTipoProveedor] = useState<string>('');
  
  // Cargar materiales y tarifas al montar el componente
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [tarifas, setTarifas] = useState<any[]>([]);
  
  // Formularios para agregar proveedor y cliente
  const proveedorForm = useForm<z.infer<typeof proveedorSchema>>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre_proveedor: "",
      tipo_material: "",
      cantidad: 0,
      valor_unitario: 0,
      ciudad: "",
      fecha_compra: new Date(),
      observaciones: ""
    }
  });
  
  const clienteForm = useForm<z.infer<typeof clienteSchema>>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre_cliente: "",
      ciudad: "",
      contacto_nombre: "",
      contacto_telefono: "",
      direccion: "",
      tipo_cliente: "",
      observaciones: ""
    }
  });
  
  // Cargar datos
  useEffect(() => {
    setMateriales(loadMateriales());
    setTarifas(loadTarifas());
    setProveedores(loadProveedores());
    setClientes(loadClientes());
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
  
  // Actualizar el tipo de material cuando cambia el proveedor seleccionado
  useEffect(() => {
    if (origin) {
      const proveedorSeleccionado = proveedores.find(p => p.nombre_proveedor === origin);
      if (proveedorSeleccionado) {
        setMaterialTipoProveedor(proveedorSeleccionado.tipo_material);
        setDescription(proveedorSeleccionado.tipo_material); // Auto-fill the description (material type)
      }
    }
  }, [origin, proveedores]);
  
  // Función para agregar nuevo proveedor
  const handleAddProveedor = (data: z.infer<typeof proveedorSchema>) => {
    const nuevoProveedor = createProveedor(
      data.nombre_proveedor,
      data.tipo_material,
      data.cantidad,
      data.valor_unitario,
      data.ciudad,
      data.fecha_compra,
      data.observaciones
    );
    
    const proveedoresActualizados = [...proveedores, nuevoProveedor];
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    setOrigin(nuevoProveedor.nombre_proveedor);
    setProveedorDialogOpen(false);
    toast.success('Proveedor agregado correctamente');
  };
  
  // Función para agregar nuevo cliente
  const handleAddCliente = (data: z.infer<typeof clienteSchema>) => {
    const nuevoCliente = createCliente(
      data.nombre_cliente,
      data.ciudad,
      data.contacto_nombre,
      data.contacto_telefono,
      data.direccion,
      data.tipo_cliente,
      data.observaciones
    );
    
    const clientesActualizados = [...clientes, nuevoCliente];
    saveClientes(clientesActualizados);
    setClientes(clientesActualizados);
    setDestination(nuevoCliente.nombre_cliente);
    setClienteDialogOpen(false);
    toast.success('Cliente agregado correctamente');
  };
  
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
        description, // Usamos la descripción que ahora será igual al tipo de material del proveedor
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
    setCantidadM3(15); // Reset to default 15
    
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
  
  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString();
  };
  
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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={24} />
                      <Label htmlFor="origin" className="text-lg">Origen (Proveedor)</Label>
                    </div>
                    {user.role === 'Administrador' && (
                      <Dialog open={proveedorDialogOpen} onOpenChange={setProveedorDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Agregar Nuevo Proveedor</DialogTitle>
                            <DialogDescription>
                              Llena los datos del nuevo proveedor de material
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...proveedorForm}>
                            <form onSubmit={proveedorForm.handleSubmit(handleAddProveedor)} className="space-y-4">
                              <FormField
                                control={proveedorForm.control}
                                name="nombre_proveedor"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nombre del Proveedor</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Ej: Cantera Los Alpes" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={proveedorForm.control}
                                name="tipo_material"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo de Material</FormLabel>
                                    <FormControl>
                                      <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecciona el tipo de material" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {materiales.map((material) => (
                                            <SelectItem key={material.id} value={material.nombre_material}>
                                              {material.nombre_material}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={proveedorForm.control}
                                  name="cantidad"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Cantidad (m³)</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field} placeholder="0" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={proveedorForm.control}
                                  name="valor_unitario"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Valor Unitario</FormLabel>
                                      <FormControl>
                                        <Input type="number" {...field} placeholder="0" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={proveedorForm.control}
                                name="ciudad"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Ej: Medellín" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={proveedorForm.control}
                                name="observaciones"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Observaciones</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} placeholder="Observaciones adicionales (opcional)" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <DialogFooter>
                                <Button type="submit">Guardar Proveedor</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <Select onValueChange={setOrigin} value={origin}>
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="Selecciona un proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor.id} value={proveedor.nombre_proveedor}>
                          {proveedor.nombre_proveedor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin size={24} />
                      <Label htmlFor="destination" className="text-lg">Destino (Cliente)</Label>
                    </div>
                    {user.role === 'Administrador' && (
                      <Dialog open={clienteDialogOpen} onOpenChange={setClienteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
                            <DialogDescription>
                              Llena los datos del nuevo cliente
                            </DialogDescription>
                          </DialogHeader>
                          <Form {...clienteForm}>
                            <form onSubmit={clienteForm.handleSubmit(handleAddCliente)} className="space-y-4">
                              <FormField
                                control={clienteForm.control}
                                name="nombre_cliente"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nombre del Cliente</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Ej: Constructora XYZ" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={clienteForm.control}
                                name="ciudad"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Ciudad</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Ej: Medellín" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={clienteForm.control}
                                  name="contacto_nombre"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nombre de Contacto</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Ej: Juan Pérez" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                
                                <FormField
                                  control={clienteForm.control}
                                  name="contacto_telefono"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Teléfono</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Ej: 301 234 5678" />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              
                              <FormField
                                control={clienteForm.control}
                                name="direccion"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Dirección</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="Dirección (opcional)" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={clienteForm.control}
                                name="tipo_cliente"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Tipo de Cliente</FormLabel>
                                    <FormControl>
                                      <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Seleccionar tipo (opcional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {tiposCliente.map((tipo) => (
                                            <SelectItem key={tipo} value={tipo}>
                                              {tipo}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={clienteForm.control}
                                name="observaciones"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Observaciones</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} placeholder="Observaciones adicionales (opcional)" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <DialogFooter>
                                <Button type="submit">Guardar Cliente</Button>
                              </DialogFooter>
                            </form>
                          </Form>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                  <Select onValueChange={setDestination} value={destination}>
                    <SelectTrigger className="text-lg p-6">
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ACOPIO_DESTINO}>{ACOPIO_DESTINO}</SelectItem>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.nombre_cliente}>
                          {cliente.nombre_cliente}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              
              {reportType === 'Viajes' && selectedMachine?.type === 'Camión' ? (
                <div className="relative">
                  <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-lg p-6"
                    readOnly
                    disabled
                    required
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Este campo muestra automáticamente el tipo de material del proveedor seleccionado
                  </p>
                </div>
              ) : (
                <Textarea
                  id="description"
                  placeholder="Ingrese los detalles del reporte"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="text-lg p-4"
                  required
                />
              )}
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
