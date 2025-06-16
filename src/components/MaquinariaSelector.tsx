
import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useMachine } from '@/context/MachineContext';

interface Props {
  selectedMaquinaria: string;
  onMaquinariaChange: (maquinaria: string) => void;
}

const MaquinariaSelector: React.FC<Props> = ({
  selectedMaquinaria,
  onMaquinariaChange
}) => {
  const { machines } = useMachine();

  // Filtrar solo maquinaria pesada que puede ser transportada
  const maquinariaTransportable = machines.filter(machine => 
    ['Retroexcavadora de Oruga', 'Retroexcavadora de Llanta', 'Bulldozer', 
     'Motoniveladora', 'Vibrocompactador', 'Paladraga', 'Cargador'].includes(machine.type)
  );

  return (
    <div className="flex flex-col min-w-[200px]">
      <span className="text-xs mb-1">Maquinaria Transportada</span>
      <Select value={selectedMaquinaria} onValueChange={onMaquinariaChange}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona la maquinaria" />
        </SelectTrigger>
        <SelectContent>
          {maquinariaTransportable.map((machine) => (
            <SelectItem value={`${machine.type} ${machine.name}`} key={machine.id}>
              {machine.type} - {machine.name}
              {machine.plate && ` (${machine.plate})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MaquinariaSelector;
