
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador';
  assignedMachines?: string[];
  comisionPorHora?: number;
};

type Machine = {
  id: string;
  name: string;
  type: string;
  plate?: string;
};

interface UserMachineAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: User | null;
  machines: Machine[];
  selectedMachines: string[];
  onMachineToggle: (machineId: string) => void;
  onSave: () => void;
}

const UserMachineAssignmentDialog: React.FC<UserMachineAssignmentDialogProps> = ({
  isOpen,
  onClose,
  editingUser,
  machines,
  selectedMachines,
  onMachineToggle,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white shadow-2xl border-0">
        <DialogHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Settings className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Editar Máquinas Asignadas
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 font-medium">
              Selecciona las máquinas para el operador <span className="font-bold text-slate-800">{editingUser?.name}</span>
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <div className="max-h-80 overflow-y-auto pr-2">
            {machines.length > 0 ? (
              <div className="space-y-3">
                {machines.map((machine) => (
                  <div 
                    key={machine.id} 
                    className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    <Checkbox
                      id={`edit-${machine.id}`}
                      checked={selectedMachines.includes(machine.id)}
                      onCheckedChange={() => onMachineToggle(machine.id)}
                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor={`edit-${machine.id}`} className="flex-1 cursor-pointer">
                      <div className="space-y-1">
                        <span className="font-semibold text-slate-800 text-base">{machine.name}</span>
                        <div className="text-sm text-slate-500 font-medium">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            {machine.type}
                            {machine.plate && <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-xs">Placa: {machine.plate}</span>}
                          </span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Settings className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">
                  No hay máquinas disponibles para asignar
                </p>
              </div>
            )}
          </div>

          {selectedMachines.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-bold text-blue-800 mb-2">
                Máquinas seleccionadas: {selectedMachines.length}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedMachines.map(machineId => {
                  const machine = machines.find(m => m.id === machineId);
                  return machine ? (
                    <span key={machineId} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {machine.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3 pt-6 border-t border-slate-200">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSave}
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
          >
            <Settings className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserMachineAssignmentDialog;
