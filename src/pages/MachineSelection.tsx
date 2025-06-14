
import React from 'react';
import { useMachineSelection } from '@/hooks/useMachineSelection';
import { groupMachinesByType, MACHINE_ORDER, getMachineIcon } from '@/utils/machineUtils';
import MachineSelectionHeader from '@/components/machine-selection/MachineSelectionHeader';
import MachineGroup from '@/components/machine-selection/MachineGroup';
import EmptyMachineState from '@/components/machine-selection/EmptyMachineState';

const MachineSelection: React.FC = () => {
  const { user, filteredMachines, handleSelectMachine } = useMachineSelection();

  if (!user) return null;

  const groupedMachines = groupMachinesByType(filteredMachines);

  const getMachineGroupDescription = (type: string): string => {
    switch (type) {
      case 'Volqueta':
        return 'Vehículos especializados para transporte de materiales granulares y construcción';
      case 'Camión':
        return 'Vehículos de carga para transporte de materiales y equipos';
      case 'Camabaja':
        return 'Vehículos especializados para transporte de maquinaria pesada';
      case 'Semirremolque':
        return 'Vehículos de gran capacidad para transporte de carga pesada';
      case 'Tractomula':
        return 'Vehículos articulados para transporte de carga de alto tonelaje';
      case 'Retroexcavadora de Oruga':
        return 'Máquinas de excavación y movimiento de tierra con orugas';
      case 'Retroexcavadora de Llanta':
        return 'Máquinas de excavación versátiles con sistema de llantas';
      case 'Bulldozer':
        return 'Máquinas para nivelación y movimiento de grandes volúmenes de tierra';
      case 'Cargador':
        return 'Máquinas para carga y transporte de materiales granulares';
      case 'Motoniveladora':
        return 'Máquinas especializadas en nivelación y acabado de superficies';
      case 'Vibrocompactador':
        return 'Máquinas para compactación de suelos y pavimentos';
      case 'Paladraga':
        return 'Máquinas especializadas para excavación en ambientes acuáticos';
      default:
        return 'Maquinaria especializada para operaciones de construcción';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%22100%22%20height%3D%22100%22%20viewBox%3D%220%200%20100%20100%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.1%22%3E%3Cpolygon%20points%3D%2250%200%2060%2040%20100%2050%2060%2060%2050%20100%2040%2060%200%2050%2040%2040%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative container mx-auto py-8 px-4 max-w-7xl">
        <MachineSelectionHeader />

        {filteredMachines.length === 0 ? (
          <EmptyMachineState user={user} />
        ) : (
          <div className="space-y-16">
            {MACHINE_ORDER.map((type, index) => {
              const machinesOfType = groupedMachines[type];
              if (!machinesOfType || machinesOfType.length === 0) return null;
              
              return (
                <MachineGroup
                  key={type}
                  title={type}
                  machines={machinesOfType}
                  selectedMachine={null}
                  onMachineSelect={handleSelectMachine}
                  icon={getMachineIcon(type)}
                  description={getMachineGroupDescription(type)}
                  groupIndex={index}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineSelection;
