
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23e2e8f0" fill-opacity="0.1"%3E%3Cpolygon points="50 0 60 40 100 50 60 60 50 100 40 60 0 50 40 40"/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative container mx-auto py-8 px-4 max-w-7xl">
        <MachineSelectionHeader />

        {filteredMachines.length === 0 ? (
          <EmptyMachineState user={user} />
        ) : (
          <div className="space-y-16">
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
