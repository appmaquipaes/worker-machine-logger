
import React from 'react';
import { Button } from '@/components/ui/button';
import { ReportType } from '@/types/report';
import { LucideIcon, CheckCircle } from 'lucide-react';

interface ReportTypeCardProps {
  type: ReportType;
  icon: LucideIcon;
  label: string;
  gradient: string;
  hoverGradient: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const ReportTypeCard: React.FC<ReportTypeCardProps> = ({
  type,
  icon: Icon,
  label,
  gradient,
  hoverGradient,
  bgColor,
  borderColor,
  textColor,
  description,
  isSelected,
  onClick
}) => {
  return (
    <Button
      type="button"
      variant="ghost"
      className={`
        relative overflow-hidden h-auto py-8 px-6 rounded-2xl border-2 
        transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl group
        backdrop-blur-sm font-semibold
        ${isSelected 
          ? `bg-gradient-to-br ${gradient} text-white border-transparent shadow-2xl scale-[1.03] ring-4 ring-blue-200/50` 
          : `bg-white/90 ${bgColor} ${borderColor} hover:${bgColor} text-slate-700 shadow-lg hover:shadow-xl`
        }
      `}
      onClick={onClick}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div className={`
            p-5 rounded-2xl transition-all duration-300 shadow-lg
            ${isSelected 
              ? 'bg-white/20 shadow-white/30 backdrop-blur-sm' 
              : `${bgColor} group-hover:scale-110 shadow-slate-200/50 backdrop-blur-sm`
            }
          `}>
            <Icon className="w-10 h-10" strokeWidth={2.5} />
          </div>
          {isSelected && (
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
            ${isSelected ? 'text-white/90' : textColor}
          `}>
            {description}
          </p>
          <div className={`
            w-full h-1.5 rounded-full transition-all duration-300
            ${isSelected ? 'bg-white/40' : 'bg-transparent'}
          `} />
        </div>
      </div>
      
      {/* Efecto de hover mejorado */}
      {!isSelected && (
        <div className={`
          absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 
          group-hover:opacity-10 transition-opacity duration-300 rounded-2xl
        `} />
      )}
    </Button>
  );
};

export default ReportTypeCard;
