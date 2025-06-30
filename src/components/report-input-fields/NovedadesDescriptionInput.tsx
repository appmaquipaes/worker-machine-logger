
import React from 'react';
import { ReportType } from '@/types/report';
import { FileText } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NovedadesDescriptionInputProps {
  reportType: ReportType;
  description: string;
  setDescription: (value: string) => void;
}

const NovedadesDescriptionInput: React.FC<NovedadesDescriptionInputProps> = ({
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
        <FileText size={24} className="text-purple-600" />
        <Label htmlFor="description" className="text-lg">Descripción de la Novedad</Label>
      </div>
      <Textarea 
        id="description"
        placeholder="Describe detalladamente la novedad o incidente..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="text-lg p-6 min-h-[120px]"
        required
      />
    </div>
  );
};

export default NovedadesDescriptionInput;
