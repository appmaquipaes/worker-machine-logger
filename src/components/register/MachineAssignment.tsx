
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface Machine {
  id: string;
  name: string;
  type: string;
  plate?: string;
}

interface MachineAssignmentProps {
  machines: Machine[];
  selectedMachines: string[];
  onMachineToggle: (machineId: string) => void;
}

const MachineAssignment: React.FC<MachineAssignmentProps> = ({
  machines,
  selectedMachines,
  onMachineToggle
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
        Máquinas Asignadas
      </h3>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-h-80 overflow-y-auto">
        {machines.length > 0 ? (
          <div className="space-y-3">
            {machines.map((machine) => (
              <div key={machine.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                <Checkbox
                  id={machine.id}
                  checked={selectedMachines.includes(machine.id)}
                  onCheckedChange={() => onMachineToggle(machine.id)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={machine.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Settings className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">{machine.name}</span>
                      <span className="text-sm text-slate-600 ml-2">
                        ({machine.type}) {machine.plate && `- ${machine.plate}`}
                      </span>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Settings className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-medium">
              No hay máquinas disponibles para asignar
            </p>
          </div>
        )}
      </div>
      {selectedMachines.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm font-semibold text-blue-800">
            {selectedMachines.length} máquina(s) seleccionada(s)
          </p>
        </div>
      )}
    </div>
  );
};

export default MachineAssignment;
