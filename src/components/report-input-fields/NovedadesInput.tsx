
import React from 'react';
import { Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ReportType } from '@/types/report';

interface NovedadesInputProps {
  reportType: ReportType;
  description: string;
  setDescription: (value: string) => void;
}

const NovedadesInput: React.FC<NovedadesInputProps> = ({
  reportType,
  description,
  setDescription
}) => {
  if (reportType !== 'Novedades') {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Info size={28} />
        <Label htmlFor="description" className="text-lg">Novedades</Label>
      </div>
      
      <Textarea
        id="description"
        placeholder="Describe las novedades encontradas"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        className="text-lg p-4"
        required
      />
    </div>
  );
};

export default NovedadesInput;
