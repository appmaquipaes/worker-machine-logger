
import React from 'react';
import { Machine } from '@/context/MachineContext';
import MachineCard from './MachineCard';

interface MachineGroupProps {
  type: string;
  machines: Machine[];
  onSelectMachine: (machine: Machine) => void;
}

const MachineGroup: React.FC<MachineGroupProps> = ({ type, machines, onSelectMachine }) => {
  if (!machines || machines.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* Header del grupo con mejor diseño */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold">
            {type}s
          </h2>
          <span className="bg-white/20 text-sm font-semibold px-3 py-1 rounded-full">
            {machines.length}
          </span>
        </div>
      </div>
      
      {/* Grid de máquinas con mejor espaciado */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
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
