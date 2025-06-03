
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Button
        onClick={() => onSelect(machine)}
        className="w-full h-auto p-6 flex flex-col items-center gap-4 text-lg font-medium"
        variant="ghost"
      >
        <div className="mb-3 w-32 h-32 flex items-center justify-center">
          {machine.imageUrl ? (
            <Avatar className="w-full h-full rounded-md">
              <AvatarImage src={machine.imageUrl} alt={machine.name} className="object-cover" />
              <AvatarFallback className="bg-primary/20 w-full h-full flex items-center justify-center rounded-md">
                {getMachineIcon(machine.type)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <AspectRatio ratio={1 / 1} className="bg-primary/20 w-full rounded-md flex items-center justify-center">
              <img 
                src={getMachineImage(machine.type)} 
                alt={machine.type}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const iconContainer = e.currentTarget.parentElement;
                  if (iconContainer && !iconContainer.querySelector('.fallback-icon')) {
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'fallback-icon flex items-center justify-center w-full h-full text-2xl';
                    iconDiv.textContent = machine.type[0];
                    iconContainer.appendChild(iconDiv);
                  }
                }}
                className="object-contain p-2 max-h-28"
              />
            </AspectRatio>
          )}
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold">{machine.name}</h3>
          <p className="text-muted-foreground">{machine.type}</p>
          {machine.plate && (
            <p className="text-sm mt-1 font-medium">Placa: {machine.plate}</p>
          )}
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
              machine.status === 'available' 
                ? 'bg-green-100 text-green-800' 
                : machine.status === 'in-use'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
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
