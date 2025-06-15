import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Edit, Trash2, Users, MapPin } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Cliente, loadClientes, saveClientes, createCliente, tiposCliente, tiposPersona } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import FincasManagement from '@/components/FincasManagement';

// Schema for client validation
const clienteSchema = z.object({
  nombre_cliente: z.string().min(1, { message: "El nombre del cliente es obligatorio" }),
  tipo_persona: z.enum(['Natural', 'Empresa'], { message: "Seleccione el tipo de persona" }),
  nit_cedula: z.string().min(1, { message: "El NIT o cédula es obligatorio" }),
  correo_electronico: z.string().email({ message: "Ingrese un correo válido" }).optional().or(z.literal("")),
  telefono_contacto: z.string().min(1, { message: "El teléfono es obligatorio" }),
  persona_contacto: z.string().min(1, { message: "La persona de contacto es obligatoria" }),
  ciudad: z.string().min(1, { message: "La ciudad es obligatoria" }),
  tipo_cliente: z.string().optional(),
  observaciones: z.string().optional()
});

const ClientesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showFincasDialog, setShowFincasDialog] = useState(false);
  
  // Form setup
  const form = useForm<z.infer<typeof clienteSchema>>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nombre_cliente: "",
      tipo_persona: "Natural",
      nit_cedula: "",
      correo_electronico: "",
      telefono_contacto: "",
      persona_contacto: "",
      ciudad: "",
      tipo_cliente: "",
      observaciones: ""
    }
  });
  
  // Load data on mount
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
      return;
    }
    
    setClientes(loadClientes());
  }, [user, navigate]);
  
  // Function to add a new client
  const handleAddCliente = (data: z.infer<typeof clienteSchema>) => {
    const nuevoCliente = createCliente(
      data.nombre_cliente,
      data.tipo_persona,
      data.nit_cedula,
      data.telefono_contacto,
      data.persona_contacto,
      data.ciudad,
      data.tipo_cliente,
      data.correo_electronico,
      data.observaciones
    );
    
    const clientesActualizados = [...clientes, nuevoCliente];
    saveClientes(clientesActualizados);
    setClientes(clientesActualizados);
    form.reset();
    toast.success('Cliente agregado correctamente');
  };
  
  // Function to update a client
  const handleUpdateCliente = (data: z.infer<typeof clienteSchema>) => {
    if (!editingCliente) return;
    
    const clientesActualizados = clientes.map(cliente => 
      cliente.id === editingCliente.id ? {
        ...cliente,
        nombre_cliente: data.nombre_cliente,
        tipo_persona: data.tipo_persona,
        nit_cedula: data.nit_cedula,
        correo_electronico: data.correo_electronico,
        telefono_contacto: data.telefono_contacto,
        persona_contacto: data.persona_contacto,
        ciudad: data.ciudad,
        tipo_cliente: data.tipo_cliente,
        observaciones: data.observaciones
      } : cliente
    );
    
    saveClientes(clientesActualizados);
    setClientes(clientesActualizados);
    setEditingCliente(null);
    toast.success('Cliente actualizado correctamente');
  };
  
  // Function to delete a client
  const handleDeleteCliente = (id: string) => {
    const clientesActualizados = clientes.filter(cliente => cliente.id !== id);
    saveClientes(clientesActualizados);
    setClientes(clientesActualizados);
    toast.success('Cliente eliminado correctamente');
  };
  
  // Function to open edit client dialog
  const openEditCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    form.reset({
      nombre_cliente: cliente.nombre_cliente,
      tipo_persona: cliente.tipo_persona,
      nit_cedula: cliente.nit_cedula,
      correo_electronico: cliente.correo_electronico || "",
      telefono_contacto: cliente.telefono_contacto,
      persona_contacto: cliente.persona_contacto,
      ciudad: cliente.ciudad,
      tipo_cliente: cliente.tipo_cliente || "",
      observaciones: cliente.observaciones || ""
    });
  };

  // Function to open fincas management
  const openFincasManagement = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowFincasDialog(true);
  };
  
  // Colores visuales de los badges unificados al UI corporativo
  const getTipoClienteColor = (tipo?: string): string => {
    if (!tipo) return "muted";
    switch (tipo) {
      case "Constructora":
        return "accent";
      case "Floristeria":
        return "primary";
      case "Particular":
        return "secondary";
      case "Finca":
        return "accent";
      default:
        return "muted";
    }
  };

  // Get count of fincas for each client
  const getFincasCount = (clienteId: string): number => {
    return getFincasByCliente(clienteId).length;
  };
  
  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-0 sm:px-4">

      {/* Cabecera visual potente */}
      <div className="page-header animate-fade-in mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-responsive-xl font-bold mb-2 flex items-center gap-4">
              <Users className="mobile-icon-large hidden sm:inline-block" />
              Gestión de Clientes
            </h1>
            <p className="text-corporate-muted text-lg">
              Administra los clientes y sus fincas o puntos de entrega de forma eficiente.
            </p>
          </div>
          <Button 
            variant="back"
            className="btn-outline-large btn-press"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="mr-2" /> Volver al panel admin
          </Button>
        </div>
      </div>

      <Card className="corporate-card animate-scale-in shadow-2xl">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0">
            <div>
              <CardTitle className="text-responsive-lg">Clientes</CardTitle>
              <CardDescription>
                Gestiona los clientes y sus múltiples fincas o puntos de entrega para mayor flexibilidad.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-primary-large btn-press gap-2">
                  <Plus />
                  Agregar nuevo cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Agregar Cliente</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos del nuevo cliente
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddCliente)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nombre_cliente"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del Cliente *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: Constructora XYZ" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="tipo_persona"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Persona *</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tiposPersona.map((tipo) => (
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
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="nit_cedula"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>NIT o Cédula *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: 900123456-1" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="correo_electronico"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo Electrónico</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="cliente@ejemplo.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="persona_contacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Persona de Contacto *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: Juan Pérez" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="telefono_contacto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono de Contacto *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: 301 234 5678" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="ciudad"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ciudad *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: Medellín" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
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
                    </div>
                    
                    <FormField
                      control={form.control}
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
          </div>
        </CardHeader>
        <CardContent>
          {clientes.length > 0 ? (
            <div className="rounded-md border overflow-hidden bg-white/90 backdrop-blur-sm">
              <Table className="text-corporate">
                <TableHeader className="bg-slate-50/80">
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>NIT/Cédula</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Fincas</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.id} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium">{cliente.nombre_cliente}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={cliente.tipo_persona === 'Empresa' ? 'default' : 'secondary'}
                          className="status-badge"
                        >
                          {cliente.tipo_persona}
                        </Badge>
                      </TableCell>
                      <TableCell>{cliente.nit_cedula}</TableCell>
                      <TableCell>{cliente.persona_contacto}</TableCell>
                      <TableCell>{cliente.telefono_contacto}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80">
                          <MapPin className="h-4 w-4 text-blue-800" />
                          <span className="font-semibold text-blue-900">{getFincasCount(cliente.id)}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        {cliente.tipo_cliente ? (
                          <Badge 
                            variant={getTipoClienteColor(cliente.tipo_cliente) as any}
                            className="uppercase shadow status-badge"
                          >
                            {cliente.tipo_cliente}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="secondary"
                            className="btn-outline-large btn-press w-9 h-9 p-0"
                            onClick={() => openFincasManagement(cliente)}
                            title="Gestionar fincas"
                          >
                            <MapPin />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost"
                                className="btn-outline-large btn-press w-9 h-9 p-0"
                                onClick={() => openEditCliente(cliente)}
                              >
                                <Edit />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[700px]">
                              <DialogHeader>
                                <DialogTitle>Editar Cliente</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos del cliente
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleUpdateCliente)} className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="nombre_cliente"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Nombre del Cliente *</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name="tipo_persona"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Tipo de Persona *</FormLabel>
                                          <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar tipo" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {tiposPersona.map((tipo) => (
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
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="nit_cedula"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>NIT o Cédula *</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name="correo_electronico"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Correo Electrónico</FormLabel>
                                          <FormControl>
                                            <Input {...field} type="email" />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="persona_contacto"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Persona de Contacto *</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name="telefono_contacto"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Teléfono de Contacto *</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="ciudad"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Ciudad *</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
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
                                  </div>
                                  
                                  <FormField
                                    control={form.control}
                                    name="observaciones"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Observaciones</FormLabel>
                                        <FormControl>
                                          <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <DialogFooter>
                                    <Button type="submit">Actualizar Cliente</Button>
                                  </DialogFooter>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                className="btn-outline-large btn-press w-9 h-9 p-0"
                              >
                                <Trash2 />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente el cliente "{cliente.nombre_cliente}" y todas sus fincas asociadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCliente(cliente.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 sm:py-20 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4 shimmer">
                <Users size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-corporate">No hay clientes registrados</h3>
              <p className="text-corporate-muted mt-2">Agrega un nuevo cliente para comenzar</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Dialog para gestión de fincas */}
      <Dialog open={showFincasDialog} onOpenChange={setShowFincasDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Gestión de Fincas</DialogTitle>
          </DialogHeader>
          {selectedCliente && (
            <FincasManagement 
              clienteId={selectedCliente.id}
              clienteNombre={selectedCliente.nombre_cliente}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientesPage;
