
import React from 'react';
import { useMachineSelection } from '@/hooks/useMachineSelection';
import { groupMachinesByType, MACHINE_ORDER } from '@/utils/machineUtils';
import MachineSelectionHeader from '@/components/machine-selection/MachineSelectionHeader';
import MachineGroup from '@/components/machine-selection/MachineGroup';
import EmptyMachineState from '@/components/machine-selection/EmptyMachineState';

const MachineSelection: React.FC = () => {
  const { user, filteredMachines, handleSelectMachine } = useMachineSelection();

  if (!user) return null;

  const groupedMachines = groupMachinesByType(filteredMachines);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <MachineSelectionHeader />

        {filteredMachines.length === 0 ? (
          <EmptyMachineState user={user} />
        ) : (
          <div className="space-y-12">
            {MACHINE_ORDER.map((type) => {
              const machinesOfType = groupedMachines[type];
              return (
                <MachineGroup
                  key={type}
                  type={type}
                  machines={machinesOfType}
                  onSelectMachine={handleSelectMachine}
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
