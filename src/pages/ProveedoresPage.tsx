
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Edit, Trash2, MapPin, Building } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DatePicker } from '@/components/DatePicker';
import { Proveedor, loadProveedores, saveProveedores, createProveedor, getUniqueProviderMaterialTypes } from '@/models/Proveedores';
import { Material, loadMateriales } from '@/models/Materiales';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Schema for provider validation
const proveedorSchema = z.object({
  nombre_proveedor: z.string().min(1, { message: "El nombre del proveedor es obligatorio" }),
  tipo_material: z.string().min(1, { message: "El tipo de material es obligatorio" }),
  cantidad: z.coerce.number().min(0, { message: "La cantidad debe ser un número positivo" }),
  valor_unitario: z.coerce.number().min(0, { message: "El valor debe ser un número positivo" }),
  ciudad: z.string().min(1, { message: "La ciudad es obligatoria" }),
  fecha_compra: z.date(),
  observaciones: z.string().optional()
});

const ProveedoresPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [uniqueMaterialTypes, setUniqueMaterialTypes] = useState<string[]>([]);
  
  // Form setup
  const form = useForm<z.infer<typeof proveedorSchema>>({
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
    
    const loadedProveedores = loadProveedores();
    setProveedores(loadedProveedores);
    setMateriales(loadMateriales());
    
    // Get unique material types from existing providers
    setUniqueMaterialTypes(getUniqueProviderMaterialTypes());
  }, [user, navigate]);
  
  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString();
  };
  
  // Helper function to format dates
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };
  
  // Function to add a new provider
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
    
    // Update unique material types
    if (!uniqueMaterialTypes.includes(data.tipo_material)) {
      setUniqueMaterialTypes([...uniqueMaterialTypes, data.tipo_material]);
    }
    
    form.reset();
    toast.success('Proveedor agregado correctamente');
  };
  
  // Function to update a provider
  const handleUpdateProveedor = (data: z.infer<typeof proveedorSchema>) => {
    if (!editingProveedor) return;
    
    const proveedoresActualizados = proveedores.map(proveedor => 
      proveedor.id === editingProveedor.id ? {
        ...proveedor,
        nombre_proveedor: data.nombre_proveedor,
        tipo_material: data.tipo_material,
        cantidad: data.cantidad,
        valor_unitario: data.valor_unitario,
        ciudad: data.ciudad,
        fecha_compra: data.fecha_compra,
        observaciones: data.observaciones
      } : proveedor
    );
    
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    
    // Update unique material types
    if (!uniqueMaterialTypes.includes(data.tipo_material)) {
      setUniqueMaterialTypes([...uniqueMaterialTypes, data.tipo_material]);
    }
    
    setEditingProveedor(null);
    toast.success('Proveedor actualizado correctamente');
  };
  
  // Function to delete a provider
  const handleDeleteProveedor = (id: string) => {
    const proveedoresActualizados = proveedores.filter(proveedor => proveedor.id !== id);
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    toast.success('Proveedor eliminado correctamente');
    
    // Update unique material types
    setUniqueMaterialTypes(getUniqueProviderMaterialTypes());
  };
  
  // Function to open edit provider dialog
  const openEditProveedor = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    form.reset({
      nombre_proveedor: proveedor.nombre_proveedor,
      tipo_material: proveedor.tipo_material,
      cantidad: proveedor.cantidad,
      valor_unitario: proveedor.valor_unitario,
      ciudad: proveedor.ciudad,
      fecha_compra: proveedor.fecha_compra,
      observaciones: proveedor.observaciones || ""
    });
  };
  
  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
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
          Administra los proveedores de material
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Proveedores de Material</CardTitle>
              <CardDescription>
                Gestiona los proveedores y sus datos
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar nuevo proveedor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Agregar Proveedor</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos del nuevo proveedor
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddProveedor)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                    
                    <FormField
                      control={form.control}
                      name="tipo_material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Material</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Ej: Arena fina"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                      control={form.control}
                      name="fecha_compra"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Registro</FormLabel>
                          <FormControl>
                            <DatePicker date={field.value} setDate={(date) => field.onChange(date)} />
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
                      <Button type="submit">Guardar Proveedor</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {proveedores.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Ciudad</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Valor Unitario</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proveedores.map((proveedor) => (
                    <TableRow key={proveedor.id}>
                      <TableCell className="font-medium">{proveedor.nombre_proveedor}</TableCell>
                      <TableCell>{proveedor.ciudad}</TableCell>
                      <TableCell>{proveedor.tipo_material}</TableCell>
                      <TableCell>{formatNumber(proveedor.cantidad)} m³</TableCell>
                      <TableCell>${formatNumber(proveedor.valor_unitario)}</TableCell>
                      <TableCell>{formatDate(proveedor.fecha_compra)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditProveedor(proveedor)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Editar Proveedor</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos del proveedor
                                </DialogDescription>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleUpdateProveedor)} className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="nombre_proveedor"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Nombre del Proveedor</FormLabel>
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
                                  
                                  <FormField
                                    control={form.control}
                                    name="tipo_material"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Tipo de Material</FormLabel>
                                        <FormControl>
                                          <Input
                                            {...field}
                                            placeholder="Ej: Arena fina"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="cantidad"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Cantidad (m³)</FormLabel>
                                          <FormControl>
                                            <Input type="number" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <FormField
                                      control={form.control}
                                      name="valor_unitario"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Valor Unitario</FormLabel>
                                          <FormControl>
                                            <Input type="number" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </div>
                                  
                                  <FormField
                                    control={form.control}
                                    name="fecha_compra"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Fecha de Compra</FormLabel>
                                        <FormControl>
                                          <DatePicker date={field.value} setDate={(date) => field.onChange(date)} />
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
                                    <Button type="submit">Actualizar Proveedor</Button>
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
                                  Esta acción eliminará permanentemente el proveedor "{proveedor.nombre_proveedor}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProveedor(proveedor.id)}
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
                <Building size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No hay proveedores registrados</h3>
              <p className="text-muted-foreground mt-2">Agrega un nuevo proveedor para comenzar</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProveedoresPage;
