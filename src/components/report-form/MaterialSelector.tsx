
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useMachine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { Wrench as ToolIcon } from 'lucide-react';

interface MaterialSelectorProps {
  origin: string;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  tiposMaterial: string[];
  inventarioAcopio: any[];
}

const MaterialSelector: React.FC<MaterialSelectorProps> = ({
  origin,
  tipoMateria,
  setTipoMateria,
  tiposMaterial,
  inventarioAcopio
}) => {
  const { selectedMachine } = useMachine();
  const { isMaterialTransportVehicle } = useMachineSpecificReports();

  if (!selectedMachine || !isMaterialTransportVehicle(selectedMachine)) {
    return null;
  }

  const isFromAcopio = origin === 'Acopio Maquipaes';

  if (isFromAcopio) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <ToolIcon size={24} />
          <Label htmlFor="material-inventario" className="text-lg">Material del Inventario</Label>
        </div>
        <Select onValueChange={setTipoMateria} value={tipoMateria}>
          <SelectTrigger className="text-lg p-6">
            <SelectValue placeholder="Selecciona el material del inventario" />
          </SelectTrigger>
          <SelectContent>
            {inventarioAcopio.map((item) => (
              <SelectItem key={item.id} value={item.tipo_material}>
                {item.tipo_material} ({item.cantidad_disponible} m³ disponibles)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <ToolIcon size={24} />
        <Label htmlFor="tipo-materia" className="text-lg">Tipo de Materia</Label>
      </div>
      <Select onValueChange={setTipoMateria} value={tipoMateria}>
        <SelectTrigger className="text-lg p-6">
          <SelectValue placeholder="Selecciona el tipo de materia" />
        </SelectTrigger>
        <SelectContent>
          {tiposMaterial.map((tipo) => (
            <SelectItem key={tipo} value={tipo}>
              {tipo}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MaterialSelector;
