
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMachine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { MapPin, Truck } from 'lucide-react';

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
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="escombrera" className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-orange-600" />
          Escombrera *
        </Label>
        <Select value={escombreraId} onValueChange={onEscombreraChange}>
          <SelectTrigger className="w-full h-14 text-lg border-2 border-slate-300 focus:border-orange-500 rounded-xl">
            <SelectValue placeholder="Selecciona una escombrera" />
          </SelectTrigger>
          <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-xl">
            {escombreras.map((escombrera) => (
              <SelectItem 
                key={escombrera.id} 
                value={escombrera.id}
                className="text-lg p-4 hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-orange-600" />
                  {escombrera.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label htmlFor="valor-sencilla" className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Truck className="h-5 w-5 text-green-600" />
            Valor Volqueta Sencilla *
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg font-semibold">$</span>
            <Input
              id="valor-sencilla"
              type="number"
              placeholder="Ej: 25000"
              value={valorVolquetaSencilla === 0 ? '' : valorVolquetaSencilla}
              onChange={(e) => onValorSencillaChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 h-14 text-lg border-2 border-slate-300 focus:border-green-500 rounded-xl"
            />
          </div>
          <p className="text-sm text-slate-600 bg-green-50 p-3 rounded-lg border border-green-200">
            Tarifa por viaje de volqueta sencilla que ingrese a la escombrera
          </p>
        </div>

        <div className="space-y-4">
          <Label htmlFor="valor-dobletroque" className="text-lg font-bold text-slate-700 flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Valor Volqueta Doble Troque *
          </Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg font-semibold">$</span>
            <Input
              id="valor-dobletroque"
              type="number"
              placeholder="Ej: 45000"
              value={valorVolquetaDobletroque === 0 ? '' : valorVolquetaDobletroque}
              onChange={(e) => onValorDobletroqueChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-8 h-14 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl"
            />
          </div>
          <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            Tarifa por viaje de volqueta doble troque que ingrese a la escombrera
          </p>
        </div>
      </div>

      <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-orange-100 rounded-lg">
            <MapPin className="h-6 w-6 text-orange-600" />
          </div>
          <div className="space-y-2">
            <h4 className="text-lg font-bold text-orange-800">Información Importante</h4>
            <p className="text-base text-orange-700 leading-relaxed">
              Estos valores se aplicarán por cada viaje de volqueta que ingrese a la escombrera del cliente seleccionado. 
              Asegúrese de que ambos valores estén correctamente configurados antes de guardar la tarifa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TarifaEscombreraForm;
