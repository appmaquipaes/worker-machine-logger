
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TarifaAlquilerFormProps {
  maquinaId: string;
  valorPorHora: number;
  valorPorDia: number;
  valorPorMes: number;
  machines: any[];
  onMaquinaChange: (value: string) => void;
  onValorPorHoraChange: (value: number) => void;
  onValorPorDiaChange: (value: number) => void;
  onValorPorMesChange: (value: number) => void;
}

const TarifaAlquilerForm: React.FC<TarifaAlquilerFormProps> = ({
  maquinaId,
  valorPorHora,
  valorPorDia,
  valorPorMes,
  machines,
  onMaquinaChange,
  onValorPorHoraChange,
  onValorPorDiaChange,
  onValorPorMesChange
}) => {
  return (
    <>
      <div>
        <Label htmlFor="maquina">Máquina *</Label>
        <select
          id="maquina"
          value={maquinaId}
          onChange={(e) => onMaquinaChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Seleccionar máquina</option>
          {machines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.name} ({machine.type}) - {machine.plate}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="valor-hora">Valor por Hora</Label>
          <Input
            id="valor-hora"
            type="number"
            value={valorPorHora}
            onChange={(e) => onValorPorHoraChange(parseFloat(e.target.value) || 0)}
            placeholder="Valor por hora"
          />
        </div>
        
        <div>
          <Label htmlFor="valor-dia">Valor por Día</Label>
          <Input
            id="valor-dia"
            type="number"
            value={valorPorDia}
            onChange={(e) => onValorPorDiaChange(parseFloat(e.target.value) || 0)}
            placeholder="Valor por día"
          />
        </div>
        
        <div>
          <Label htmlFor="valor-mes">Valor por Mes</Label>
          <Input
            id="valor-mes"
            type="number"
            value={valorPorMes}
            onChange={(e) => onValorPorMesChange(parseFloat(e.target.value) || 0)}
            placeholder="Valor por mes"
          />
        </div>
      </div>
      
      <p className="text-xs text-muted-foreground">
        * Defina al menos uno de los valores de alquiler (hora, día o mes)
      </p>
    </>
  );
};

export default TarifaAlquilerForm;
