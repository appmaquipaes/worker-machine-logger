
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
import { ArrowLeft, Plus, DollarSign, Pencil, Trash } from 'lucide-react';
import { 
  TarifaCliente, 
  loadTarifasCliente, 
  saveTarifasCliente 
} from '@/models/TarifasCliente';
import { loadMateriales } from '@/models/Materiales';
import TarifaClienteForm from '@/components/TarifaClienteForm';

const TarifasClientePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tarifas, setTarifas] = useState<TarifaCliente[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTarifa, setEditingTarifa] = useState<TarifaCliente | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [tarifaToDelete, setTarifaToDelete] = useState<TarifaCliente | null>(null);

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
      // Actualizar tarifa existente
      updatedTarifas = tarifas.map(tarifa =>
        tarifa.id === editingTarifa.id ? { ...nuevaTarifa, id: editingTarifa.id } : tarifa
      );
      toast.success('Tarifa actualizada exitosamente');
    } else {
      // Crear nueva tarifa
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

  const calcularMargenGanancia = (tarifa: TarifaCliente) => {
    if (!tarifa.valor_material_m3 || !tarifa.valor_material_cliente_m3) return null;
    const margen = tarifa.valor_material_cliente_m3 - tarifa.valor_material_m3;
    const porcentaje = ((margen / tarifa.valor_material_m3) * 100).toFixed(1);
    return { margen, porcentaje };
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setEditingTarifa(null);
    }
    setDialogOpen(open);
  };

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
          Gestiona las tarifas de flete personalizadas por cliente y destino con márgenes de ganancia.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tarifas Configuradas
          </CardTitle>
          <CardDescription>
            {tarifas.length} tarifa(s) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Destino/Punto de Entrega</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Valor Flete/m³</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Valor Material/m³</TableHead>
                <TableHead>Valor Cliente/m³</TableHead>
                <TableHead>Margen</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tarifas.map((tarifa) => {
                const margen = calcularMargenGanancia(tarifa);
                return (
                  <TableRow key={tarifa.id}>
                    <TableCell className="font-medium">{tarifa.cliente}</TableCell>
                    <TableCell>{tarifa.destino}</TableCell>
                    <TableCell>{tarifa.origen}</TableCell>
                    <TableCell>${tarifa.valor_flete_m3.toLocaleString()}</TableCell>
                    <TableCell>{getMaterialName(tarifa.tipo_material)}</TableCell>
                    <TableCell>
                      {tarifa.valor_material_m3 ? `$${tarifa.valor_material_m3.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>
                      {tarifa.valor_material_cliente_m3 ? `$${tarifa.valor_material_cliente_m3.toLocaleString()}` : '-'}
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

          {tarifas.length === 0 && (
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
              Esta acción eliminará permanentemente la tarifa para el cliente "{tarifaToDelete?.cliente}" 
              con destino "{tarifaToDelete?.destino}". Esta acción no se puede deshacer.
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
