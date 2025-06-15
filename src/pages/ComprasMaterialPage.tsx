
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Calendar, Truck, Package, TrendingUp } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';
import { Material, loadMateriales } from '@/models/Materiales';
import { CompraMaterial, createCompraMaterial, loadComprasMaterial, saveComprasMaterial } from '@/models/ComprasMaterial';
import { InventarioAcopio, loadInventarioAcopio, saveInventarioAcopio, updateInventarioAfterCompra } from '@/models/InventarioAcopio';

// Esquema de validación con Zod
const compraSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  punto_cargue: z.string().min(1, { message: "El punto de cargue es obligatorio" }),
  tipo_material: z.string().min(1, { message: "Debe seleccionar un tipo de material" }),
  cantidad_m3: z.coerce.number().positive({ message: "La cantidad debe ser mayor a 0" }),
  valor_por_m3: z.coerce.number().nonnegative({ message: "El valor debe ser un número positivo" }),
  transporte_flete: z.coerce.number().nonnegative({ message: "El valor debe ser un número positivo" })
});

const ComprasMaterialPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados
  const [compras, setCompras] = useState<CompraMaterial[]>([]);
  const [inventario, setInventario] = useState<InventarioAcopio[]>([]);
  const [materiales, setMateriales] = useState<Material[]>([]);
  
  // Configuración del formulario
  const form = useForm<z.infer<typeof compraSchema>>({
    resolver: zodResolver(compraSchema),
    defaultValues: {
      fecha: new Date(),
      punto_cargue: "",
      tipo_material: "",
      cantidad_m3: 0,
      valor_por_m3: 0,
      transporte_flete: 0
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
    setCompras(loadComprasMaterial());
    setInventario(loadInventarioAcopio());
    setMateriales(loadMateriales());
  }, []);

  // Actualizar valor_por_m3 cuando se selecciona un material
  useEffect(() => {
    const materialId = form.watch('tipo_material');
    if (materialId) {
      const material = materiales.find(m => m.nombre_material === materialId);
      if (material) {
        form.setValue('valor_por_m3', material.valor_por_m3);
      }
    }
  }, [form.watch('tipo_material'), materiales]);
  
  // Función para manejar la compra de material
  const handleCompra = (data: z.infer<typeof compraSchema>) => {
    // Crear nueva compra
    const nuevaCompra = createCompraMaterial(
      data.fecha,
      data.punto_cargue,
      data.tipo_material,
      data.cantidad_m3,
      data.valor_por_m3,
      data.transporte_flete
    );
    
    // Guardar la compra
    const updatedCompras = [...compras, nuevaCompra];
    saveComprasMaterial(updatedCompras);
    setCompras(updatedCompras);
    
    // Actualizar el inventario
    const updatedInventario = updateInventarioAfterCompra(
      inventario,
      {
        tipo_material: nuevaCompra.tipo_material,
        cantidad_m3: nuevaCompra.cantidad_m3,
        costo_unitario_total: nuevaCompra.costo_unitario_total
      }
    );
    saveInventarioAcopio(updatedInventario);
    setInventario(updatedInventario);
    
    // Resetear el formulario y mostrar notificación
    form.reset({
      fecha: new Date(),
      punto_cargue: "",
      tipo_material: "",
      cantidad_m3: 0,
      valor_por_m3: 0,
      transporte_flete: 0
    });
    
    toast.success("Compra registrada correctamente");
  };

  // Calculate statistics
  const totalCompras = compras.length;
  const totalInvertido = compras.reduce((sum, compra) => sum + compra.costo_total, 0);
  const totalVolumen = compras.reduce((sum, compra) => sum + compra.cantidad_m3, 0);

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Compras de Material
            </h1>
            <p className="text-lg text-slate-600">
              Registra compras de material y actualiza inventario automáticamente
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 h-12 px-6 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Compras</p>
                <p className="text-3xl font-bold text-blue-700">{totalCompras}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Total Invertido</p>
                <p className="text-3xl font-bold text-green-700">${totalInvertido.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Volumen Total (m³)</p>
                <p className="text-3xl font-bold text-purple-700">{totalVolumen.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-xl">
                <Truck className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de compra */}
      <Card className="mb-8 shadow-2xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-2xl font-bold text-slate-800">Registrar Nueva Compra</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Ingresa los datos de la nueva compra de material
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCompra)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Fecha</FormLabel>
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
                  name="punto_cargue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Punto de Cargue</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ej: Cantera Sur" 
                          {...field} 
                          className="h-12 border-slate-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tipo_material"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Tipo de Material</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                            <SelectValue placeholder="Selecciona un material" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {materiales.map(material => (
                            <SelectItem key={material.id} value={material.nombre_material}>
                              {material.nombre_material}
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
                      <FormLabel className="text-slate-700 font-semibold">Cantidad (m³)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="h-12 border-slate-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="valor_por_m3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Valor por m³</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="h-12 border-slate-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="transporte_flete"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">Valor del Transporte/Flete</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          className="h-12 border-slate-300 focus:border-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end pt-6">
                <Button 
                  type="submit"
                  className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Registrar Compra
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Lista de compras */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-2xl font-bold text-slate-800">Historial de Compras</CardTitle>
          <CardDescription className="text-base text-slate-600">
            Listado de todas las compras de material registradas
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          {compras.length > 0 ? (
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-bold text-slate-700 h-14">Fecha</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Punto de Cargue</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Material</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Cantidad (m³)</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Valor por m³</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Transporte</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Costo Total</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Costo Unit. Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compras.map((compra, index) => (
                    <TableRow 
                      key={compra.id}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          {new Date(compra.fecha).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-800 py-4">{compra.punto_cargue}</TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {compra.tipo_material}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">{compra.cantidad_m3.toLocaleString()}</TableCell>
                      <TableCell className="py-4">
                        <span className="font-semibold text-emerald-600">
                          ${compra.valor_por_m3.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">${compra.transporte_flete.toLocaleString()}</TableCell>
                      <TableCell className="py-4">
                        <span className="font-bold text-emerald-600">
                          ${compra.costo_total.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-bold text-purple-600">
                          ${compra.costo_unitario_total.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16 space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <Package className="w-12 h-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-600">No hay compras registradas</p>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                  Agrega nuevas compras de material para comenzar
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprasMaterialPage;
