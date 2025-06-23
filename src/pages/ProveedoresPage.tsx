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
import { ArrowLeft, Plus, Edit, Trash2, PackagePlus, FileText } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import {
  Proveedor,
  createProveedor,
  saveProveedores,
  loadProveedores,
  tiposProveedor,
  TipoProveedor,
  ProductoProveedor,
  createProductoProveedor,
  saveProductosProveedores,
  loadProductosProveedores,
  getProductosByProveedor
} from '@/models/Proveedores';
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Schemas for validation
const proveedorSchema = z.object({
  nombre: z.string().min(1, { message: "El nombre es obligatorio" }),
  nit: z.string().optional(),
  ciudad: z.string().min(1, { message: "La ciudad es obligatoria" }),
  observaciones: z.string().optional(),
  contacto: z.string().min(1, { message: "El contacto es obligatorio" }),
  correo_electronico: z.string().email({ message: "Ingrese un correo válido" }).optional().or(z.literal("")),
  tipo_proveedor: z.enum(['Materiales', 'Lubricantes', 'Repuestos', 'Servicios', 'Otros'], { message: "Seleccione el tipo de proveedor" }),
  forma_pago: z.string().optional()
});

const productoSchema = z.object({
  nombre_producto: z.string().min(1, { message: "El nombre del producto es obligatorio" }),
  tipo_material: z.string().min(1, { message: "El tipo de material es obligatorio" }),
  precio_por_m3: z.number({ invalid_type_error: 'El precio debe ser un número' }).min(0, { message: "El precio debe ser mayor o igual a 0" }),
  observaciones: z.string().optional(),
  tipo_insumo: z.enum(['Material', 'Lubricante', 'Repuesto', 'Servicio'], { message: "Seleccione el tipo de insumo" }),
  unidad: z.string().optional(),
  precio_unitario: z.number({ invalid_type_error: 'El precio unitario debe ser un número' }).optional()
});

const ProveedoresPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // States
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<ProductoProveedor[]>([]);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);

  // Form setup
  const form = useForm<z.infer<typeof proveedorSchema>>({
    resolver: zodResolver(proveedorSchema),
    defaultValues: {
      nombre: "",
      nit: "",
      ciudad: "",
      observaciones: "",
      contacto: "",
      correo_electronico: "",
      tipo_proveedor: "Materiales",
      forma_pago: ""
    }
  });

  const productoForm = useForm<z.infer<typeof productoSchema>>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre_producto: "",
      tipo_material: "",
      precio_por_m3: 0,
      observaciones: "",
      tipo_insumo: "Material",
      unidad: "m³",
      precio_unitario: 0
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

  // Function to add a new supplier
  const handleAddProveedor = (data: z.infer<typeof proveedorSchema>) => {
    const nuevoProveedor = createProveedor(
      data.nombre,
      data.ciudad,
      data.contacto,
      data.contacto, // contacto_principal same as contacto
      data.correo_electronico,
      data.observaciones,
      data.tipo_proveedor as TipoProveedor, // Cast to correct type
      data.nit,
      data.forma_pago
    );
    
    const proveedoresActualizados = [...proveedores, nuevoProveedor];
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    form.reset();
    toast.success('Proveedor agregado correctamente');
  };

  // Function to add a new product
  const handleAddProducto = (data: z.infer<typeof productoSchema>) => {
    if (!selectedProveedor) return;
    
    const nuevoProducto = createProductoProveedor(
      selectedProveedor.id,
      data.nombre_producto,
      data.tipo_material,
      parseFloat(data.precio_por_m3.toString()), // Convert to number
      data.observaciones,
      data.tipo_insumo as 'Material' | 'Lubricante' | 'Repuesto' | 'Servicio',
      data.unidad,
      parseFloat(data.precio_unitario?.toString() || data.precio_por_m3.toString()) // Convert to number
    );
    
    const productosActualizados = [...productos, nuevoProducto];
    saveProductosProveedores(productosActualizados);
    setProductos(productosActualizados);
    setShowProductDialog(false);
    productoForm.reset();
    toast.success('Producto agregado correctamente');
  };

  // Function to update a supplier
  const handleUpdateProveedor = (data: z.infer<typeof proveedorSchema>) => {
    if (!editingProveedor) return;

    const proveedoresActualizados = proveedores.map(proveedor =>
      proveedor.id === editingProveedor.id ? {
        ...proveedor,
        nombre: data.nombre,
        nit: data.nit || '',
        ciudad: data.ciudad,
        observaciones: data.observaciones,
        contacto_principal: data.contacto,
        contacto: data.contacto,
        correo_electronico: data.correo_electronico,
        email: data.correo_electronico,
        tipo_proveedor: data.tipo_proveedor as TipoProveedor,
        forma_pago: data.forma_pago
      } : proveedor
    );

    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    setEditingProveedor(null);
    toast.success('Proveedor actualizado correctamente');
  };

  // Function to delete a supplier
  const handleDeleteProveedor = (id: string) => {
    const proveedoresActualizados = proveedores.filter(proveedor => proveedor.id !== id);
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    toast.success('Proveedor eliminado correctamente');
  };

  // Function to open edit supplier dialog
  const openEditProveedor = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    form.reset({
      nombre: proveedor.nombre,
      nit: proveedor.nit,
      ciudad: proveedor.ciudad,
      observaciones: proveedor.observaciones || "",
      contacto: proveedor.contacto,
      correo_electronico: proveedor.correo_electronico || "",
      tipo_proveedor: proveedor.tipo_proveedor,
      forma_pago: proveedor.forma_pago || ""
    });
  };

  // Function to open product dialog
  const openProductDialog = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setShowProductDialog(true);
  };

  // Function to delete a product
  const handleDeleteProducto = (id: string) => {
    const productosActualizados = productos.filter(producto => producto.id !== id);
    saveProductosProveedores(productosActualizados);
    setProductos(productosActualizados);
    toast.success('Producto eliminado correctamente');
  };

  // Fixed function with proper Badge variants
  const getTipoProveedorColor = (tipo?: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!tipo) return "secondary";
    switch (tipo) {
      case "Materiales":
        return "default";
      case "Lubricantes":
        return "secondary";
      case "Repuestos":
        return "outline";
      case "Servicios":
        return "default";
      default:
        return "secondary";
    }
  };

  // Get products for selected provider
  const getProductosCount = (proveedorId: string): number => {
    return getProductosByProveedor(proveedorId).length;
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-0 sm:px-4">

      {/* Cabecera visual potente */}
      <div className="page-header animate-fade-in mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-responsive-xl font-bold mb-2 flex items-center gap-4">
              <PackagePlus className="mobile-icon-large hidden sm:inline-block" />
              Gestión de Proveedores
            </h1>
            <p className="text-corporate-muted text-lg">
              Administra los proveedores y sus productos de forma eficiente.
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
              <CardTitle className="text-responsive-lg">Proveedores</CardTitle>
              <CardDescription>
                Gestiona los proveedores y sus productos.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-primary-large btn-press gap-2">
                  <Plus />
                  Agregar nuevo proveedor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Agregar Proveedor</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos del nuevo proveedor
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddProveedor)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="nombre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del proveedor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>NIT</FormLabel>
                          <FormControl>
                            <Input placeholder="NIT del proveedor" {...field} />
                          </FormControl>
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
                            <Input placeholder="Ciudad del proveedor" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contacto"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contacto</FormLabel>
                          <FormControl>
                            <Input placeholder="Contacto del proveedor" {...field} />
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
                            <Input placeholder="Correo electrónico del proveedor" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tipo_proveedor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Proveedor</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {tiposProveedor.map((tipo) => (
                                <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="forma_pago"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Forma de Pago</FormLabel>
                          <FormControl>
                            <Input placeholder="Forma de pago" {...field} />
                          </FormControl>
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
                            <Textarea
                              placeholder="Observaciones del proveedor"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit" className="btn-primary-large btn-press">Agregar</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>NIT</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proveedores.map((proveedor) => (
                <TableRow key={proveedor.id}>
                  <TableCell>{proveedor.nombre}</TableCell>
                  <TableCell>{proveedor.nit}</TableCell>
                  <TableCell>{proveedor.ciudad}</TableCell>
                  <TableCell>{proveedor.contacto_principal}</TableCell>
                  <TableCell>
                    <Badge variant={getTipoProveedorColor(proveedor.tipo_proveedor)}>
                      {proveedor.tipo_proveedor}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="outline" onClick={() => openProductDialog(proveedor)}>
                        <FileText className="h-4 w-4 mr-2" />
                        ({getProductosCount(proveedor.id)})
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEditProveedor(proveedor)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará el proveedor de forma permanente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteProveedor(proveedor.id)}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog para editar proveedor */}
      <Dialog open={!!editingProveedor} onOpenChange={(open) => !open && setEditingProveedor(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Editar Proveedor</DialogTitle>
            <DialogDescription>
              Modifica los datos del proveedor
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleUpdateProveedor)} className="space-y-4">
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIT</FormLabel>
                    <FormControl>
                      <Input placeholder="NIT del proveedor" {...field} />
                    </FormControl>
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
                      <Input placeholder="Ciudad del proveedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contacto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contacto</FormLabel>
                    <FormControl>
                      <Input placeholder="Contacto del proveedor" {...field} />
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
                      <Input placeholder="Correo electrónico del proveedor" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipo_proveedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Proveedor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposProveedor.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forma_pago"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Forma de Pago</FormLabel>
                    <FormControl>
                      <Input placeholder="Forma de pago" {...field} />
                    </FormControl>
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
                      <Textarea
                        placeholder="Observaciones del proveedor"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="btn-primary-large btn-press">Actualizar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Dialog para agregar producto */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Agregar Producto</DialogTitle>
            <DialogDescription>
              Ingresa los datos del nuevo producto
            </DialogDescription>
          </DialogHeader>
          <Form {...productoForm}>
            <form onSubmit={productoForm.handleSubmit(handleAddProducto)} className="space-y-4">
              <FormField
                control={productoForm.control}
                name="nombre_producto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del producto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productoForm.control}
                name="tipo_material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Material</FormLabel>
                    <FormControl>
                      <Input placeholder="Tipo de material" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productoForm.control}
                name="precio_por_m3"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por M3</FormLabel>
                    <FormControl>
                      <Input placeholder="Precio por m3" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={productoForm.control}
                name="tipo_insumo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Insumo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
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
                name="unidad"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidad</FormLabel>
                    <FormControl>
                      <Input placeholder="Unidad" {...field} />
                    </FormControl>
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
                      <Input placeholder="Precio unitario" type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={productoForm.control}
                name="observaciones"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Observaciones del producto"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" className="btn-primary-large btn-press">Agregar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Panel de visualización de productos */}
      <Dialog open={!!selectedProveedor} onOpenChange={(open) => !open && setSelectedProveedor(null)}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Productos de {selectedProveedor?.nombre}</DialogTitle>
            <DialogDescription>
              Lista de productos ofrecidos por este proveedor
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-4" />

          <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Tipo Material</TableHead>
                  <TableHead>Tipo Insumo</TableHead>
                  <TableHead>Precio por M3</TableHead>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos
                  .filter(producto => producto.proveedor_id === selectedProveedor?.id)
                  .map((producto) => (
                    <TableRow key={producto.id}>
                      <TableCell>{producto.nombre_producto}</TableCell>
                      <TableCell>{producto.tipo_material}</TableCell>
                      <TableCell>{producto.tipo_insumo}</TableCell>
                      <TableCell>{producto.precio_por_m3}</TableCell>
                      <TableCell>{producto.unidad}</TableCell>
                      <TableCell>{producto.precio_unitario}</TableCell>
                      <TableCell className="text-right">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará el producto de forma permanente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteProducto(producto.id)}>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProveedoresPage;
