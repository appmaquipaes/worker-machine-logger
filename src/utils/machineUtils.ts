import React from 'react';
import { Truck, Wrench, Building, Loader2 } from 'lucide-react';

export const getMachineIcon = (type: string) => {
  switch (type) {
    case 'Camión':
    case 'Volqueta':
    case 'Camabaja':
    case 'Semirremolque':
    case 'Tractomula':
      return React.createElement(Truck, { size: 36 });
    case 'Excavadora':
    case 'Bulldozer':
    case 'Motoniveladora':
    case 'Paladraga':
      return React.createElement(Building, { size: 36 });
    case 'Cargador':
    case 'Compactador':
      return React.createElement(Loader2, { size: 36 });
    default:
      return React.createElement(Wrench, { size: 36 });
  }
};

export const getMachineImage = (type: string) => {
  switch (type.toLowerCase()) {
    case 'camión':
    case 'volqueta':
      return "/cat315-excavator.jpg"; // Usando la imagen existente como placeholder
    case 'excavadora':
      return "/cat315-excavator.jpg";
    case 'bulldozer':
      return "/cat315-excavator.jpg";
    case 'compactador':
      return "/cat315-excavator.jpg";
    case 'cargador':
      return "/cat315-excavator.jpg";
    case 'motoniveladora':
      return "/cat315-excavator.jpg";
    case 'paladraga':
      return "/cat315-excavator.jpg";
    case 'camabaja':
    case 'semirremolque':
    case 'tractomula':
      return "/cat315-excavator.jpg";
    default:
      return "/cat315-excavator.jpg";
  }
};

export const groupMachinesByType = (machines: any[]) => {
  return machines.reduce((groups, machine) => {
    const key = machine.type;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(machine);
    return groups;
  }, {} as Record<string, typeof machines>);
};

export const MACHINE_ORDER = [
  'Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula',
  'Excavadora', 'Bulldozer', 'Cargador', 'Motoniveladora', 'Compactador', 'Paladraga'
];
