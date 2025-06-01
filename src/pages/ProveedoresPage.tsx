
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
import { ArrowLeft, Plus, Edit, Trash2, Package, Building, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Proveedor, 
  ProductoProveedor,
  loadProveedores, 
  saveProveedores, 
  createProveedor,
  loadProductosProveedores,
  saveProductosProveedores,
  createProductoProveedor,
  getProductosByProveedorId
} from '@/models/Proveedores';

// Schema for provider validation
const proveedorSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
  ciudad: z.string().min(1, { message: "La ciudad es obligatoria" }),
  contacto: z.string().min(1, { message: "El contacto es obligatorio" }),
  correo_electronico: z.string().email({ message: "Ingrese un correo válido" }),
  nit: z.string().min(1, { message: "El NIT es obligatorio" }),
  tipo_proveedor: z.enum(['Materiales', 'Lubricantes', 'Repuestos', 'Servicios', 'Otros']),
  forma_pago: z.string().min(1, { message: "La forma de pago es obligatoria" }),
  observaciones: z.string().optional()
});

// Schema for product validation
const productoSchema = z.object({
  tipo_insumo: z.enum(['Material', 'Lubricante', 'Repuesto', 'Servicio']),
  nombre_producto: z.string().min(1, { message: "El nombre del producto es obligatorio" }),
  unidad: z.string().min(1, { message: "La unidad es obligatoria" }),
  precio_unitario: z.coerce.number().min(0, { message: "El precio debe ser positivo" }),
  observaciones: z.string().optional()
});

const ProveedoresPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // States
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<ProductoProveedor[]>([]);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [editingProducto, setEditingProducto] = useState<ProductoProveedor | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showProveedorDialog, setShowProveedorDialog] = useState(false);
  
  // Form setup
  const proveedorForm = useForm<z.infer<typeof proveedorSchema>>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre: "",
      ciudad: "",
      contacto: "",
      correo_electronico: "",
      nit: "",
      tipo_proveedor: "Materiales",
      forma_pago: "",
      observaciones: ""
    }
  });

  const productoForm = useForm<z.infer<typeof productoSchema>>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      tipo_insumo: "Material",
      nombre_producto: "",
      unidad: "",
      precio_unitario: 0,
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
    
    setProveedores(loadProveedores());
    setProductos(loadProductosProveedores());
  }, [user, navigate]);
  
  // Helper functions
  const formatNumber = (value: number): string => {
    return value.toLocaleString();
  };
  
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };
  
  // Provider functions
  const handleAddProveedor = (data: z.infer<typeof proveedorSchema>) => {
    const nuevoProveedor = createProveedor(
      data.nombre,
      data.ciudad,
      data.contacto,
      data.correo_electronico,
      data.nit,
      data.tipo_proveedor,
      data.forma_pago,
      data.observaciones
    );
    
    const proveedoresActualizados = [...proveedores, nuevoProveedor];
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    
    proveedorForm.reset();
    setShowProveedorDialog(false);
    toast.success('Proveedor agregado correctamente');
  };
  
  const handleUpdateProveedor = (data: z.infer<typeof proveedorSchema>) => {
    if (!editingProveedor) return;
    
    const proveedoresActualizados = proveedores.map(proveedor => 
      proveedor.id === editingProveedor.id ? {
        ...proveedor,
        ...data
      } : proveedor
    );
    
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    setEditingProveedor(null);
    setShowProveedorDialog(false);
    toast.success('Proveedor actualizado correctamente');
  };
  
  const handleDeleteProveedor = (id: string) => {
    const proveedoresActualizados = proveedores.filter(proveedor => proveedor.id !== id);
    const productosActualizados = productos.filter(producto => producto.proveedor_id !== id);
    
    saveProveedores(proveedoresActualizados);
    saveProductosProveedores(productosActualizados);
    setProveedores(proveedoresActualizados);
    setProductos(productosActualizados);
    toast.success('Proveedor eliminado correctamente');
  };
  
  const openEditProveedor = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    proveedorForm.reset(proveedor);
    setShowProveedorDialog(true);
  };

  // Product functions
  const handleAddProducto = (data: z.infer<typeof productoSchema>) => {
    if (!selectedProveedor) return;
    
    const nuevoProducto = createProductoProveedor(
      selectedProveedor.id,
      data.tipo_insumo,
      data.nombre_producto,
      data.unidad,
      data.precio_unitario,
      data.observaciones
    );
    
    const productosActualizados = [...productos, nuevoProducto];
    saveProductosProveedores(productosActualizados);
    setProductos(productosActualizados);
    
    productoForm.reset();
    setShowProductDialog(false);
    toast.success('Producto agregado correctamente');
  };

  const handleUpdateProducto = (data: z.infer<typeof productoSchema>) => {
    if (!editingProducto) return;
    
    const productosActualizados = productos.map(producto => 
      producto.id === editingProducto.id ? {
        ...producto,
        ...data
      } : producto
    );
    
    saveProductosProveedores(productosActualizados);
    setProductos(productosActualizados);
    setEditingProducto(null);
    setShowProductDialog(false);
    toast.success('Producto actualizado correctamente');
  };

  const handleDeleteProducto = (id: string) => {
    const productosActualizados = productos.filter(producto => producto.id !== id);
    saveProductosProveedores(productosActualizados);
    setProductos(productosActualizados);
    toast.success('Producto eliminado correctamente');
  };

  const openEditProducto = (producto: ProductoProveedor) => {
    setEditingProducto(producto);
    productoForm.reset(producto);
    setShowProductDialog(true);
  };

  const getProveedorProductos = (proveedorId: string) => {
    return productos.filter(producto => producto.proveedor_id === proveedorId);
  };
  
  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Gestión de Proveedores</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Administra los proveedores y sus productos/servicios asociados
        </p>
      </div>

      <Tabs defaultValue="proveedores" className="space-y-6">
        <TabsList>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="productos">Productos y Servicios</TabsTrigger>
        </TabsList>

        <TabsContent value="proveedores">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Lista de Proveedores</CardTitle>
                  <CardDescription>
                    Gestiona la información de tus proveedores
                  </CardDescription>
                </div>
                <Dialog open={showProveedorDialog} onOpenChange={setShowProveedorDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingProveedor(null);
                      proveedorForm.reset();
                    }}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Proveedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProveedor ? 'Editar Proveedor' : 'Agregar Proveedor'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingProveedor ? 'Modifica los datos del proveedor' : 'Ingresa los datos del nuevo proveedor'}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...proveedorForm}>
                      <form onSubmit={proveedorForm.handleSubmit(editingProveedor ? handleUpdateProveedor : handleAddProveedor)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={proveedorForm.control}
                            name="nombre"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nombre</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Nombre del proveedor" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={proveedorForm.control}
                            name="ciudad"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ciudad</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Ciudad" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={proveedorForm.control}
                            name="contacto"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contacto</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Nombre del contacto" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={proveedorForm.control}
                            name="correo_electronico"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Correo Electrónico</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" placeholder="correo@ejemplo.com" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={proveedorForm.control}
                            name="nit"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>NIT</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="123456789-0" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={proveedorForm.control}
                            name="tipo_proveedor"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Proveedor</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Seleccionar tipo" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Materiales">Materiales</SelectItem>
                                    <SelectItem value="Lubricantes">Lubricantes</SelectItem>
                                    <SelectItem value="Repuestos">Repuestos</SelectItem>
                                    <SelectItem value="Servicios">Servicios</SelectItem>
                                    <SelectItem value="Otros">Otros</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={proveedorForm.control}
                          name="forma_pago"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Forma de Pago</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ej: Contado, 30 días, 60 días" />
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
                          <Button type="submit">
                            {editingProveedor ? 'Actualizar' : 'Guardar'} Proveedor
                          </Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {proveedores.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Ciudad</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>NIT</TableHead>
                        <TableHead>Productos</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proveedores.map((proveedor) => (
                        <TableRow key={proveedor.id}>
                          <TableCell className="font-medium">{proveedor.nombre}</TableCell>
                          <TableCell>{proveedor.ciudad}</TableCell>
                          <TableCell>{proveedor.tipo_proveedor}</TableCell>
                          <TableCell>{proveedor.contacto}</TableCell>
                          <TableCell>{proveedor.nit}</TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {getProveedorProductos(proveedor.id).length} productos
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProveedor(proveedor);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditProveedor(proveedor)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
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
                                      Esta acción eliminará permanentemente el proveedor "{proveedor.nombre}" y todos sus productos asociados.
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
        </TabsContent>

        <TabsContent value="productos">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Productos y Servicios</CardTitle>
                  <CardDescription>
                    Gestiona los productos y servicios de tus proveedores
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={selectedProveedor?.id || ""}
                    onValueChange={(value) => {
                      const proveedor = proveedores.find(p => p.id === value);
                      setSelectedProveedor(proveedor || null);
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedProveedor && (
                    <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                      <DialogTrigger asChild>
                        <Button onClick={() => {
                          setEditingProducto(null);
                          productoForm.reset();
                        }}>
                          <Plus className="mr-2 h-4 w-4" />
                          Agregar Producto
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>
                            {editingProducto ? 'Editar Producto' : 'Agregar Producto'}
                          </DialogTitle>
                          <DialogDescription>
                            {editingProducto ? 'Modifica el producto o servicio' : `Agregar producto para ${selectedProveedor.nombre}`}
                          </DialogDescription>
                        </DialogHeader>
                        <Form {...productoForm}>
                          <form onSubmit={productoForm.handleSubmit(editingProducto ? handleUpdateProducto : handleAddProducto)} className="space-y-4">
                            <FormField
                              control={productoForm.control}
                              name="tipo_insumo"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tipo de Insumo</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar tipo" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="Material">Material</SelectItem>
                                      <SelectItem value="Lubricante">Lubricante</SelectItem>
                                      <SelectItem value="Repuesto">Repuesto</SelectItem>
                                      <SelectItem value="Servicio">Servicio</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={productoForm.control}
                              name="nombre_producto"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nombre del Producto</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="Ej: Arena fina, Aceite 15W40" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={productoForm.control}
                                name="unidad"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Unidad</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="m³, galón, unidad" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={productoForm.control}
                                name="precio_unitario"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Precio Unitario</FormLabel>
                                    <FormControl>
                                      <Input type="number" {...field} placeholder="0" />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={productoForm.control}
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
                              <Button type="submit">
                                {editingProducto ? 'Actualizar' : 'Guardar'} Producto
                              </Button>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {selectedProveedor ? (
                <div>
                  <div className="mb-4 p-4 bg-muted rounded-lg">
                    <h3 className="font-medium">Productos de: {selectedProveedor.nombre}</h3>
                    <p className="text-sm text-muted-foreground">Tipo: {selectedProveedor.tipo_proveedor}</p>
                  </div>
                  
                  {getProveedorProductos(selectedProveedor.id).length > 0 ? (
                    <div className="rounded-md border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>Unidad</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getProveedorProductos(selectedProveedor.id).map((producto) => (
                            <TableRow key={producto.id}>
                              <TableCell>{producto.tipo_insumo}</TableCell>
                              <TableCell className="font-medium">{producto.nombre_producto}</TableCell>
                              <TableCell>{producto.unidad}</TableCell>
                              <TableCell>${formatNumber(producto.precio_unitario)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditProducto(producto)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
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
                                          Esta acción eliminará permanentemente el producto "{producto.nombre_producto}".
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => handleDeleteProducto(producto.id)}
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
                        <Package size={32} className="text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No hay productos registrados</h3>
                      <p className="text-muted-foreground mt-2">Agrega productos para este proveedor</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Package size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">Selecciona un proveedor</h3>
                  <p className="text-muted-foreground mt-2">Selecciona un proveedor para ver y gestionar sus productos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProveedoresPage;
