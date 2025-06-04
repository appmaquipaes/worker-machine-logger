
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
    const transportMachines = ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'];
    
    if (transportMachines.includes(selectedMachine.type)) {
      return allReportTypes; // Todas las opciones disponibles
    } else {
      // Para otras máquinas, excluir "Viajes"
      return allReportTypes.filter(type => type.type !== 'Viajes');
    }
  };

  const reportTypes = getAvailableReportTypes();

  return (
    <div className="space-y-4">
      <p className="text-lg font-medium mb-6 text-slate-700">Selecciona el tipo de reporte:</p>
      <div className="grid grid-cols-2 gap-4">
        {reportTypes.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            type="button"
            variant={reportType === type ? 'default' : 'outline'}
            className={`flex flex-col items-center gap-3 h-auto py-6 px-4 transition-all duration-300 ${
              reportType === type 
                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 text-slate-900 border-yellow-500 shadow-lg scale-105' 
                : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700 hover:border-yellow-400 hover:shadow-md'
            }`}
            onClick={() => onReportTypeChange(type)}
          >
            <div className={`p-2 rounded-full ${
              reportType === type 
                ? 'bg-slate-900/10' 
                : 'bg-slate-100'
            }`}>
              <Icon size={32} />
            </div>
            <span className="text-base font-semibold text-center leading-tight">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ReportTypeSelector;
