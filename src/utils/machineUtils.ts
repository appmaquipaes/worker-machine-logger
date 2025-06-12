
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
      return "/lovable-uploads/abfbce19-1bae-4eaa-b0fe-5bbef7443b48.png"; // Nueva imagen vectorial del bulldozer
    case 'volqueta':
      return "/lovable-uploads/6c36b12f-a686-42d4-9655-0d90ec7a95fc.png"; // Tu nueva imagen personalizada de Volqueta
    case 'camión':
      return "https://images.unsplash.com/photo-1566024287286-457247b70310?w=400&h=400&fit=crop&crop=center"; // Camión de carga
    case 'camabaja':
      return "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400&h=400&fit=crop&crop=center"; // Camabaja/Lowboy trailer
    case 'semirremolque':
      return "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=400&fit=crop&crop=center"; // Semirremolque
    case 'tractomula':
      return "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=400&h=400&fit=crop&crop=center"; // Tractomula
    case 'cargador':
      return "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop&crop=center"; // Cargador frontal
    case 'motoniveladora':
      return "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop&crop=center"; // Motoniveladora
    case 'compactador':
      return "https://images.unsplash.com/photo-1572177812156-58036aae439c?w=400&h=400&fit=crop&crop=center"; // Compactador/Road roller
    case 'paladraga':
      return "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=400&fit=crop&crop=center"; // Paladraga/Material handler
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
