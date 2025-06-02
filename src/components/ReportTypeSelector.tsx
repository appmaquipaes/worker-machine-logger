
import React from 'react';
import { Button } from '@/components/ui/button';
import { ReportType } from '@/context/ReportContext';
import { Machine } from '@/context/MachineContext';
import { 
  Clock, 
  AlarmClock, 
  Wrench as ToolIcon, 
  Fuel, 
  Info, 
  Truck
} from 'lucide-react';

interface ReportTypeSelectorProps {
  reportType: ReportType;
  onReportTypeChange: (type: ReportType) => void;
  selectedMachine?: Machine;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  reportType,
  onReportTypeChange,
  selectedMachine
}) => {
  const allReportTypes = [
    { type: 'Horas Trabajadas' as ReportType, icon: Clock, label: 'Horas Trabajadas' },
    { type: 'Horas Extras' as ReportType, icon: AlarmClock, label: 'Horas Extras' },
    { type: 'Mantenimiento' as ReportType, icon: ToolIcon, label: 'Mantenimiento' },
    { type: 'Combustible' as ReportType, icon: Fuel, label: 'Combustible' },
    { type: 'Novedades' as ReportType, icon: Info, label: 'Novedades' },
    { type: 'Viajes' as ReportType, icon: Truck, label: 'Viajes' }
  ];

  // Filtrar tipos de reporte según el tipo de máquina
  const getAvailableReportTypes = () => {
    if (!selectedMachine) return allReportTypes;

    // Tipos de máquina que pueden hacer viajes
    const transportMachines = ['Volqueta', 'Camión', 'Tractomula', 'Semirremolque'];
    
    if (transportMachines.includes(selectedMachine.type)) {
      return allReportTypes; // Todas las opciones disponibles
    } else {
      // Para otras máquinas, excluir "Viajes"
      return allReportTypes.filter(type => type.type !== 'Viajes');
    }
  };

  const reportTypes = getAvailableReportTypes();

  return (
    <div className="space-y-2">
      <p className="text-lg font-medium mb-4">Selecciona el tipo de reporte:</p>
      <div className="grid grid-cols-2 gap-4">
        {reportTypes.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            type="button"
            variant={reportType === type ? 'default' : 'outline'}
            className={`flex flex-col items-center gap-2 h-auto py-4 ${
              reportType === type ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => onReportTypeChange(type)}
          >
            <Icon size={36} />
            <span className="text-lg">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ReportTypeSelector;
