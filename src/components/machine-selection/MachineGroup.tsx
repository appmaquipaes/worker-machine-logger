
import React from 'react';
import { Machine } from '@/context/MachineContext';
import MachineCard from './MachineCard';
import { Separator } from '@/components/ui/separator';

interface MachineGroupProps {
  title: string;
  machines: Machine[];
  selectedMachine: Machine | null;
  onMachineSelect: (machine: Machine) => void;
  icon: React.ReactNode;
  description: string;
  groupIndex: number;
}

const MachineGroup: React.FC<MachineGroupProps> = ({ 
  title, 
  machines, 
  selectedMachine, 
  onMachineSelect, 
  icon,
  description,
  groupIndex
}) => {
  if (machines.length === 0) return null;

  return (
    <div 
      className="space-y-6 animate-fade-in"
      style={{
        animationDelay: `${groupIndex * 200}ms`,
        animationFillMode: 'both'
      }}
    >
      {/* Group Header */}
      <div className="relative">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 hover:rotate-3">
            {icon}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-blue-700 transition-colors">
              {title}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full px-4 py-2 border border-blue-200">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
            <span className="text-blue-700 text-sm font-medium">{machines.length} disponibles</span>
          </div>
        </div>
        
        <Separator className="bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>

      {/* Machines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {machines.map((machine, index) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            isSelected={selectedMachine?.id === machine.id}
            onClick={() => onMachineSelect(machine)}
            index={index}
          />
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="pt-8">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default MachineGroup;
