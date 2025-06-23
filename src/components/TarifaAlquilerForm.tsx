
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Settings, Clock, Calendar, CalendarDays } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="maquina" className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <Settings className="h-5 w-5 text-slate-600" />
          Máquina *
        </Label>
        <select
          id="maquina"
          value={maquinaId}
          onChange={(e) => onMaquinaChange(e.target.value)}
          className="w-full p-4 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white shadow-sm"
        >
          <option value="">Seleccionar máquina</option>
          {machines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.name} ({machine.type}) - {machine.plate}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <Label htmlFor="valor-hora" className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Valor por Hora
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg font-semibold">$</span>
            <Input
              id="valor-hora"
              type="number"
              value={valorPorHora === 0 ? '' : valorPorHora}
              onChange={(e) => onValorPorHoraChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="pl-8 h-14 text-lg border-2 border-slate-300 focus:border-green-500 rounded-xl"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="valor-dia" className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Valor por Día
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg font-semibold">$</span>
            <Input
              id="valor-dia"
              type="number"
              value={valorPorDia === 0 ? '' : valorPorDia}
              onChange={(e) => onValorPorDiaChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="pl-8 h-14 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <Label htmlFor="valor-mes" className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-purple-600" />
            Valor por Mes
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg font-semibold">$</span>
            <Input
              id="valor-mes"
              type="number"
              value={valorPorMes === 0 ? '' : valorPorMes}
              onChange={(e) => onValorPorMesChange(parseFloat(e.target.value) || 0)}
              placeholder="0"
              className="pl-8 h-14 text-lg border-2 border-slate-300 focus:border-purple-500 rounded-xl"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
        <p className="text-base text-blue-700 font-medium leading-relaxed">
          <strong>Nota:</strong> Defina al menos uno de los valores de alquiler (hora, día o mes) para crear la tarifa. 
          Los valores que no se especifiquen quedarán en blanco y no se aplicarán.
        </p>
      </div>
    </div>
  );
};

export default TarifaAlquilerForm;
