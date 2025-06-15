
import React, { useState } from 'react';
import { Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";
import { Plus, Wrench, Sparkles } from 'lucide-react';

interface MachineFormProps {
  onAddMachine: (machine: Omit<Machine, 'id'>) => void;
}

const MachineForm: React.FC<MachineFormProps> = ({ onAddMachine }) => {
  const [newMachine, setNewMachine] = useState<Omit<Machine, 'id'>>({
    name: '',
    type: 'Retroexcavadora de Oruga',
    status: 'Disponible',
  });

  const machineTypes: Machine['type'][] = [
    'Retroexcavadora de Oruga',
    'Retroexcavadora de Llanta', 
    'Cargador',
    'Vibrocompactador',
    'Paladraga',
    'Bulldozer',
    'Camabaja',
    'Volqueta',
    'Motoniveladora',
    'Otro',
  ];

  const handleAddMachine = () => {
    if (!newMachine.name.trim()) {
      toast.error('El nombre de la máquina es obligatorio');
      return;
    }

    onAddMachine(newMachine);
    toast.success(`${newMachine.type} ${newMachine.name} agregada exitosamente`);
    
    // Limpiar el formulario
    setNewMachine({
      name: '',
      type: 'Retroexcavadora de Oruga',
      status: 'Disponible',
    });
  };

  return (
    <Card className="mb-8 border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Añadir Nueva Máquina</CardTitle>
            <CardDescription className="text-green-50 mt-1">
              Completa el formulario para registrar una nueva máquina o vehículo en el sistema
            </CardDescription>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-green-200" />
            <span className="text-green-100 text-sm font-medium">Registro Rápido</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <Wrench className="h-4 w-4 text-green-600" />
              Nombre de la Máquina *
            </Label>
            <Input
              id="name"
              placeholder="Ej: Volqueta Kenworth T880"
              value={newMachine.name}
              onChange={(e) => setNewMachine({...newMachine, name: e.target.value})}
              className="h-12 text-base border-slate-300 focus:border-green-500 focus:ring-green-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          <div className="space-y-3">
            <Label htmlFor="type" className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Tipo de Equipo *
            </Label>
            <Select 
              value={newMachine.type} 
              onValueChange={(value: Machine['type']) => setNewMachine({...newMachine, type: value})}
            >
              <SelectTrigger className="h-12 text-base border-slate-300 focus:border-green-500 focus:ring-green-500 bg-slate-50 focus:bg-white transition-colors">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {machineTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-base py-3">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label htmlFor="plate" className="text-sm font-bold text-slate-700 uppercase tracking-wide">
              Placa (opcional)
            </Label>
            <Input
              id="plate"
              placeholder="Ej: ABC-123"
              value={newMachine.plate || ''}
              onChange={(e) => setNewMachine({...newMachine, plate: e.target.value})}
              className="h-12 text-base border-slate-300 focus:border-green-500 focus:ring-green-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-center">
          <Button 
            onClick={handleAddMachine} 
            className="px-8 py-4 h-14 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5 mr-3" /> 
            Añadir Máquina al Sistema
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MachineForm;
