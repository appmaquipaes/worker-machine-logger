
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
    { type: 'Horas Trabajadas' as ReportType, icon: Clock, label: 'Horas Trabajadas', color: 'from-blue-500 to-blue-600' },
    { type: 'Horas Extras' as ReportType, icon: AlarmClock, label: 'Horas Extras', color: 'from-purple-500 to-purple-600' },
    { type: 'Mantenimiento' as ReportType, icon: ToolIcon, label: 'Mantenimiento', color: 'from-orange-500 to-orange-600' },
    { type: 'Combustible' as ReportType, icon: Fuel, label: 'Combustible', color: 'from-green-500 to-green-600' },
    { type: 'Novedades' as ReportType, icon: Info, label: 'Novedades', color: 'from-gray-500 to-gray-600' },
    { type: 'Viajes' as ReportType, icon: Truck, label: 'Viajes', color: 'from-amber-500 to-yellow-500' }
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
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-responsive-lg font-bold text-slate-800 mb-2">
          Selecciona el tipo de reporte
        </h3>
        <p className="text-slate-600 text-responsive-base">
          Elige la opción que corresponde a la actividad realizada
        </p>
      </div>
      
      <div className="action-grid gap-4">
        {reportTypes.map(({ type, icon: Icon, label, color }) => (
          <Button
            key={type}
            type="button"
            variant="ghost"
            className={`
              relative overflow-hidden h-auto py-6 px-4 rounded-2xl border-2 
              transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
              ${reportType === type 
                ? `bg-gradient-to-br ${color} text-white border-transparent shadow-xl scale-[1.02] ring-4 ring-blue-200` 
                : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-blue-300 text-slate-700'
              }
            `}
            onClick={() => onReportTypeChange(type)}
          >
            <div className="flex flex-col items-center gap-4">
              <div className={`
                p-4 rounded-2xl transition-all duration-300
                ${reportType === type 
                  ? 'bg-white/20 shadow-lg' 
                  : 'bg-slate-100 group-hover:bg-blue-100'
                }
              `}>
                <Icon className="mobile-icon-large" />
              </div>
              <div className="text-center">
                <span className="font-bold text-responsive-base leading-tight block">
                  {label}
                </span>
                <div className={`
                  w-full h-1 rounded-full mt-2 transition-all duration-300
                  ${reportType === type ? 'bg-white/30' : 'bg-transparent'}
                `} />
              </div>
            </div>
            
            {/* Efecto de brillo para la opción seleccionada */}
            {reportType === type && (
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ReportTypeSelector;
