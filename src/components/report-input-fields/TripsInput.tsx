
import React from 'react';
import { Truck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ReportType } from '@/types/report';

interface TripsInputProps {
  reportType: ReportType;
  trips?: number;
  setTrips: (value: number | undefined) => void;
}

const TripsInput: React.FC<TripsInputProps> = ({
  reportType,
  trips,
  setTrips
}) => {
  if (reportType !== 'Viajes') {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Truck size={24} />
        <Label htmlFor="trips" className="text-lg">Número de Viajes</Label>
      </div>
      <Input 
        id="trips"
        type="number"
        min="1"
        placeholder="Ej: 5"
        value={trips === undefined ? '' : trips}
        onChange={(e) => setTrips(parseInt(e.target.value) || undefined)}
        className="text-lg p-6"
      />
    </div>
  );
};

export default TripsInput;
