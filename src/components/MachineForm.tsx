
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Machine } from '@/context/MachineContext';

interface MachineFormProps {
  onMachineCreated: (machine: Omit<Machine, 'id'>) => void;
  initialData?: Machine;
  onCancel?: () => void;
}

const MachineForm: React.FC<MachineFormProps> = ({ 
  onMachineCreated, 
  initialData,
  onCancel 
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [type, setType] = useState(initialData?.type || '');
  const [plate, setPlate] = useState(initialData?.plate || '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');

  const machineTypes = [
    'Excavadora',
    'Retroexcavadora de Oruga',
    'Bulldozer',
    'Cargador',
    'Compactador',
    'Motoniveladora',
    'Paladraga',
    'Volqueta',
    'Camión',
    'Camabaja',
    'Semirremolque',
    'Tractomula',
    'Escombrera'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !type) {
      toast.error('Por favor complete los campos obligatorios');
      return;
    }

    onMachineCreated({
      name: name.trim(),
      type,
      plate: plate.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      status: initialData?.status || 'Disponible'
    });

    if (!initialData) {
      setName('');
      setType('');
      setPlate('');
      setImageUrl('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de la Máquina *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: CAT320D"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de Equipo *</Label>
        <Select value={type} onValueChange={setType} required>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona el tipo de equipo" />
          </SelectTrigger>
          <SelectContent className="max-h-60 overflow-y-auto bg-white z-50">
            {machineTypes.map((machineType) => (
              <SelectItem key={machineType} value={machineType}>
                {machineType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="plate">Placa (Opcional)</Label>
        <Input
          id="plate"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="Ej: ABC123"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL de Imagen (Opcional)</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          {initialData ? 'Actualizar Máquina' : 'Crear Máquina'}
        </Button>
      </div>
    </form>
  );
};

export default MachineForm;
