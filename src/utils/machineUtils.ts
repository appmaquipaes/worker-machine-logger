
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
    case 'excavadora':
      return "/lovable-uploads/d8ff481c-bcff-4c36-8c82-691a61ebbb16.png"; // Tu imagen personalizada de la Caterpillar 315
    case 'bulldozer':
      return "/lovable-uploads/1798fae4-b011-4fd0-b9d1-e50863472534.png"; // Tu nueva imagen personalizada del bulldozer
    case 'volqueta':
      return "/lovable-uploads/8771b38d-fcbf-4660-abdd-40e931db19c6.png"; // Tu nueva imagen personalizada de Volqueta
    case 'camión':
      return "/lovable-uploads/8771b38d-fcbf-4660-abdd-40e931db19c6.png"; // Tu nueva imagen personalizada de Camión (mismo estilo que volqueta)
    case 'camabaja':
      return "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&h=400&fit=crop&crop=center"; // Camabaja/Lowboy trailer
    case 'semirremolque':
      return "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=400&fit=crop&crop=center"; // Semirremolque
    case 'tractomula':
      return "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=400&fit=crop&crop=center"; // Tractomula
    case 'cargador':
      return "/lovable-uploads/feb9fb2f-a667-4886-8f8a-e6cfb6d49d41.png"; // Tu nueva imagen personalizada del cargador
    case 'motoniveladora':
      return "/lovable-uploads/86567b1a-b958-45c8-84eb-f834a625b9bc.png"; // Tu nueva imagen personalizada de la motoniveladora
    case 'compactador':
      return "/lovable-uploads/bcacdd1b-4526-421b-b378-add2698c3d6b.png"; // Tu nueva imagen personalizada del vibrocompactador CC248 CAT
    case 'paladraga':
      return "/lovable-uploads/8db85654-d7b6-4c26-8b61-bb3258fe0971.png"; // Tu nueva imagen actualizada de la paladraga Bucyrus
    default:
      return "/lovable-uploads/d8ff481c-bcff-4c36-8c82-691a61ebbb16.png"; // Tu imagen personalizada como imagen por defecto
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
