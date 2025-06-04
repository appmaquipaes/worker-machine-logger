
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Machine } from '@/context/MachineContext';
import { getMachineIcon, getMachineImage } from '@/utils/machineUtils';

interface MachineCardProps {
  machine: Machine;
  onSelect: (machine: Machine) => void;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine, onSelect }) => {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <Button
        onClick={() => onSelect(machine)}
        className="w-full h-auto p-6 flex flex-col items-center gap-4 text-lg font-medium bg-transparent hover:bg-slate-700/50 text-white"
        variant="ghost"
      >
        <div className="mb-3 w-32 h-32 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
          {machine.imageUrl ? (
            <Avatar className="w-full h-full rounded-xl">
              <AvatarImage src={machine.imageUrl} alt={machine.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-amber-500 w-full h-full flex items-center justify-center rounded-xl text-slate-900">
                {getMachineIcon(machine.type)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <AspectRatio ratio={1 / 1} className="bg-gradient-to-br from-yellow-400 to-amber-500 w-full rounded-xl flex items-center justify-center shadow-inner">
              <div className="text-slate-900 text-4xl font-bold flex items-center justify-center w-full h-full">
                {getMachineIcon(machine.type)}
              </div>
            </AspectRatio>
          )}
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-yellow-400 mb-1">{machine.name}</h3>
          <p className="text-slate-300 text-lg font-medium">{machine.type}</p>
          {machine.plate && (
            <p className="text-sm mt-2 font-medium text-amber-400">Placa: {machine.plate}</p>
          )}
          <div className="mt-3">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              machine.status === 'available' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : machine.status === 'in-use'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              {machine.status === 'available' ? 'Disponible' : 
               machine.status === 'in-use' ? 'En uso' : 'Mantenimiento'}
            </span>
          </div>
        </div>
      </Button>
    </Card>
  );
};

export default MachineCard;
