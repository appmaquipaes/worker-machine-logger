
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine, Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Plus, ArrowLeft } from 'lucide-react';

const MachineManagement: React.FC = () => {
  const { user } = useAuth();
  const { machines, removeMachine, addMachine } = useMachine();
  const navigate = useNavigate();
  
  const [newMachine, setNewMachine] = useState<Omit<Machine, 'id'>>({
    name: '',
    type: 'Excavadora',
  });

  // Redirigir si no hay un usuario o no es administrador
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleRemoveMachine = (id: string) => {
    removeMachine(id);
  };

  const handleAddMachine = () => {
    if (!newMachine.name.trim()) {
      toast.error('El nombre de la máquina es obligatorio');
      return;
    }

    addMachine(newMachine);
    // Limpiar el formulario
    setNewMachine({
      name: '',
      type: 'Excavadora',
    });
  };

  const machineTypes = [
    'Excavadora',
    'Bulldozer',
    'Compactador',
    'Cargador',
    'Motoniveladora',
    'Paladraga',
    'Camión',
    'Volqueta',
    'Camabaja',
    'Semirremolque, Tractomula',
  ];

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Gestión de Máquinas</h1>
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
          Añade o elimina máquinas del sistema
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Añadir Nueva Máquina</CardTitle>
          <CardDescription>
            Completa el formulario para registrar una nueva máquina
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Nombre de la máquina"
                value={newMachine.name}
                onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select 
                value={newMachine.type} 
                onValueChange={(value) => setNewMachine({...newMachine, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un tipo" />
                </SelectTrigger>
                <SelectContent>
                  {machineTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate">Placa (opcional)</Label>
              <Input
                id="plate"
                placeholder="Placa del vehículo"
                value={newMachine.plate || ''}
                onChange={(e) => setNewMachine({...newMachine, plate: e.target.value})}
              />
            </div>
          </div>
          <div className="mt-6">
            <Button onClick={handleAddMachine} className="w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Añadir Máquina
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Máquinas</CardTitle>
          <CardDescription>
            Gestionar las máquinas existentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {machines.length > 0 ? (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="w-24">Placa</TableHead>
                    <TableHead className="w-24">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {machines.map((machine) => (
                    <TableRow key={machine.id}>
                      <TableCell>{machine.id}</TableCell>
                      <TableCell className="font-medium">{machine.name}</TableCell>
                      <TableCell>{machine.type}</TableCell>
                      <TableCell>{machine.plate || '-'}</TableCell>
                      <TableCell>
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
                                Esta acción eliminará permanentemente la máquina {machine.name}.
                                Los reportes asociados a esta máquina podrían verse afectados.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleRemoveMachine(machine.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No hay máquinas registradas</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MachineManagement;
