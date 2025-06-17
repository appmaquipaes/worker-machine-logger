
import { ReportType } from '@/types/report';
import { 
  Clock, 
  AlarmClock, 
  Wrench as ToolIcon, 
  Fuel, 
  Info, 
  Truck,
  Recycle
} from 'lucide-react';

export const useReportTypeConfig = () => {
  const getAllReportTypes = () => [
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
    },
    { 
      type: 'Recepción Escombrera' as ReportType, 
      icon: Recycle, 
      label: 'Recepción Escombrera', 
      gradient: 'from-teal-500 via-teal-600 to-teal-700',
      hoverGradient: 'hover:from-teal-600 hover:via-teal-700 hover:to-teal-800',
      bgColor: 'bg-teal-50/80', 
      borderColor: 'border-teal-200',
      textColor: 'text-teal-700',
      description: 'Recepción de material en escombrera'
    }
  ];

  return {
    getAllReportTypes
  };
};
