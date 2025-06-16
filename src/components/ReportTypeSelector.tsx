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

  console.log('ReportTypeSelector - selectedMachine:', selectedMachine);

  const allReportTypes = [
    { 
      type: 'Horas Trabajadas' as ReportType, 
      icon: Clock, 
      label: 'Horas Trabajadas', 
      gradient: 'from-blue-500 via-blue-600 to-blue-700',
      hoverGradient: 'hover:from-blue-600 hover:via-blue-700 hover:to-blue-800',
      bgColor: 'bg-blue-50/80', 
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'Registra el tiempo de operación'
    },
    { 
      type: 'Horas Extras' as ReportType, 
      icon: AlarmClock, 
      label: 'Horas Extras', 
      gradient: 'from-purple-500 via-purple-600 to-purple-700',
      hoverGradient: 'hover:from-purple-600 hover:via-purple-700 hover:to-purple-800',
      bgColor: 'bg-purple-50/80', 
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'Tiempo adicional trabajado'
    },
    { 
      type: 'Mantenimiento' as ReportType, 
      icon: ToolIcon, 
      label: 'Mantenimiento', 
      gradient: 'from-orange-500 via-orange-600 to-orange-700',
      hoverGradient: 'hover:from-orange-600 hover:via-orange-700 hover:to-orange-800',
      bgColor: 'bg-orange-50/80', 
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      description: 'Servicios y reparaciones'
    },
    { 
      type: 'Combustible' as ReportType, 
      icon: Fuel, 
      label: 'Combustible', 
      gradient: 'from-emerald-500 via-emerald-600 to-emerald-700',
      hoverGradient: 'hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800',
      bgColor: 'bg-emerald-50/80', 
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'Registro de combustible'
    },
    { 
      type: 'Novedades' as ReportType, 
      icon: Info, 
      label: 'Novedades', 
      gradient: 'from-slate-500 via-slate-600 to-slate-700',
      hoverGradient: 'hover:from-slate-600 hover:via-slate-700 hover:to-slate-800',
      bgColor: 'bg-slate-50/80', 
      borderColor: 'border-slate-200',
      textColor: 'text-slate-700',
      description: 'Incidentes y observaciones'
    },
    { 
      type: 'Viajes' as ReportType, 
      icon: Truck, 
      label: 'Viajes', 
      gradient: 'from-amber-500 via-yellow-500 to-yellow-600',
      hoverGradient: 'hover:from-amber-600 hover:via-yellow-600 hover:to-yellow-700',
      bgColor: 'bg-amber-50/80', 
      borderColor: 'border-amber-200',
      textColor: 'text-amber-700',
      description: 'Transporte de materiales'
    }
  ];

  // Obtener tipos de reporte disponibles según la máquina seleccionada
  const availableReportTypeStrings = getAvailableReportTypes(selectedMachine);
  console.log('ReportTypeSelector - availableReportTypeStrings:', availableReportTypeStrings);
  
  const availableReportTypes = allReportTypes.filter(reportTypeItem => 
    availableReportTypeStrings.includes(reportTypeItem.type)
  );
  
  console.log('ReportTypeSelector - filtered availableReportTypes:', availableReportTypes.map(rt => rt.type));

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
          Selecciona el tipo de reporte
        </h3>
        <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
          {selectedMachine && ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(selectedMachine.type) 
            ? 'Registra la actividad realizada con este vehículo de transporte'
            : 'Registra la actividad realizada con esta máquina'
          }
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableReportTypes.map(({ 
          type, 
          icon: Icon, 
          label, 
          gradient, 
          hoverGradient,
          bgColor, 
          borderColor,
          textColor,
          description 
        }) => (
          <Button
            key={type}
            type="button"
            variant="ghost"
            className={`
              relative overflow-hidden h-auto py-8 px-6 rounded-2xl border-2 
              transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl group
              backdrop-blur-sm font-semibold
              ${reportType === type 
                ? `bg-gradient-to-br ${gradient} text-white border-transparent shadow-2xl scale-[1.03] ring-4 ring-blue-200/50` 
                : `bg-white/90 ${bgColor} ${borderColor} hover:${bgColor} text-slate-700 shadow-lg hover:shadow-xl`
              }
            `}
            onClick={() => onReportTypeChange(type)}
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className={`
                  p-5 rounded-2xl transition-all duration-300 shadow-lg
                  ${reportType === type 
                    ? 'bg-white/20 shadow-white/30 backdrop-blur-sm' 
                    : `${bgColor} group-hover:scale-110 shadow-slate-200/50 backdrop-blur-sm`
                  }
                `}>
                  <Icon className="w-10 h-10" strokeWidth={2.5} />
                </div>
                {reportType === type && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-xl animate-bounce-in">
                    <CheckCircle className="w-5 h-5 text-emerald-500" strokeWidth={2.5} />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-3">
                <span className="font-bold text-lg leading-tight block tracking-tight">
                  {label}
                </span>
                <p className={`
                  text-sm leading-snug opacity-80 font-medium
                  ${reportType === type ? 'text-white/90' : textColor}
                `}>
                  {description}
                </p>
                <div className={`
                  w-full h-1.5 rounded-full transition-all duration-300
                  ${reportType === type ? 'bg-white/40' : 'bg-transparent'}
                `} />
              </div>
            </div>
            
            {/* Efecto de hover mejorado */}
            {reportType !== type && (
              <div className={`
                absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 
                group-hover:opacity-10 transition-opacity duration-300 rounded-2xl
              `} />
            )}
          </Button>
        ))}
      </div>

      {selectedMachine && (
        <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/90 rounded-2xl border-2 border-blue-200/50 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="relative">
              <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <p className="text-blue-800 font-semibold text-lg tracking-tight">
              {['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(selectedMachine.type) 
                ? `Registrando datos para: ${selectedMachine.type} ${selectedMachine.name}`
                : `Registrando datos para: ${selectedMachine.type} ${selectedMachine.name}`
              }
            </p>
          </div>
          {selectedMachine.plate && (
            <p className="text-blue-600 text-base font-medium">Placa: {selectedMachine.plate}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportTypeSelector;
