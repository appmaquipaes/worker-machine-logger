
import React from 'react';
import { Machine } from '@/context/MachineContext';

interface MachineInfoDisplayProps {
  selectedMachine: Machine;
}

const MachineInfoDisplay: React.FC<MachineInfoDisplayProps> = ({ selectedMachine }) => {
  const isTransportVehicle = ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(selectedMachine.type);

  return (
    <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50/90 via-white to-indigo-50/90 rounded-2xl border-2 border-blue-200/50 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="relative">
          <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-4 h-4 bg-emerald-400 rounded-full animate-ping"></div>
        </div>
        <p className="text-blue-800 font-semibold text-lg tracking-tight">
          {isTransportVehicle 
            ? `Registrando datos para: ${selectedMachine.type} ${selectedMachine.name}`
            : `Registrando datos para: ${selectedMachine.type} ${selectedMachine.name}`
          }
        </p>
      </div>
      {selectedMachine.plate && (
        <p className="text-blue-600 text-base font-medium">Placa: {selectedMachine.plate}</p>
      )}
    </div>
  );
};

export default MachineInfoDisplay;
