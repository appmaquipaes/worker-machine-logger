import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Material, loadMateriales, saveMateriales } from '@/models/Materiales';
import { Tarifa, loadTarifas, saveTarifas, migrateTarifas } from '@/models/Tarifas';
import MovimientoInventarioModal, { MovimientoInventarioFormState } from "@/components/MovimientoInventarioModal";
import { createServicioTransporte, loadServiciosTransporte, saveServiciosTransporte } from "@/models/ServiciosTransporte";
import ClienteFincaMaterialSelector from "@/components/ClienteFincaMaterialSelector";

// Esquemas de validación con Zod
const materialSchema = z.object({
  nombre_material: z.string().min(1, { message: "El nombre del material es obligatorio" }),
  valor_por_m3: z.coerce.number().min(0, { message: "El valor debe ser un número positivo" })
});

const tarifaSchema = z.object({
  origen: z.string().min(1, { message: "El origen es obligatorio" }),
  destino: z.string().min(1, { message: "El destino es obligatorio" }),
  valor_por_m3: z.coerce.number().min(0, { message: "El valor debe ser un número positivo" })
});

const VolquetaManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados para materiales y tarifas
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [tarifas, setTarifas] = useState<Tarifa[]>([]);
  
  // Estados para modal de edición
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingTarifa, setEditingTarifa] = useState<Tarifa | null>(null);

  // Estado para movimiento de inventario de materiales
  const [movimientoModalOpen, setMovimientoModalOpen] = useState(false);
  const [materialMovimiento, setMaterialMovimiento] = useState<null | { id: string; nombre_material: string }>(null);
  
  // Configuración de formularios
  const materialForm = useForm<z.infer<typeof materialSchema>>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      nombre_material: "",
      valor_por_m3: 0
    }
  });

  const tarifaForm = useForm<z.infer<typeof tarifaSchema>>({
    resolver: zodResolver(tarifaSchema),
    defaultValues: {
      origen: "",
      destino: "",
      valor_por_m3: 0
    }
  });

  // Estados para registrar viaje
  const [viajeOrigen, setViajeOrigen] = useState("");
  const [viajeCliente, setViajeCliente] = useState("");
  const [viajeFinca, setViajeFinca] = useState("");
  const [viajeMaterial, setViajeMaterial] = useState("");
  const [viajeCantidad, setViajeCantidad] = useState<number>(0);
  const [viajeMensaje, setViajeMensaje] = useState<string | null>(null);

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

  // Cargar datos y migrar tarifas al iniciar
  useEffect(() => {
    // Migrar tarifas del formato antiguo al nuevo
    migrateTarifas();
    
    // Cargar datos
    setMateriales(loadMateriales());
    setTarifas(loadTarifas());
  }, []);

  // Funciones para materiales
  const handleAddMaterial = (data: z.infer<typeof materialSchema>) => {
    const newMaterial: Material = {
      id: Date.now().toString(),
      nombre_material: data.nombre_material,
      categoria: 'Material',
      unidad_medida: 'm³',
      valor_por_m3: data.valor_por_m3,
      activo: true,
      fechaRegistro: new Date().toISOString()
    };
    
    const updatedMateriales = [...materiales, newMaterial];
    saveMateriales(updatedMateriales);
    setMateriales(updatedMateriales);
    
    materialForm.reset();
    toast.success('Material agregado correctamente');
  };

  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString();
  };

  const handleUpdateMaterial = (data: z.infer<typeof materialSchema>) => {
    if (!editingMaterial) return;
    
    const updatedMateriales = materiales.map(material => 
      material.id === editingMaterial.id ? { 
        ...material, 
        nombre_material: data.nombre_material,
        valor_por_m3: data.valor_por_m3 
      } : material
    );
    
    saveMateriales(updatedMateriales);
    setMateriales(updatedMateriales);
    setEditingMaterial(null);
    toast.success('Material actualizado correctamente');
  };

  const handleDeleteMaterial = (id: string) => {
    const updatedMateriales = materiales.filter(material => material.id !== id);
    saveMateriales(updatedMateriales);
    setMateriales(updatedMateriales);
    toast.success('Material eliminado correctamente');
  };

  const openEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    materialForm.reset({
      nombre_material: material.nombre_material,
      valor_por_m3: material.valor_por_m3
    });
  };

  // Funciones para tarifas
  const handleAddTarifa = (data: z.infer<typeof tarifaSchema>) => {
    const newTarifa: Tarifa = {
      id: Date.now().toString(),
      origen: data.origen,
      destino: data.destino,
      valor_por_m3: data.valor_por_m3,
      fechaRegistro: new Date().toISOString()
    };
    
    const updatedTarifas = [...tarifas, newTarifa];
    saveTarifas(updatedTarifas);
    setTarifas(updatedTarifas);
    
    tarifaForm.reset();
    toast.success('Tarifa agregada correctamente');
  };

  // Helper para registrar movimiento e impactar inventario
  const handleRegistrarMovimiento = (mov: MovimientoInventarioFormState) => {
    if (!materialMovimiento) return;
    // Cargar inventario actual de localStorage o inicializar
    let inventario = [];
    try {
      const raw = localStorage.getItem("inventario_acopio");
      inventario = raw ? JSON.parse(raw) : [];
    } catch {
      inventario = [];
    }

    // Buscar registro existente o crear nuevo
    const idx = inventario.findIndex((mat: any) => mat.id_material === materialMovimiento.id);
    if (idx === -1 && mov.tipo === "salida") {
      toast.error("No puedes registrar saldo negativo para este material.");
      return;
    }

    // Movimiento de entrada
    if (mov.tipo === "entrada") {
      if (idx === -1) {
        inventario.push({
          id_material: materialMovimiento.id,
          nombre_material: materialMovimiento.nombre_material,
          cantidad_disponible: mov.cantidad,
        });
      } else {
        inventario[idx].cantidad_disponible += mov.cantidad;
      }
      toast.success("Movimiento de entrada registrado.");
    }

    // Movimiento de salida
    if (mov.tipo === "salida") {
      if (inventario[idx].cantidad_disponible < mov.cantidad) {
        toast.error("No hay suficiente cantidad en inventario para este retiro.");
        return;
      }
      inventario[idx].cantidad_disponible -= mov.cantidad;
      toast.success("Movimiento de salida registrado.");
    }

    // Guardar inventario actualizado
    localStorage.setItem("inventario_acopio", JSON.stringify(inventario));
    setMovimientoModalOpen(false);
  };

  const handleUpdateTarifa = (data: z.infer<typeof tarifaSchema>) => {
    if (!editingTarifa) return;
    
    const updatedTarifas = tarifas.map(tarifa => 
      tarifa.id === editingTarifa.id ? { 
        ...tarifa, 
        origen: data.origen,
        destino: data.destino,
        valor_por_m3: data.valor_por_m3
      } : tarifa
    );
    
    saveTarifas(updatedTarifas);
    setTarifas(updatedTarifas);
    setEditingTarifa(null);
    toast.success('Tarifa actualizada correctamente');
  };

  const handleDeleteTarifa = (id: string) => {
    const updatedTarifas = tarifas.filter(tarifa => tarifa.id !== id);
    saveTarifas(updatedTarifas);
    setTarifas(updatedTarifas);
    toast.success('Tarifa eliminada correctamente');
  };

  const openEditTarifa = (tarifa: Tarifa) => {
    setEditingTarifa(tarifa);
    tarifaForm.reset({
      origen: tarifa.origen,
      destino: tarifa.destino,
      valor_por_m3: tarifa.valor_por_m3
    });
  };

  // Guardar viaje en localStorage
  const handleRegistrarViaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!viajeOrigen || !viajeCliente || !viajeMaterial || !viajeCantidad) {
      setViajeMensaje("Todos los campos son obligatorios");
      return;
    }
    const destino = viajeFinca || viajeCliente;
    const viaje = createServicioTransporte(
      new Date(),
      viajeCliente,
      viajeFinca || "",
      viajeOrigen,
      destino,
      viajeMaterial,
      viajeCantidad,
      0, // valor_flete_m3, aquí puedes poner por defecto 0 o mejorar luego
      undefined, // valor_material_m3
      undefined, // vehiculo
      undefined, // conductor
      undefined, // observacion
      1 // numero_viajes
    );
    const viajesActuales = loadServiciosTransporte();
    saveServiciosTransporte([...viajesActuales, viaje]);
    setViajeOrigen("");
    setViajeCliente("");
    setViajeFinca("");
    setViajeMaterial("");
    setViajeCantidad(0);
    setViajeMensaje("Viaje registrado exitosamente");
    setTimeout(() => setViajeMensaje(null), 2500);
  };

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Administración de Volquetas</h1>
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
          Gestión de materiales y tarifas para volquetas
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div>
            <CardTitle>Registrar Viaje</CardTitle>
            <CardDescription>
              Registra un viaje de volqueta indicando el material y destino del cliente.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegistrarViaje} className="space-y-4 flex flex-col md:flex-row gap-3 items-center">
            <Input
              className="md:max-w-xs"
              value={viajeOrigen}
              onChange={e => setViajeOrigen(e.target.value)}
              placeholder="Origen (ej: Acopio)"
              required
            />
            <ClienteFincaMaterialSelector
              selectedCliente={viajeCliente}
              onClienteChange={setViajeCliente}
              selectedFinca={viajeFinca}
              onFincaChange={setViajeFinca}
              selectedMaterial={viajeMaterial}
              onMaterialChange={setViajeMaterial}
            />
            <Input
              className="md:max-w-[110px]"
              value={viajeCantidad === 0 ? "" : viajeCantidad}
              onChange={e => setViajeCantidad(Number(e.target.value))}
              type="number"
              min={0.1}
              step={0.1}
              placeholder="m³"
              required
            />
            <Button type="submit" className="shrink-0">Guardar Viaje</Button>
          </form>
          {viajeMensaje && (
            <div className="text-xs mt-1 text-green-600">{viajeMensaje}</div>
          )}
        </CardContent>
      </Card>

      {/* Sección 1: Tipos de Materiales */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tipos de Materiales</CardTitle>
              <CardDescription>
                Administra los materiales y sus valores por m³
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar nuevo material
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agregar Material</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos del nuevo material
                  </DialogDescription>
                </DialogHeader>
                <Form {...materialForm}>
                  <form onSubmit={materialForm.handleSubmit(handleAddMaterial)} className="space-y-4 py-4">
                    <FormField
                      control={materialForm.control}
                      name="nombre_material"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del material</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Arena" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={materialForm.control}
                      name="valor_por_m3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor por m³</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Guardar</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {materiales.length > 0 ? (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre del Material</TableHead>
                    <TableHead>Valor por m³</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materiales.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.nombre_material}</TableCell>
                      <TableCell>${formatNumber(material.valor_por_m3)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Editar Material */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditMaterial(material)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Editar Material</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos del material
                                </DialogDescription>
                              </DialogHeader>
                              {editingMaterial && (
                                <Form {...materialForm}>
                                  <form onSubmit={materialForm.handleSubmit(handleUpdateMaterial)} className="space-y-4 py-4">
                                    <FormField
                                      control={materialForm.control}
                                      name="nombre_material"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Nombre del material</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={materialForm.control}
                                      name="valor_por_m3"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Valor por m³</FormLabel>
                                          <FormControl>
                                            <Input type="number" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <Button type="submit">Actualizar</Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {/* Eliminar Material */}
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
                                  Esta acción eliminará permanentemente el material "{material.nombre_material}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteMaterial(material.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>

                          {/* Nuevo: Registrar Movimiento */}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setMaterialMovimiento(material);
                              setMovimientoModalOpen(true);
                            }}
                          >
                            Registrar Movimiento
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No hay materiales registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de movimiento inventario */}
      {materialMovimiento && (
        <MovimientoInventarioModal
          open={movimientoModalOpen}
          onClose={() => setMovimientoModalOpen(false)}
          material={materialMovimiento}
          onRegistrar={handleRegistrarMovimiento}
        />
      )}

      {/* Sección 2: Tarifas por Ruta */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Tarifas por Ruta</CardTitle>
              <CardDescription>
                Gestiona las rutas y sus tarifas por m³
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar nueva tarifa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agregar Tarifa</DialogTitle>
                  <DialogDescription>
                    Ingresa los datos de la nueva tarifa
                  </DialogDescription>
                </DialogHeader>
                <Form {...tarifaForm}>
                  <form onSubmit={tarifaForm.handleSubmit(handleAddTarifa)} className="space-y-4 py-4">
                    <FormField
                      control={tarifaForm.control}
                      name="origen"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Origen</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Cantera Norte" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tarifaForm.control}
                      name="destino"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destino</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Obra Central" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={tarifaForm.control}
                      name="valor_por_m3"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Valor por m³</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Guardar</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {tarifas.length > 0 ? (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Origen</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Valor por m³</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tarifas.map((tarifa) => (
                    <TableRow key={tarifa.id}>
                      <TableCell className="font-medium">{tarifa.origen}</TableCell>
                      <TableCell>{tarifa.destino}</TableCell>
                      <TableCell>${formatNumber(tarifa.valor_por_m3)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Editar Tarifa */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => openEditTarifa(tarifa)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Editar Tarifa</DialogTitle>
                                <DialogDescription>
                                  Modifica los datos de la tarifa
                                </DialogDescription>
                              </DialogHeader>
                              {editingTarifa && (
                                <Form {...tarifaForm}>
                                  <form onSubmit={tarifaForm.handleSubmit(handleUpdateTarifa)} className="space-y-4 py-4">
                                    <FormField
                                      control={tarifaForm.control}
                                      name="origen"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Origen</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={tarifaForm.control}
                                      name="destino"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Destino</FormLabel>
                                          <FormControl>
                                            <Input {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField
                                      control={tarifaForm.control}
                                      name="valor_por_m3"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Valor por m³</FormLabel>
                                          <FormControl>
                                            <Input type="number" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <DialogFooter>
                                      <Button type="submit">Actualizar</Button>
                                    </DialogFooter>
                                  </form>
                                </Form>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {/* Eliminar Tarifa */}
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
                                  Esta acción eliminará permanentemente la tarifa de la ruta "{tarifa.origen} - {tarifa.destino}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTarifa(tarifa.id)}
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
              <p className="text-muted-foreground">No hay tarifas registradas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VolquetaManagement;
