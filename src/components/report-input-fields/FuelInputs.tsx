
import React from 'react';
import { Fuel, Gauge } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ReportType } from '@/types/report';

interface FuelInputsProps {
  reportType: ReportType;
  value?: number;
  setValue: (value: number | undefined) => void;
  kilometraje?: number;
  setKilometraje: (value: number | undefined) => void;
}

const FuelInputs: React.FC<FuelInputsProps> = ({
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
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Gauge size={24} />
          <Label htmlFor="kilometraje" className="text-lg">Kilometraje Actual</Label>
        </div>
        <Input 
          id="kilometraje"
          type="number"
          min="0"
          placeholder="Ej: 150000"
          value={kilometraje === undefined ? '' : kilometraje}
          onChange={(e) => setKilometraje(parseFloat(e.target.value) || undefined)}
          className="text-lg p-6"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Fuel size={24} />
          <Label htmlFor="value" className="text-lg">Valor del Combustible</Label>
        </div>
        <Input 
          id="value"
          type="number"
          min="1"
          placeholder="Ej: 50000"
          value={value === undefined ? '' : value}
          onChange={(e) => setValue(parseFloat(e.target.value) || undefined)}
          className="text-lg p-6"
          required
        />
      </div>
    </>
  );
};

export default FuelInputs;
