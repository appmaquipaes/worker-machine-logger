
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Plus, DollarSign, Pencil, Trash, Truck, Settings } from 'lucide-react';
import { 
  TarifaCliente, 
  loadTarifasCliente, 
  saveTarifasCliente 
} from '@/models/TarifasCliente';
import { loadMateriales } from '@/models/Materiales';
import { useMachine } from '@/context/MachineContext';
import TarifaClienteForm from '@/components/TarifaClienteForm';

const TarifasClientePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { machines } = useMachine();
  
  const [tarifas, setTarifas] = useState<TarifaCliente[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTarifa, setEditingTarifa] = useState<TarifaCliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tarifaToDelete, setTarifaToDelete] = useState<TarifaCliente | null>(null);
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'transporte' | 'alquiler_maquina'>('todos');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTarifas(loadTarifasCliente());
    setMateriales(loadMateriales());
  };

  const handleTarifaCreated = (nuevaTarifa: TarifaCliente) => {
    let updatedTarifas;
    
    if (editingTarifa) {
      updatedTarifas = tarifas.map(tarifa =>
        tarifa.id === editingTarifa.id ? { ...nuevaTarifa, id: editingTarifa.id } : tarifa
      );
      toast.success('Tarifa actualizada exitosamente');
    } else {
      updatedTarifas = [...tarifas, nuevaTarifa];
      toast.success('Tarifa creada exitosamente');
    }
    
    saveTarifasCliente(updatedTarifas);
    setTarifas(updatedTarifas);
    setDialogOpen(false);
    setEditingTarifa(null);
  };

  const handleEditTarifa = (tarifa: TarifaCliente) => {
    setEditingTarifa(tarifa);
    setDialogOpen(true);
  };

  const handleDeleteTarifa = (tarifa: TarifaCliente) => {
    setTarifaToDelete(tarifa);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTarifa = () => {
    if (tarifaToDelete) {
      const updatedTarifas = tarifas.filter(tarifa => tarifa.id !== tarifaToDelete.id);
      saveTarifasCliente(updatedTarifas);
      setTarifas(updatedTarifas);
      setDeleteDialogOpen(false);
      setTarifaToDelete(null);
      toast.success('Tarifa eliminada exitosamente');
    }
  };

  const toggleTarifaStatus = (id: string) => {
    const updatedTarifas = tarifas.map(tarifa =>
      tarifa.id === id ? { ...tarifa, activa: !tarifa.activa } : tarifa
    );
    saveTarifasCliente(updatedTarifas);
    setTarifas(updatedTarifas);
    toast.success('Estado de tarifa actualizado');
  };

  const getMaterialName = (materialId?: string) => {
    if (!materialId) return '-';
    const material = materiales.find(m => m.id === materialId);
    return material ? material.nombre_material : materialId;
  };

  const getMachineName = (machineId?: string) => {
    if (!machineId) return '-';
    const machine = machines.find(m => m.id === machineId);
    return machine ? `${machine.name} (${machine.plate})` : machineId;
  };

  const calcularMargenGanancia = (tarifa: TarifaCliente) => {
    if (!tarifa.valor_material_m3 || !tarifa.valor_material_cliente_m3) return null;
    const margen = tarifa.valor_material_cliente_m3 - tarifa.valor_material_m3;
    const porcentaje = ((margen / tarifa.valor_material_m3) * 100).toFixed(1);
    return { margen, porcentaje };
  };

  const formatearValoresAlquiler = (tarifa: TarifaCliente) => {
    const valores = [];
    if (tarifa.valor_por_hora) valores.push(`$${tarifa.valor_por_hora.toLocaleString()}/h`);
    if (tarifa.valor_por_dia) valores.push(`$${tarifa.valor_por_dia.toLocaleString()}/d`);
    if (tarifa.valor_por_mes) valores.push(`$${tarifa.valor_por_mes.toLocaleString()}/m`);
    return valores.join(' | ');
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTarifa(null);
    }
    setDialogOpen(open);
  };

  const tarifasFiltradas = tarifas.filter(tarifa => {
    if (filtroTipo === 'todos') return true;
    return tarifa.tipo_servicio === filtroTipo;
  });

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Tarifas por Cliente</h1>
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={18} />
                  Nueva Tarifa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTarifa ? 'Editar Tarifa' : 'Crear Nueva Tarifa'}
                  </DialogTitle>
                </DialogHeader>
                <TarifaClienteForm
                  initialData={editingTarifa}
                  onTarifaCreated={handleTarifaCreated}
                  onCancel={() => handleDialogClose(false)}
                />
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Volver
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Gestiona las tarifas de transporte y alquiler de maquinaria personalizadas por cliente.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Tarifas Configuradas
              </CardTitle>
              <CardDescription>
                {tarifasFiltradas.length} tarifa(s) {filtroTipo !== 'todos' ? `de ${filtroTipo}` : ''} registrada(s)
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="filtro-tipo">Filtrar por tipo:</Label>
              <select
                id="filtro-tipo"
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                className="p-2 border rounded-md text-sm"
              >
                <option value="todos">Todos</option>
                <option value="transporte">Transporte</option>
                <option value="alquiler_maquina">Alquiler Maquinaria</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Servicio/Máquina</TableHead>
                <TableHead>Origen/Destino</TableHead>
                <TableHead>Tarifas</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Margen</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tarifasFiltradas.map((tarifa) => {
                const margen = calcularMargenGanancia(tarifa);
                return (
                  <TableRow key={tarifa.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {tarifa.tipo_servicio === 'transporte' ? (
                          <Truck className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Settings className="h-4 w-4 text-orange-600" />
                        )}
                        <span className="text-xs">
                          {tarifa.tipo_servicio === 'transporte' ? 'Transporte' : 'Alquiler'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{tarifa.cliente}</TableCell>
                    <TableCell>
                      {tarifa.tipo_servicio === 'transporte' ? (
                        <div className="text-sm">
                          <div>Servicio de transporte</div>
                          {tarifa.finca && <div className="text-muted-foreground">Finca: {tarifa.finca}</div>}
                        </div>
                      ) : (
                        <div className="text-sm">
                          <div>{tarifa.tipo_maquina}</div>
                          <div className="text-muted-foreground">{getMachineName(tarifa.maquina_id)}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {tarifa.tipo_servicio === 'transporte' ? (
                        <div className="text-sm">
                          <div>De: {tarifa.origen}</div>
                          <div>A: {tarifa.destino}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {tarifa.tipo_servicio === 'transporte' ? (
                        <div className="text-sm">
                          <div>${tarifa.valor_flete_m3?.toLocaleString()}/m³</div>
                          <div className="text-muted-foreground">Flete</div>
                        </div>
                      ) : (
                        <div className="text-sm">
                          {formatearValoresAlquiler(tarifa)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {tarifa.tipo_servicio === 'transporte' ? (
                        <div className="text-sm">
                          <div>{getMaterialName(tarifa.tipo_material)}</div>
                          {tarifa.valor_material_cliente_m3 && (
                            <div className="text-muted-foreground">
                              ${tarifa.valor_material_cliente_m3.toLocaleString()}/m³
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {margen ? (
                        <div className="text-sm">
                          <div className="font-medium text-green-600">${margen.margen.toLocaleString()}</div>
                          <div className="text-muted-foreground">({margen.porcentaje}%)</div>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tarifa.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tarifa.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditTarifa(tarifa)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTarifa(tarifa)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Switch
                          checked={tarifa.activa}
                          onCheckedChange={() => toggleTarifaStatus(tarifa.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {tarifasFiltradas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay tarifas configuradas. Crea la primera tarifa usando el botón "Nueva Tarifa".
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la tarifa para el cliente "{tarifaToDelete?.cliente}". 
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTarifa} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TarifasClientePage;
