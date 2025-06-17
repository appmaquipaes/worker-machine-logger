
import React from 'react';
import { Clock, AlarmClock } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ReportType } from '@/types/report';

interface HoursInputProps {
  reportType: ReportType;
  hours?: number;
  setHours: (value: number | undefined) => void;
}

const HoursInput: React.FC<HoursInputProps> = ({
  reportType,
  hours,
  setHours
}) => {
  if (reportType !== 'Horas Trabajadas' && reportType !== 'Horas Extras') {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        {reportType === 'Horas Trabajadas' ? <Clock size={24} /> : <AlarmClock size={24} />}
        <Label htmlFor="hours" className="text-lg">
          {reportType === 'Horas Trabajadas' ? 'Horas Trabajadas' : 'Horas Extras'}
        </Label>
      </div>
      <Input 
        id="hours"
        type="number"
        min="0.1"
        step="0.1"
        placeholder="Ej: 8.5"
        value={hours === undefined ? '' : hours}
        onChange={(e) => setHours(parseFloat(e.target.value) || undefined)}
        className="text-lg p-6"
        required
      />
    </div>
  );
};

export default HoursInput;
