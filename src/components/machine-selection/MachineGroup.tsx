
import React from 'react';
import { Machine } from '@/context/MachineContext';
import { getMachineIcon } from '@/utils/machineUtils';
import MachineCard from './MachineCard';

interface MachineGroupProps {
  type: string;
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
}

const MachineGroup: React.FC<MachineGroupProps> = ({ type, machines, onSelectMachine }) => {
  if (!machines || machines.length === 0) return null;

  const getGroupGradient = (type: string) => {
    if (type.includes('Volqueta') || type.includes('Camión') || type.includes('Camabaja') || type.includes('Semirremolque') || type.includes('Tractomula')) {
      return 'from-amber-500 to-orange-600';
    }
    if (type.includes('Retroexcavadora') || type.includes('Bulldozer') || type.includes('Motoniveladora') || type.includes('Paladraga')) {
      return 'from-blue-500 to-indigo-600';
    }
    return 'from-emerald-500 to-teal-600';
  };

  const getGroupEmoji = (type: string) => {
    if (type.includes('Volqueta') || type.includes('Camión') || type.includes('Camabaja') || type.includes('Semirremolque') || type.includes('Tractomula')) {
      return '🚛';
    }
    if (type.includes('Retroexcavadora') || type.includes('Bulldozer') || type.includes('Motoniveladora') || type.includes('Paladraga')) {
      return '🏗️';
    }
    return '⚡';
  };

  return (
    <div className="space-y-8">
      {/* Group Header */}
      <div className="flex items-center gap-6">
        <div className={`w-16 h-16 bg-gradient-to-br ${getGroupGradient(type)} rounded-2xl flex items-center justify-center shadow-lg`}>
          <div className="text-white">
            {getMachineIcon(type)}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{getGroupEmoji(type)}</span>
            <h2 className="text-3xl font-bold text-slate-800">
              {type}
            </h2>
            <div className="bg-slate-200 text-slate-700 rounded-full px-4 py-1 text-sm font-semibold">
              {machines.length} {machines.length === 1 ? 'unidad' : 'unidades'}
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-slate-300 via-slate-200 to-transparent rounded-full"></div>
        </div>
      </div>

      {/* Machines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            onSelect={onSelectMachine}
          />
        ))}
      </div>
    </div>
  );
};

export default MachineGroup;
