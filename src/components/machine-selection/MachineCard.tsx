
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
    <Card className="machine-card group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 hover:from-blue-50 hover:to-slate-100 transition-all duration-500">
      <Button
        onClick={() => onSelect(machine)}
        className="w-full h-full p-0 bg-transparent hover:bg-transparent text-slate-800 flex flex-col relative"
        variant="ghost"
      >
        {/* Imagen principal con efecto de zoom */}
        <div className="relative w-full h-48 sm:h-56 overflow-hidden rounded-t-lg">
          {machine.imageUrl || machineImage ? (
            <div className="relative w-full h-full bg-gradient-to-br from-slate-100 to-slate-200">
              <img 
                src={machine.imageUrl || machineImage} 
                alt={machine.name}
                className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out filter drop-shadow-xl"
                style={{
                  imageRendering: 'crisp-edges',
                }}
              />
              {/* Overlay gradient sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
              <div className="text-white p-6 rounded-full bg-white/20 backdrop-blur-sm">
                {getMachineIcon(machine.type)}
              </div>
            </div>
          )}
          
          {/* Badge de estado flotante */}
          <div className="absolute top-3 right-3">
            <div className={`
              px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border
              ${machine.status === 'available' ? 'bg-green-500/90 text-white border-green-400' : 
                machine.status === 'in-use' ? 'bg-orange-500/90 text-white border-orange-400' : 'bg-red-500/90 text-white border-red-400'}
            `}>
              {machine.status === 'available' ? '✓ Disponible' : 
               machine.status === 'in-use' ? '⚡ En Uso' : '⚠ Mantenimiento'}
            </div>
          </div>
        </div>

        {/* Información de la máquina con mejor espaciado */}
        <div className="w-full p-6 text-center space-y-3">
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-slate-800 leading-tight group-hover:text-blue-700 transition-colors duration-300">
              {machine.name}
            </h3>
            <p className="text-slate-600 font-medium text-lg">
              {machine.type}
            </p>
          </div>
          
          {machine.plate && (
            <div className="inline-block bg-slate-100 group-hover:bg-blue-100 px-4 py-2 rounded-full transition-colors duration-300">
              <p className="text-sm text-slate-700 font-semibold">
                {machine.plate}
              </p>
            </div>
          )}
          
          {/* Botón de acción */}
          <div className="pt-2">
            <div className={`
              inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 group-hover:scale-105
              ${machine.status === 'available' ? 'bg-blue-600 text-white group-hover:bg-blue-700 shadow-lg' : 
                'bg-slate-300 text-slate-600 cursor-not-allowed'}
            `}>
              {machine.status === 'available' ? (
                <>
                  <span>Seleccionar</span>
                  <span className="text-lg">→</span>
                </>
              ) : (
                <span>No Disponible</span>
              )}
            </div>
          </div>
        </div>
      </Button>
    </Card>
  );
};

export default MachineCard;
