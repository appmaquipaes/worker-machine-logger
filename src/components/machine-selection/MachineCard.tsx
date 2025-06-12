
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Machine } from '@/context/MachineContext';
import { getMachineIcon, getMachineImage } from '@/utils/machineUtils';

interface MachineCardProps {
  machine: Machine;
  onSelect: (machine: Machine) => void;
}

const MachineCard: React.FC<MachineCardProps> = ({ machine, onSelect }) => {
  const machineImage = getMachineImage(machine.type);

  return (
    <Card className="machine-card overflow-hidden">
      <Button
        onClick={() => onSelect(machine)}
        className="w-full h-auto p-6 bg-transparent hover:bg-slate-50 text-slate-800 flex flex-col items-center gap-4"
        variant="ghost"
      >
        {/* Imagen/Icono de la máquina optimizada */}
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg overflow-hidden">
            {machine.imageUrl || machineImage ? (
              <img 
                src={machine.imageUrl || machineImage} 
                alt={machine.name}
                className="w-full h-full object-cover rounded-2xl filter brightness-110 contrast-110"
                style={{
                  imageRendering: 'crisp-edges',
                  objectFit: 'cover',
                  objectPosition: 'center'
                }}
              />
            ) : (
              <div className="text-white mobile-icon-large">
                {getMachineIcon(machine.type)}
              </div>
            )}
          </div>
          
          {/* Badge de estado */}
          <div className="absolute -bottom-2 -right-2">
            <span className={`
              status-badge text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md
              ${machine.status === 'available' ? 'bg-green-500 text-white' : 
                machine.status === 'in-use' ? 'bg-orange-500 text-white' : 'bg-red-500 text-white'}
            `}>
              {machine.status === 'available' ? '✓' : 
               machine.status === 'in-use' ? '⚡' : '⚠'}
            </span>
          </div>
        </div>

        {/* Información de la máquina */}
        <div className="text-center space-y-2">
          <h3 className="font-bold text-lg text-slate-800 leading-tight">
            {machine.name}
          </h3>
          <p className="text-slate-600 font-medium text-base">
            {machine.type}
          </p>
          {machine.plate && (
            <p className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
              {machine.plate}
            </p>
          )}
          
          {/* Estado textual */}
          <div className="mt-3">
            <span className={`
              inline-block px-4 py-2 rounded-full text-sm font-semibold
              ${machine.status === 'available' ? 'bg-green-100 text-green-800' : 
                machine.status === 'in-use' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}
            `}>
              {machine.status === 'available' ? 'Disponible' : 
               machine.status === 'in-use' ? 'En Uso' : 'Mantenimiento'}
            </span>
          </div>
        </div>
      </Button>
    </Card>
  );
};

export default MachineCard;
