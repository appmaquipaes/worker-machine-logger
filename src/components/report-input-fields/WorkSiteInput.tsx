
import React, { useState } from 'react';
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
  const [selectedFinca, setSelectedFinca] = useState<string>('');

  // Mostrar para Horas Trabajadas Y Horas Extras
  if (reportType !== 'Horas Trabajadas' && reportType !== 'Horas Extras') {
    return null;
  }

  const handleClienteChange = (cliente: string) => {
    console.log('🔄 Cliente seleccionado en WorkSiteInput:', cliente);
    onClienteChangeForWorkSite(cliente);
    setSelectedFinca(''); // Reset finca when cliente changes
  };

  const handleFincaChange = (finca: string) => {
    console.log('🔄 Finca seleccionada en WorkSiteInput:', finca);
    setSelectedFinca(finca);
    
    // Si hay finca seleccionada, usar cliente + finca como workSite
    if (finca && workSite) {
      const nuevoWorkSite = finca ? `${workSite} - ${finca}` : workSite;
      console.log('🎯 Nuevo workSite:', nuevoWorkSite);
      // No necesitamos llamar onClienteChangeForWorkSite aquí porque es solo para mostrar
    }
  };

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
        selectedFinca={selectedFinca}
        onClienteChange={handleClienteChange}
        onFincaChange={handleFincaChange}
      />
    </div>
  );
};

export default WorkSiteInput;
