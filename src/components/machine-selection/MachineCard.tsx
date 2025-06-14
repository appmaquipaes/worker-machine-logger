
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Machine } from '@/context/MachineContext';
import { Truck, Settings, Wrench, Fuel } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const MachineCard: React.FC<MachineCardProps> = ({ 
  machine, 
  isSelected, 
  onClick,
  index 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'bg-emerald-500 shadow-emerald-500/25';
      case 'En Uso': return 'bg-amber-500 shadow-amber-500/25';
      case 'Mantenimiento': return 'bg-red-500 shadow-red-500/25';
      default: return 'bg-slate-400 shadow-slate-400/25';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'Disponible': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'En Uso': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Mantenimiento': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getMachineIcon = (type: string) => {
    if (['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(type)) {
      return <Truck className="w-8 h-8 text-blue-600" />;
    }
    if (type.includes('Excavadora') || type.includes('Bulldozer')) {
      return <Settings className="w-8 h-8 text-orange-600" />;
    }
    return <Wrench className="w-8 h-8 text-slate-600" />;
  };

  return (
    <Card 
      className={`
        relative overflow-hidden cursor-pointer group
        transform transition-all duration-500 ease-out
        hover:scale-[1.03] hover:shadow-2xl hover:-translate-y-2
        ${isSelected 
          ? 'ring-4 ring-blue-500 ring-offset-4 shadow-2xl scale-[1.02] bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-300' 
          : 'hover:border-blue-300 bg-white border-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:to-blue-50'
        }
        rounded-2xl border-2 shadow-lg
        animate-fade-in
      `}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
      onClick={onClick}
    >
      {/* Gradient overlay for hover effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500
        ${isSelected ? 'opacity-100' : ''}
      `} />
      
      {/* Status indicator */}
      <div className={`
        absolute top-4 right-4 w-3 h-3 rounded-full 
        ${getStatusColor(machine.status)}
        animate-pulse shadow-lg
      `} />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`
            w-16 h-16 rounded-2xl flex items-center justify-center
            transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
            ${isSelected 
              ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg' 
              : 'bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-indigo-100'
            }
          `}>
            {getMachineIcon(machine.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-bold text-lg mb-1 truncate
              transition-colors duration-300
              ${isSelected ? 'text-blue-800' : 'text-slate-800 group-hover:text-blue-700'}
            `}>
              {machine.name}
            </h3>
            <p className={`
              text-sm font-medium truncate
              transition-colors duration-300
              ${isSelected ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-600'}
            `}>
              {machine.type}
            </p>
          </div>
        </div>

        {machine.plate && (
          <div className="mb-3">
            <div className={`
              inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold
              transition-all duration-300 group-hover:scale-105
              ${isSelected 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700'
              }
            `}>
              <span>📋</span>
              <span>{machine.plate}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <Badge 
            variant="outline"
            className={`
              border-2 font-medium text-xs px-3 py-1
              transition-all duration-300 group-hover:scale-105
              ${getStatusTextColor(machine.status)}
            `}
          >
            {machine.status}
          </Badge>
          
          <div className="flex items-center gap-1">
            <Fuel className={`
              w-4 h-4 transition-all duration-300
              ${isSelected ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}
            `} />
            <span className={`
              text-xs font-medium transition-colors duration-300
              ${isSelected ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}
            `}>
              Operativa
            </span>
          </div>
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
        )}
      </CardContent>
    </Card>
  );
};

export default MachineCard;
