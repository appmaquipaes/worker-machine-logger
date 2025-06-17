
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Truck, Wrench, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Maquina, loadMaquinas, saveMaquinas } from '@/models/Maquinas';
import { format } from 'date-fns';

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
  const [machines, setMachines] = useState<Maquina[]>([]);
  const [editingMachine, setEditingMachine] = useState<Maquina | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    plate: '',
    status: 'Disponible' as 'Disponible' | 'En Uso' | 'Mantenimiento',
    hoursWorked: 0,
    imageUrl: ''
  });

  useEffect(() => {
    if (open) {
      loadMachinesData();
    }
  }, [open]);

  const loadMachinesData = () => {
    const loadedMachines = loadMaquinas();
    setMachines(loadedMachines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type) {
      toast.error('Por favor completa los campos obligatorios');
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
      saveMaquinas(updatedMachines);
      toast.success('Máquina actualizada exitosamente');
    } else {
      // Crear nueva máquina
      const newMachine: Maquina = {
        id: Date.now().toString(),
        ...formData,
        lastMaintenance: new Date()
      };
      const updatedMachines = [...machines, newMachine];
      setMachines(updatedMachines);
      saveMaquinas(updatedMachines);
      toast.success('Máquina creada exitosamente');
    }

    resetForm();
    onMachinesUpdated();
  };

  const handleEdit = (machine: Maquina) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name,
      type: machine.type,
      plate: machine.plate || '',
      status: machine.status,
      hoursWorked: machine.hoursWorked || 0,
      imageUrl: machine.imageUrl || ''
    });
  };

  const handleDelete = (machineId: string) => {
    const updatedMachines = machines.filter(machine => machine.id !== machineId);
    setMachines(updatedMachines);
    saveMaquinas(updatedMachines);
    toast.success('Máquina eliminada exitosamente');
    onMachinesUpdated();
  };

  const resetForm = () => {
    setEditingMachine(null);
    setFormData({
      name: '',
      type: '',
      plate: '',
      status: 'Disponible',
      hoursWorked: 0,
      imageUrl: ''
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'bg-green-100 text-green-800';
      case 'En Uso': return 'bg-yellow-100 text-yellow-800';
      case 'Mantenimiento': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const machineTypes = [
    'Excavadora', 'Bulldozer', 'Cargadora', 'Volqueta', 'Grúa', 
    'Compactadora', 'Motoniveladora', 'Retroexcavadora', 'Camión', 'Otro'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-6 w-6" />
            Gestión de Máquinas
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {editingMachine ? 'Editar Máquina' : 'Nueva Máquina'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre/Modelo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ej: CAT 320D Excavadora"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type">Tipo de Máquina *</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {machineTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="plate">Placa/Número</Label>
                  <Input
                    id="plate"
                    value={formData.plate}
                    onChange={(e) => setFormData({...formData, plate: e.target.value})}
                    placeholder="Ej: ABC-123"
                  />
                </div>

                <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Disponible">Disponible</SelectItem>
                      <SelectItem value="En Uso">En Uso</SelectItem>
                      <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="hoursWorked">Horas Trabajadas</Label>
                  <Input
                    id="hoursWorked"
                    type="number"
                    value={formData.hoursWorked}
                    onChange={(e) => setFormData({...formData, hoursWorked: Number(e.target.value)})}
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl">URL de Imagen</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" />
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

          {/* Lista de máquinas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Máquinas Registradas ({machines.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {machines.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No hay máquinas registradas</p>
                  </div>
                ) : (
                  machines.map((machine) => (
                    <div key={machine.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{machine.name}</h4>
                          <Badge className={getStatusBadgeColor(machine.status)}>
                            {machine.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{machine.type}</p>
                        {machine.plate && (
                          <p className="text-xs text-muted-foreground">Placa: {machine.plate}</p>
                        )}
                        {machine.hoursWorked && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Wrench className="h-3 w-3" />
                            {machine.hoursWorked} horas trabajadas
                          </p>
                        )}
                        {machine.lastMaintenance && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Último mantenimiento: {format(new Date(machine.lastMaintenance), 'dd/MM/yyyy')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(machine)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(machine.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
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
