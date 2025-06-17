
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMachine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';

interface TarifaEscombreraFormProps {
  escombreraId: string;
  valorVolquetaSencilla: number;
  valorVolquetaDobletroque: number;
  onEscombreraChange: (escombreraId: string) => void;
  onValorSencillaChange: (valor: number) => void;
  onValorDobletroqueChange: (valor: number) => void;
}

const TarifaEscombreraForm: React.FC<TarifaEscombreraFormProps> = ({
  escombreraId,
  valorVolquetaSencilla,
  valorVolquetaDobletroque,
  onEscombreraChange,
  onValorSencillaChange,
  onValorDobletroqueChange
}) => {
  const { machines } = useMachine();
  const { isEscombrera } = useMachineSpecificReports();

  // Filtrar solo las máquinas que son escombreras
  const escombreras = machines.filter(machine => isEscombrera(machine));

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="escombrera">Escombrera *</Label>
        <Select value={escombreraId} onValueChange={onEscombreraChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una escombrera" />
          </SelectTrigger>
          <SelectContent>
            {escombreras.map((escombrera) => (
              <SelectItem key={escombrera.id} value={escombrera.id}>
                {escombrera.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="valor-sencilla">Valor Volqueta Sencilla *</Label>
          <Input
            id="valor-sencilla"
            type="number"
            placeholder="Ej: 25000"
            value={valorVolquetaSencilla === 0 ? '' : valorVolquetaSencilla}
            onChange={(e) => onValorSencillaChange(parseFloat(e.target.value) || 0)}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="valor-dobletroque">Valor Volqueta Doble Troque *</Label>
          <Input
            id="valor-dobletroque"
            type="number"
            placeholder="Ej: 45000"
            value={valorVolquetaDobletroque === 0 ? '' : valorVolquetaDobletroque}
            onChange={(e) => onValorDobletroqueChange(parseFloat(e.target.value) || 0)}
            className="w-full"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
        <p><strong>Nota:</strong> Estos valores se aplicarán por cada viaje de volqueta que ingrese a la escombrera del cliente seleccionado.</p>
      </div>
    </div>
  );
};

export default TarifaEscombreraForm;
