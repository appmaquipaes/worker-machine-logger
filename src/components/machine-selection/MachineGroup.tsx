
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
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {type}s
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
