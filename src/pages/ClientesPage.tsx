
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
import { ArrowLeft, Plus, Edit, Trash2, User, Users } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Cliente, loadClientes, saveClientes, createCliente, tiposCliente } from '@/models/Clientes';

// Schema for client validation
const clienteSchema = z.object({
  nombre_cliente: z.string().min(1, { message: "El nombre del cliente es obligatorio" }),
  ciudad: z.string().min(1, { message: "La ciudad es obligatoria" }),
  contacto_nombre: z.string().min(1, { message: "El nombre del contacto es obligatorio" }),
  contacto_telefono: z.string().min(1, { message: "El teléfono del contacto es obligatorio" }),
  direccion: z.string().optional(),
  tipo_cliente: z.string().optional(),
  observaciones: z.string().optional()
});

const ClientesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  
  // Form setup
  const form = useForm<z.infer<typeof clienteSchema>>({
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
        ciudad: data.ciudad,
        contacto_nombre: data.contacto_nombre,
        contacto_telefono: data.contacto_telefono,
        direccion: data.direccion,
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
      ciudad: cliente.ciudad,
      contacto_nombre: cliente.contacto_nombre,
      contacto_telefono: cliente.contacto_telefono,
      direccion: cliente.direccion || "",
      tipo_cliente: cliente.tipo_cliente || "",
      observaciones: cliente.observaciones || ""
    });
  };
  
  // Get badge color based on client type
  const getTipoClienteColor = (tipo?: string): string => {
    if (!tipo) return "secondary";
    
    switch (tipo) {
      case "Construcción":
        return "yellow";
      case "Industrial":
        return "blue";
      case "Residencial":
        return "green";
      case "Gubernamental":
        return "purple";
      case "Comercial":
        return "orange";
      default:
        return "secondary";
    }
  };
  
  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          <Button 
            variant="back" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Administra los clientes y sus datos de contacto
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Clientes</CardTitle>
              <CardDescription>
                Gestiona los clientes que reciben materiales
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar nuevo cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
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
                            <FormLabel>Nombre del Cliente</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: Constructora XYZ" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
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
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contacto_nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del Contacto</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: Juan Pérez" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="contacto_telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono del Contacto</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Ej: 301 234 5678" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
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
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-medium">{cliente.nombre_cliente}</TableCell>
                      <TableCell>{cliente.ciudad}</TableCell>
                      <TableCell>{cliente.contacto_nombre}</TableCell>
                      <TableCell>{cliente.contacto_telefono}</TableCell>
                      <TableCell>
                        {cliente.tipo_cliente ? (
                          <Badge variant={getTipoClienteColor(cliente.tipo_cliente) as any}>
                            {cliente.tipo_cliente}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditCliente(cliente)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
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
                                          <FormLabel>Nombre del Cliente</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name="ciudad"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Ciudad</FormLabel>
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
                                      name="contacto_nombre"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Nombre del Contacto</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name="contacto_telefono"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Teléfono del Contacto</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <FormField
                                    control={form.control}
                                    name="direccion"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Dirección</FormLabel>
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
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente el cliente "{cliente.nombre_cliente}".
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
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <Users size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No hay clientes registrados</h3>
              <p className="text-muted-foreground mt-2">Agrega un nuevo cliente para comenzar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientesPage;
