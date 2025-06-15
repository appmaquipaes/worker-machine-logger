
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Edit, Trash2, DollarSign, Search, Users, AlertTriangle } from 'lucide-react';
import { TarifaCliente, loadTarifasCliente, saveTarifasCliente, createTarifaAlquiler } from '@/models/TarifasCliente';
import { loadClientes } from '@/models/Clientes';
import { useMachine } from '@/context/MachineContext';

// Schema for tariff validation
const tarifaSchema = z.object({
  cliente: z.string().min(1, { message: "Debe seleccionar un cliente" }),
  maquina_id: z.string().min(1, { message: "Debe seleccionar una máquina" }),
  valor_por_hora: z.coerce.number().positive({ message: "La tarifa debe ser mayor a 0" }),
  observaciones: z.string().optional()
});

const TarifasClientePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { machines } = useMachine();
  
  // States
  const [tarifas, setTarifas] = useState<TarifaCliente[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [editingTarifa, setEditingTarifa] = useState<TarifaCliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form setup
  const form = useForm<z.infer<typeof tarifaSchema>>({
    resolver: zodResolver(tarifaSchema),
    defaultValues: {
      cliente: "",
      maquina_id: "",
      valor_por_hora: 0,
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
    
    setTarifas(loadTarifasCliente());
    setClientes(loadClientes());
  }, [user, navigate]);
  
  // Filter tarifas based on search
  const filteredTarifas = tarifas.filter(tarifa => {
    const cliente = clientes.find(c => c.id === tarifa.cliente);
    const maquina = machines.find(m => m.id === tarifa.maquina_id);
    const clienteNombre = cliente?.nombre_cliente || '';
    const maquinaNombre = maquina?.name || '';
    
    return clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           maquinaNombre.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Function to add a new tariff
  const handleAddTarifa = (data: z.infer<typeof tarifaSchema>) => {
    const maquina = machines.find(m => m.id === data.maquina_id);
    const nuevaTarifa = createTarifaAlquiler(
      data.cliente,
      undefined,
      data.maquina_id,
      maquina?.name || 'Máquina',
      data.valor_por_hora,
      undefined,
      undefined,
      data.observaciones
    );
    
    const tarifasActualizadas = [...tarifas, nuevaTarifa];
    saveTarifasCliente(tarifasActualizadas);
    setTarifas(tarifasActualizadas);
    form.reset();
    toast.success('Tarifa agregada correctamente');
  };
  
  // Function to update a tariff
  const handleUpdateTarifa = (data: z.infer<typeof tarifaSchema>) => {
    if (!editingTarifa) return;
    
    const tarifasActualizadas = tarifas.map(tarifa => 
      tarifa.id === editingTarifa.id ? {
        ...tarifa,
        cliente: data.cliente,
        maquina_id: data.maquina_id,
        valor_por_hora: data.valor_por_hora,
        observaciones: data.observaciones
      } : tarifa
    );
    
    saveTarifasCliente(tarifasActualizadas);
    setTarifas(tarifasActualizadas);
    setEditingTarifa(null);
    toast.success('Tarifa actualizada correctamente');
  };
  
  // Function to delete a tariff
  const handleDeleteTarifa = (id: string) => {
    const tarifasActualizadas = tarifas.filter(tarifa => tarifa.id !== id);
    saveTarifasCliente(tarifasActualizadas);
    setTarifas(tarifasActualizadas);
    toast.success('Tarifa eliminada correctamente');
  };
  
  // Function to open edit tariff dialog
  const openEditTarifa = (tarifa: TarifaCliente) => {
    setEditingTarifa(tarifa);
    form.reset({
      cliente: tarifa.cliente,
      maquina_id: tarifa.maquina_id || '',
      valor_por_hora: tarifa.valor_por_hora || 0,
      observaciones: tarifa.observaciones || ""
    });
  };
  
  // Get client name by ID
  const getClienteName = (clienteId: string): string => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.nombre_cliente || 'Cliente no encontrado';
  };
  
  // Get machine name by ID
  const getMachineName = (machineId: string): string => {
    const machine = machines.find(m => m.id === machineId);
    return machine?.name || 'Máquina no encontrada';
  };
  
  // Format number as currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tarifas por Cliente
            </h1>
            <p className="text-lg text-slate-600">
              Gestiona las tarifas especiales por cliente y máquina
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
                <p className="text-blue-600 text-sm font-medium">Total Tarifas</p>
                <p className="text-3xl font-bold text-blue-700">{tarifas.length}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Clientes con Tarifas</p>
                <p className="text-3xl font-bold text-green-700">
                  {new Set(tarifas.map(t => t.cliente)).size}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Tarifa Promedio</p>
                <p className="text-3xl font-bold text-purple-700">
                  {tarifas.length > 0 ? 
                    formatCurrency(tarifas.reduce((sum, t) => sum + (t.valor_por_hora || 0), 0) / tarifas.length) : 
                    '$0'
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-200 rounded-xl">
                <DollarSign className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Card */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-800">Gestión de Tarifas</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Administra las tarifas especiales por cliente y máquina
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Plus className="mr-2 h-5 w-5" />
                  Agregar Tarifa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] bg-white shadow-2xl border-0">
                <DialogHeader className="text-center space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl font-bold text-slate-800">Agregar Nueva Tarifa</DialogTitle>
                    <DialogDescription className="text-base text-slate-600">
                      Define una tarifa específica para un cliente y máquina
                    </DialogDescription>
                  </div>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddTarifa)} className="space-y-6 pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cliente"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">Cliente *</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                                  <SelectValue placeholder="Seleccionar cliente" />
                                </SelectTrigger>
                                <SelectContent>
                                  {clientes.map((cliente) => (
                                    <SelectItem key={cliente.id} value={cliente.id}>
                                      {cliente.nombre_cliente}
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
                        name="maquina_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-700 font-semibold">Máquina *</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                                  <SelectValue placeholder="Seleccionar máquina" />
                                </SelectTrigger>
                                <SelectContent>
                                  {machines.map((machine) => (
                                    <SelectItem key={machine.id} value={machine.id}>
                                      {machine.name}
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
                      name="valor_por_hora"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-semibold">Tarifa por Hora *</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              placeholder="Ej: 150000"
                              className="h-12 border-slate-300 focus:border-blue-500"
                            />
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
                          <FormLabel className="text-slate-700 font-semibold">Observaciones</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Observaciones adicionales (opcional)"
                              className="h-12 border-slate-300 focus:border-blue-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex gap-3 pt-6 border-t border-slate-200">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit"
                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                      >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Guardar Tarifa
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Buscar por cliente o máquina..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-slate-300 focus:border-blue-500 bg-white"
              />
            </div>
          </div>
          
          {filteredTarifas.length > 0 ? (
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-bold text-slate-700 h-14">Cliente</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Máquina</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Tarifa por Hora</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Observaciones</TableHead>
                    <TableHead className="w-32 font-bold text-slate-700 h-14">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTarifas.map((tarifa, index) => (
                    <TableRow 
                      key={tarifa.id}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <TableCell className="font-semibold text-slate-800 py-4">
                        {getClienteName(tarifa.cliente)}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {getMachineName(tarifa.maquina_id || '')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-bold text-emerald-600">
                          {formatCurrency(tarifa.valor_por_hora || 0)}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {tarifa.observaciones || '-'}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditTarifa(tarifa)}
                                className="h-9 w-9 p-0 border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] bg-white shadow-2xl border-0">
                              <DialogHeader className="text-center space-y-4 pb-6">
                                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                  <Edit className="h-8 w-8 text-white" />
                                </div>
                                <div className="space-y-2">
                                  <DialogTitle className="text-2xl font-bold text-slate-800">Editar Tarifa</DialogTitle>
                                  <DialogDescription className="text-base text-slate-600">
                                    Modifica los datos de la tarifa
                                  </DialogDescription>
                                </div>
                              </DialogHeader>
                              <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleUpdateTarifa)} className="space-y-6 pt-6">
                                  <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                      control={form.control}
                                      name="cliente"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-slate-700 font-semibold">Cliente *</FormLabel>
                                          <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                                                <SelectValue placeholder="Seleccionar cliente" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {clientes.map((cliente) => (
                                                  <SelectItem key={cliente.id} value={cliente.id}>
                                                    {cliente.nombre_cliente}
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
                                      name="maquina_id"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel className="text-slate-700 font-semibold">Máquina *</FormLabel>
                                          <FormControl>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                              <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                                                <SelectValue placeholder="Seleccionar máquina" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {machines.map((machine) => (
                                                  <SelectItem key={machine.id} value={machine.id}>
                                                    {machine.name}
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
                                    name="valor_por_hora"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Tarifa por Hora *</FormLabel>
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
                                    name="observaciones"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel className="text-slate-700 font-semibold">Observaciones</FormLabel>
                                        <FormControl>
                                          <Input 
                                            {...field} 
                                            className="h-12 border-slate-300 focus:border-blue-500"
                                          />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                  
                                  <div className="flex gap-3 pt-6 border-t border-slate-200">
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => setEditingTarifa(null)}
                                      className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                      Cancelar
                                    </Button>
                                    <Button 
                                      type="submit"
                                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                                    >
                                      <DollarSign className="h-4 w-4 mr-2" />
                                      Actualizar Tarifa
                                    </Button>
                                  </div>
                                </form>
                              </Form>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                className="h-9 w-9 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-md bg-white shadow-2xl border-0">
                              <AlertDialogHeader className="text-center space-y-4 pb-4">
                                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                  <AlertTriangle className="h-8 w-8 text-white" />
                                </div>
                                <div className="space-y-2">
                                  <AlertDialogTitle className="text-2xl font-bold text-slate-800">
                                    ¿Confirmar Eliminación?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-base text-slate-600 leading-relaxed">
                                    Esta acción eliminará permanentemente la tarifa para <span className="font-bold text-slate-800">"{getClienteName(tarifa.cliente)}"</span> y <span className="font-bold text-slate-800">"{getMachineName(tarifa.maquina_id || '')}"</span>.
                                    <br /><br />
                                    Esta acción no se puede deshacer.
                                  </AlertDialogDescription>
                                </div>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-3 pt-6 border-t border-slate-200">
                                <AlertDialogCancel className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTarifa(tarifa.id)}
                                  className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Eliminar Tarifa
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
            <div className="text-center py-16 space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-600">No hay tarifas registradas</p>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                  {searchTerm ? 'No se encontraron tarifas que coincidan con tu búsqueda.' : 'Agrega nuevas tarifas para comenzar.'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TarifasClientePage;
