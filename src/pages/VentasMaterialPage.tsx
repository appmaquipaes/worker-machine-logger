
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
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';
import { InventarioAcopio, loadInventarioAcopio, saveInventarioAcopio, updateInventarioAfterVenta } from '@/models/InventarioAcopio';
import { VentaMaterial, createVentaMaterial, loadVentasMaterial, saveVentasMaterial } from '@/models/VentasMaterial';

// Esquema de validación con Zod
const ventaSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  tipo_material: z.string().min(1, { message: "Debe seleccionar un tipo de material" }),
  cantidad_m3: z.coerce.number().positive({ message: "La cantidad debe ser mayor a 0" }),
  flete_aplicado_m3: z.coerce.number().nonnegative({ message: "El valor debe ser un número positivo" }),
  margen_ganancia_m3: z.coerce.number().nonnegative({ message: "El valor debe ser un número positivo" }),
  cliente: z.string().min(1, { message: "El cliente es obligatorio" }),
});

const VentasMaterialPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados
  const [ventas, setVentas] = useState<VentaMaterial[]>([]);
  const [inventario, setInventario] = useState<InventarioAcopio[]>([]);
  const [materialSeleccionado, setMaterialSeleccionado] = useState<InventarioAcopio | null>(null);
  
  // Configuración del formulario
  const form = useForm<z.infer<typeof ventaSchema>>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      fecha: new Date(),
      tipo_material: "",
      cantidad_m3: 0,
      flete_aplicado_m3: 0,
      margen_ganancia_m3: 0,
      cliente: ""
    }
  });

  // Control de acceso - solo administradores
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Cargar datos
  useEffect(() => {
    setVentas(loadVentasMaterial());
    setInventario(loadInventarioAcopio());
  }, []);

  // Actualizar material seleccionado cuando cambie la selección
  useEffect(() => {
    const materialId = form.watch('tipo_material');
    if (materialId) {
      const material = inventario.find(m => m.tipo_material === materialId);
      if (material) {
        setMaterialSeleccionado(material);
      } else {
        setMaterialSeleccionado(null);
      }
    } else {
      setMaterialSeleccionado(null);
    }
  }, [form.watch('tipo_material'), inventario]);
  
  // Validar cantidad disponible
  const validateCantidad = (cantidad: number) => {
    if (!materialSeleccionado) return true;
    return cantidad <= materialSeleccionado.cantidad_disponible;
  };
  
  // Función para manejar la venta de material
  const handleVenta = (data: z.infer<typeof ventaSchema>) => {
    // Verificar si hay suficiente stock
    if (!validateCantidad(data.cantidad_m3)) {
      toast.error(`No hay suficiente stock disponible. Máximo: ${materialSeleccionado?.cantidad_disponible} m³`);
      return;
    }
    
    if (!materialSeleccionado) {
      toast.error("No se ha seleccionado un material válido");
      return;
    }
    
    // Crear nueva venta
    const nuevaVenta = createVentaMaterial(
      data.fecha,
      data.tipo_material,
      data.cantidad_m3,
      materialSeleccionado.costo_promedio_m3,
      data.flete_aplicado_m3,
      data.margen_ganancia_m3,
      data.cliente
    );
    
    // Guardar la venta
    const updatedVentas = [...ventas, nuevaVenta];
    saveVentasMaterial(updatedVentas);
    setVentas(updatedVentas);
    
    // Actualizar el inventario
    const updatedInventario = updateInventarioAfterVenta(
      inventario,
      {
        tipo_material: nuevaVenta.tipo_material,
        cantidad_m3: nuevaVenta.cantidad_m3
      }
    );
    saveInventarioAcopio(updatedInventario);
    setInventario(updatedInventario);
    
    // Resetear el formulario y mostrar notificación
    form.reset({
      fecha: new Date(),
      tipo_material: "",
      cantidad_m3: 0,
      flete_aplicado_m3: 0,
      margen_ganancia_m3: 0,
      cliente: ""
    });
    setMaterialSeleccionado(null);
    
    toast.success("Venta registrada correctamente");
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Ventas de Material</h1>
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
          Registrar ventas de material y actualizar inventario automáticamente
        </p>
      </div>

      {/* Formulario de venta */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Registrar Nueva Venta</CardTitle>
          <CardDescription>
            Ingresa los datos de la nueva venta de material
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleVenta)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          setDate={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Constructora ABC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tipo_material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Material</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inventario
                            .filter(item => item.cantidad_disponible > 0)
                            .map(item => (
                            <SelectItem key={item.id} value={item.tipo_material}>
                              {item.tipo_material} - Disp: {item.cantidad_disponible.toLocaleString()} m³
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cantidad_m3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad (m³)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          max={materialSeleccionado?.cantidad_disponible || 0}
                        />
                      </FormControl>
                      {materialSeleccionado && (
                        <p className="text-xs text-muted-foreground">
                          Disponible: {materialSeleccionado.cantidad_disponible.toLocaleString()} m³
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="flete_aplicado_m3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flete aplicado por m³</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="margen_ganancia_m3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Margen de ganancia por m³</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {materialSeleccionado && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-medium mb-2">Información de Precio</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Costo base por m³:</p>
                      <p className="font-medium">${materialSeleccionado.costo_promedio_m3.toLocaleString()}</p>
                    </div>
                    
                    <div className="text-sm">
                      <p className="text-muted-foreground">Precio de venta calculado por m³:</p>
                      <p className="font-medium">
                        ${(
                          materialSeleccionado.costo_promedio_m3 +
                          (form.watch('flete_aplicado_m3') || 0) +
                          (form.watch('margen_ganancia_m3') || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="text-sm col-span-2">
                      <p className="text-muted-foreground">Total venta estimado:</p>
                      <p className="font-medium">
                        ${(
                          (materialSeleccionado.costo_promedio_m3 +
                          (form.watch('flete_aplicado_m3') || 0) +
                          (form.watch('margen_ganancia_m3') || 0)) *
                          (form.watch('cantidad_m3') || 0)
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={!materialSeleccionado || !validateCantidad(form.watch('cantidad_m3') || 0)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Registrar Venta
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Lista de ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
          <CardDescription>
            Listado de todas las ventas de material registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {ventas.length > 0 ? (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Cantidad (m³)</TableHead>
                    <TableHead>Costo Base</TableHead>
                    <TableHead>Flete Aplicado</TableHead>
                    <TableHead>Margen</TableHead>
                    <TableHead>Precio Venta</TableHead>
                    <TableHead>Total Venta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ventas.map((venta) => (
                    <TableRow key={venta.id}>
                      <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>{venta.cliente}</TableCell>
                      <TableCell>{venta.tipo_material}</TableCell>
                      <TableCell>{venta.cantidad_m3.toLocaleString()}</TableCell>
                      <TableCell>${venta.costo_base_m3.toLocaleString()}</TableCell>
                      <TableCell>${venta.flete_aplicado_m3.toLocaleString()}</TableCell>
                      <TableCell>${venta.margen_ganancia_m3.toLocaleString()}</TableCell>
                      <TableCell>${venta.precio_venta_m3.toLocaleString()}</TableCell>
                      <TableCell>${venta.total_venta.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No hay ventas registradas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VentasMaterialPage;
