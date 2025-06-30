
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ObservationsSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const ObservationsSection: React.FC<ObservationsSectionProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="observaciones" className="text-lg font-bold text-slate-700">
        Observaciones
      </Label>
      <Textarea
        id="observaciones"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Observaciones adicionales sobre esta tarifa..."
        className="min-h-[120px] text-base border-2 border-slate-300 focus:border-blue-500 rounded-lg"
      />
    </div>
  );
};

export default ObservationsSection;
