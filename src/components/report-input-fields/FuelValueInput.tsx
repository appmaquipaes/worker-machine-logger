
import React from 'react';
import { ReportType } from '@/types/report';
import { DollarSign, Fuel } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface FuelValueInputProps {
  reportType: ReportType;
  value?: number;
  setValue: (value: number | undefined) => void;
  kilometraje?: number;
  setKilometraje: (value: number | undefined) => void;
}

const FuelValueInput: React.FC<FuelValueInputProps> = ({
  reportType,
  value,
  setValue,
  kilometraje,
  setKilometraje
}) => {
  if (reportType !== 'Combustible') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Campo de valor para combustible */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={24} className="text-green-600" />
          <Label htmlFor="fuel-value" className="text-lg">Valor del Combustible</Label>
        </div>
        <Input 
          id="fuel-value"
          type="number"
          min="0"
          step="1000"
          placeholder="Ej: 150000"
          value={value === undefined ? '' : value}
          onChange={(e) => setValue(parseFloat(e.target.value) || undefined)}
          className="text-lg p-6"
          required
        />
      </div>

      {/* Campo de kilometraje */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Fuel size={24} className="text-blue-600" />
          <Label htmlFor="kilometraje" className="text-lg">Kilometraje Actual</Label>
        </div>
        <Input 
          id="kilometraje"
          type="number"
          min="0"
          placeholder="Ej: 125000"
          value={kilometraje === undefined ? '' : kilometraje}
          onChange={(e) => setKilometraje(parseFloat(e.target.value) || undefined)}
          className="text-lg p-6"
          required
        />
      </div>
    </div>
  );
};

export default FuelValueInput;
