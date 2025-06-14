
import React from 'react';
import { Button } from '@/components/ui/button';
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import { 
  Clock, 
  AlarmClock, 
  Wrench as ToolIcon, 
  Fuel, 
  Info, 
  Truck,
  CheckCircle
} from 'lucide-react';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';

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
  const { getAvailableReportTypes } = useMachineSpecificReports();

  const allReportTypes = [
    { type: 'Horas Trabajadas' as ReportType, icon: Clock, label: 'Horas Trabajadas', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    { type: 'Horas Extras' as ReportType, icon: AlarmClock, label: 'Horas Extras', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
    { type: 'Mantenimiento' as ReportType, icon: ToolIcon, label: 'Mantenimiento', color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
    { type: 'Combustible' as ReportType, icon: Fuel, label: 'Combustible', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    { type: 'Novedades' as ReportType, icon: Info, label: 'Novedades', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Viajes' as ReportType, icon: Truck, label: 'Viajes', color: 'from-amber-500 to-yellow-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' }
  ];

  // Obtener tipos de reporte disponibles según la máquina seleccionada
  const availableReportTypeStrings = getAvailableReportTypes(selectedMachine);
  const availableReportTypes = allReportTypes.filter(reportTypeItem => 
    availableReportTypeStrings.includes(reportTypeItem.type)
  );

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <h3 className="text-2xl font-bold text-slate-800">
          Selecciona el tipo de reporte
        </h3>
        <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
          {selectedMachine && ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(selectedMachine.type) 
            ? 'Registra la actividad realizada con este vehículo de transporte'
            : 'Registra la actividad realizada con esta máquina'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableReportTypes.map(({ type, icon: Icon, label, color, bgColor, textColor }) => (
          <Button
            key={type}
            type="button"
            variant="ghost"
            className={`
              relative overflow-hidden h-auto py-8 px-6 rounded-2xl border-2 
              transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group
              ${reportType === type 
                ? `bg-gradient-to-br ${color} text-white border-transparent shadow-xl scale-[1.02] ring-4 ring-blue-200/50` 
                : `bg-white hover:${bgColor} border-slate-200 hover:border-slate-300 text-slate-700 shadow-md`
              }
            `}
            onClick={() => onReportTypeChange(type)}
          >
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div className={`
                  p-4 rounded-2xl transition-all duration-300 shadow-lg
                  ${reportType === type 
                    ? 'bg-white/20 shadow-white/20' 
                    : `${bgColor} group-hover:scale-110 shadow-slate-200`
                  }
                `}>
                  <Icon className="w-8 h-8" />
                </div>
                {reportType === type && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <span className="font-bold text-base leading-tight block">
                  {label}
                </span>
                <div className={`
                  w-full h-1 rounded-full transition-all duration-300
                  ${reportType === type ? 'bg-white/30' : 'bg-transparent'}
                `} />
              </div>
            </div>
            
            {reportType === type && (
              <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            )}
          </Button>
        ))}
      </div>

      {selectedMachine && (
        <div className="text-center mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-blue-800 font-medium">
              {['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(selectedMachine.type) 
                ? `Registrando datos para: ${selectedMachine.type} ${selectedMachine.name}`
                : `Registrando datos para: ${selectedMachine.type} ${selectedMachine.name}`
              }
            </p>
          </div>
          {selectedMachine.plate && (
            <p className="text-blue-600 text-sm">Placa: {selectedMachine.plate}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportTypeSelector;
