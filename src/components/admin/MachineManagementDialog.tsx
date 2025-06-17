
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Machine {
  id: string;
  name: string;
  type: string;
  status: string;
  plate?: string;
}

interface MachineManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMachinesUpdated: () => void;
}

const MachineManagementDialog: React.FC<MachineManagementDialogProps> = ({
  open,
  onOpenChange,
  onMachinesUpdated
}) => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    status: 'available',
    plate: ''
  });

  const machineTypes = [
    'Retroexcavadora de Oruga',
    'Retroexcavadora de Llanta',
    'Bulldozer',
    'Cargador',
    'Compactador',
    'Vibrocompactador',
    'Motoniveladora',
    'Camión',
    'Camabaja',
    'Paladraga'
  ];

  useEffect(() => {
    if (open) {
      loadMachines();
    }
  }, [open]);

  const loadMachines = () => {
    const storedMachines = JSON.parse(localStorage.getItem('machines') || '[]');
    setMachines(storedMachines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (editingMachine) {
      // Editar máquina existente
      const updatedMachines = machines.map(machine => 
        machine.id === editingMachine.id 
          ? { ...machine, ...formData }
          : machine
      );
      setMachines(updatedMachines);
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
      toast.success('Máquina actualizada exitosamente');
    } else {
      // Crear nueva máquina
      const newMachine: Machine = {
        id: Date.now().toString(),
        ...formData
      };
      const updatedMachines = [...machines, newMachine];
      setMachines(updatedMachines);
      localStorage.setItem('machines', JSON.stringify(updatedMachines));
      toast.success('Máquina creada exitosamente');
    }

    resetForm();
    onMachinesUpdated();
  };

  const handleEdit = (machine: Machine) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      type: machine.type,
      status: machine.status,
      plate: machine.plate || ''
    });
  };

  const handleDelete = (machineId: string) => {
    const updatedMachines = machines.filter(machine => machine.id !== machineId);
    setMachines(updatedMachines);
    localStorage.setItem('machines', JSON.stringify(updatedMachines));
    toast.success('Máquina eliminada exitosamente');
    onMachinesUpdated();
  };

  const resetForm = () => {
    setEditingMachine(null);
    setFormData({
      name: '',
      type: '',
      status: 'available',
      plate: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Gestión de Máquinas
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingMachine ? 'Editar Máquina' : 'Nueva Máquina'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nombre de la máquina"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Tipo *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
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
                  <Label htmlFor="plate">Placa</Label>
                  <Input
                    id="plate"
                    value={formData.plate}
                    onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
                    placeholder="Placa de la máquina"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Estado</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="in-use">En Uso</SelectItem>
                      <SelectItem value="maintenance">Mantenimiento</SelectItem>
                      <SelectItem value="inactive">Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingMachine ? 'Actualizar' : 'Crear'} Máquina
                  </Button>
                  {editingMachine && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Máquinas */}
          <Card>
            <CardHeader>
              <CardTitle>Máquinas Registradas ({machines.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {machines.length > 0 ? (
                  machines.map((machine) => (
                    <div
                      key={machine.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{machine.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {machine.type} {machine.plate && `- ${machine.plate}`}
                        </p>
                        <Badge
                          variant={
                            machine.status === 'available' ? 'default' :
                            machine.status === 'in-use' ? 'secondary' :
                            machine.status === 'maintenance' ? 'destructive' : 'outline'
                          }
                          className="mt-1"
                        >
                          {machine.status === 'available' ? 'Disponible' :
                           machine.status === 'in-use' ? 'En Uso' :
                           machine.status === 'maintenance' ? 'Mantenimiento' : 'Inactiva'}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(machine)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(machine.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay máquinas registradas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MachineManagementDialog;
