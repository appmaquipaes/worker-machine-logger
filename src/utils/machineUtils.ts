import React from 'react';
import { Truck, Wrench, Building, Loader2, Trash2 } from 'lucide-react';

export const getMachineIcon = (type: string) => {
  switch (type) {
    case 'Camión':
    case 'Volqueta':
    case 'Camabaja':
    case 'Semirremolque':
    case 'Tractomula':
      return React.createElement(Truck, { size: 36 });
    case 'Retroexcavadora de Oruga':
    case 'Retroexcavadora de Llanta':
    case 'Bulldozer':
    case 'Motoniveladora':
    case 'Paladraga':
      return React.createElement(Building, { size: 36 });
    case 'Cargador':
    case 'Vibrocompactador':
      return React.createElement(Loader2, { size: 36 });
    case 'Escombrera':
      return React.createElement(Trash2, { size: 36 });
    default:
      return React.createElement(Wrench, { size: 36 });
  }
};

export const getMachineImage = (type: string) => {
  switch (type) {
    case 'Retroexcavadora de Oruga':
      return "/lovable-uploads/976ad6e4-5509-4133-8fc5-949f8420ae1e.png";
    case 'Retroexcavadora de Llanta':
      return "/lovable-uploads/559d3680-50bd-42c6-b560-97ff1378a611.png";
    case 'Bulldozer':
      return "/lovable-uploads/1798fae4-b011-4fd0-b9d1-e50863472534.png";
    case 'Volqueta':
      return "/lovable-uploads/8771b38d-fcbf-4660-abdd-40e931db19c6.png";
    case 'Camión':
      return "/lovable-uploads/8771b38d-fcbf-4660-abdd-40e931db19c6.png";
    case 'Camabaja':
      return "/lovable-uploads/08e82f36-fb1e-4635-8884-739a2ec01874.png";
    case 'Semirremolque':
      return "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=400&fit=crop&crop=center";
    case 'Tractomula':
      return "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=400&fit=crop&crop=center";
    case 'Cargador':
      return "/lovable-uploads/feb9fb2f-a667-4886-8f8a-e6cfb6d49d41.png";
    case 'Motoniveladora':
      return "/lovable-uploads/86567b1a-b958-45c8-84eb-f834a625b9bc.png";
    case 'Vibrocompactador':
      return "/lovable-uploads/bcacdd1b-4526-421b-b378-add2698c3d6b.png";
    case 'Paladraga':
      return "/lovable-uploads/8db85654-d7b6-4c26-8b61-bb3258fe0971.png";
    case 'Escombrera':
      return "/lovable-uploads/dda7d9f6-a79e-4af4-b641-83fb6994e590.png";
    default:
      return "/lovable-uploads/976ad6e4-5509-4133-8fc5-949f8420ae1e.png";
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
  'Retroexcavadora de Oruga', 'Retroexcavadora de Llanta', 'Bulldozer', 'Cargador', 'Motoniveladora', 'Vibrocompactador', 'Paladraga', 'Escombrera'
];
