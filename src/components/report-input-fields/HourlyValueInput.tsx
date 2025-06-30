
import React from 'react';
import { ReportType } from '@/types/report';
import { DollarSign } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface HourlyValueInputProps {
  reportType: ReportType;
  value?: number;
  setValue: (value: number | undefined) => void;
}

const HourlyValueInput: React.FC<HourlyValueInputProps> = ({
  reportType,
  value,
  setValue
}) => {
  if (reportType !== 'Horas Trabajadas' && reportType !== 'Horas Extras') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={24} className="text-green-600" />
          <Label htmlFor="hourly-value" className="text-lg font-semibold text-slate-800">
            Valor por Hora
          </Label>
        </div>
        <Input 
          id="hourly-value"
          type="number"
          min="0"
          step="1000"
          placeholder="Ej: 160000"
          value={value === undefined ? '' : value}
          onChange={(e) => setValue(parseFloat(e.target.value) || undefined)}
          className="text-lg p-6 border-2 border-slate-300 focus:border-green-500 rounded-xl"
          required
        />
        <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          💡 <strong>Importante:</strong> Ingresa el valor que se cobra por cada hora trabajada. 
          El sistema calculará automáticamente el total multiplicando las horas por este valor.
        </p>
      </div>
    </div>
  );
};

export default HourlyValueInput;
