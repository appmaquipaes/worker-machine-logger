
import React, { useState } from 'react';
import { Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { Plus } from 'lucide-react';

interface MachineFormProps {
  onAddMachine: (machine: Omit<Machine, 'id'>) => void;
}

const MachineForm: React.FC<MachineFormProps> = ({ onAddMachine }) => {
  const [newMachine, setNewMachine] = useState<Omit<Machine, 'id'>>({
    name: '',
    type: 'Excavadora',
    status: 'available',
  });

  const machineTypes: Machine['type'][] = [
    'Excavadora',
    'Bulldozer',
    'Compactador',
    'Cargador',
    'Motoniveladora',
    'Paladraga',
    'Camión',
    'Volqueta',
    'Camabaja',
    'Semirremolque',
    'Tractomula',
  ];

  const handleAddMachine = () => {
    if (!newMachine.name.trim()) {
      toast.error('El nombre de la máquina es obligatorio');
      return;
    }

    onAddMachine(newMachine);
    // Limpiar el formulario
    setNewMachine({
      name: '',
      type: 'Excavadora',
      status: 'available',
    });
  };

  return (
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
              onValueChange={(value: Machine['type']) => setNewMachine({...newMachine, type: value})}
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
  );
};

export default MachineForm;
