
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Machine } from '@/context/MachineContext';
import { getMachineImage, getMachineIcon } from '@/utils/machineUtils';
import { PlayCircle, Zap, CheckCircle } from 'lucide-react';

interface MachineCardProps {
  machine: Machine;
  onSelect: (machine: Machine) => void;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine, onSelect }) => {
  const getStatusInfo = (status: Machine['status']) => {
    switch (status) {
      case 'available':
        return {
          color: 'bg-emerald-500/20 text-emerald-700 border-emerald-300',
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'Disponible'
        };
      case 'in-use':
        return {
          color: 'bg-amber-500/20 text-amber-700 border-amber-300',
          icon: <Zap className="w-4 h-4" />,
          text: 'En Uso'
        };
      case 'maintenance':
        return {
          color: 'bg-red-500/20 text-red-700 border-red-300',
          icon: <PlayCircle className="w-4 h-4" />,
          text: 'Mantenimiento'
        };
      default:
        return {
          color: 'bg-slate-500/20 text-slate-700 border-slate-300',
          icon: <PlayCircle className="w-4 h-4" />,
          text: 'Desconocido'
        };
    }
  };

  const statusInfo = getStatusInfo(machine.status);

  return (
    <Card className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-3xl cursor-pointer transform hover:scale-[1.02]">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-20">
        <Badge className={`${statusInfo.color} border backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5 font-medium`}>
          {statusInfo.icon}
          {statusInfo.text}
        </Badge>
      </div>

      <div 
        onClick={() => onSelect(machine)}
        className="relative p-6 space-y-6"
      >
        {/* Machine Image Container */}
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-50 group-hover:to-amber-50 transition-all duration-500">
            <img
              src={getMachineImage(machine.type)}
              alt={machine.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/lovable-uploads/976ad6e4-5509-4133-8fc5-949f8420ae1e.png';
              }}
            />
          </div>
          
          {/* Floating Icon */}
          <div className="absolute -bottom-4 left-6 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
            <div className="text-blue-600">
              {getMachineIcon(machine.type)}
            </div>
          </div>
        </div>

        {/* Machine Info */}
        <div className="space-y-4 pt-2">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors duration-300">
              {machine.name}
            </h3>
            <p className="text-lg text-slate-600 font-medium">
              {machine.type}
            </p>
          </div>

          {machine.plate && (
            <div className="inline-flex items-center gap-2 bg-slate-100 rounded-xl px-4 py-2">
              <span className="text-slate-600 text-sm font-medium">Placa:</span>
              <span className="text-slate-800 font-bold">{machine.plate}</span>
            </div>
          )}

          {/* Action Hint */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <span className="text-slate-500 text-sm">Toca para seleccionar</span>
            <div className="flex items-center gap-2 text-blue-600 group-hover:text-blue-700 group-hover:gap-3 transition-all duration-300">
              <span className="font-semibold">Seleccionar</span>
              <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MachineCard;
