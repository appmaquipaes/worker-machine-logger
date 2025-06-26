
import React from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import { ReportType } from '@/types/report';

interface WorkSiteInputProps {
  reportType: ReportType;
  workSite: string;
  onClienteChangeForWorkSite: (cliente: string) => void;
}

const WorkSiteInput: React.FC<WorkSiteInputProps> = ({
  reportType,
  workSite,
  onClienteChangeForWorkSite
}) => {
  // Mostrar para Horas Trabajadas Y Horas Extras
  if (reportType !== 'Horas Trabajadas' && reportType !== 'Horas Extras') {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <MapPin size={24} />
        <Label className="text-lg">
          {reportType === 'Horas Trabajadas' ? 'Cliente del Sitio de Trabajo' : 'Cliente donde se realizaron las Horas Extras'}
        </Label>
      </div>
      <ClienteFincaSelector
        selectedCliente={workSite}
        selectedFinca=""
        onClienteChange={onClienteChangeForWorkSite}
        onFincaChange={() => {}}
      />
    </div>
  );
};

export default WorkSiteInput;
