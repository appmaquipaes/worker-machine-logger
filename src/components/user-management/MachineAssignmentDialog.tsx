
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Settings, Truck, Building } from 'lucide-react';

type User = {
  id: string;
  name: string;
  role: string;
};

type Machine = {
  id: string;
  name: string;
  type: string;
  plate?: string;
};

interface MachineAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  machines: Machine[];
  selectedMachines: string[];
  onMachineToggle: (machineId: string) => void;
  onSave: () => void;
}

const MachineAssignmentDialog: React.FC<MachineAssignmentDialogProps> = ({
  isOpen,
  onClose,
  user,
  machines,
  selectedMachines,
  onMachineToggle,
  onSave
}) => {
  const getMachineIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'volqueta':
        return <Truck className="h-4 w-4" />;
      case 'excavadora':
        return <Building className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  const getMachineTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'volqueta':
        return 'bg-blue-100 text-blue-700';
      case 'excavadora':
        return 'bg-orange-100 text-orange-700';
      case 'cargador':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Asignar Máquinas
          </DialogTitle>
          <DialogDescription>
            Selecciona las máquinas que {user?.name} podrá operar como {user?.role.toLowerCase()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {machines.length > 0 ? (
            <div className="grid gap-3">
              {machines.map((machine) => (
                <div
                  key={machine.id}
                  className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <Checkbox
                    id={machine.id}
                    checked={selectedMachines.includes(machine.id)}
                    onCheckedChange={() => onMachineToggle(machine.id)}
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      {getMachineIcon(machine.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-slate-800">{machine.name}</h4>
                        <Badge className={`text-xs font-medium ${getMachineTypeColor(machine.type)}`}>
                          {machine.type}
                        </Badge>
                      </div>
                      {machine.plate && (
                        <p className="text-sm text-slate-500 mt-1">Placa: {machine.plate}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No hay máquinas disponibles</p>
              <p className="text-sm text-slate-400">Registra máquinas primero para poder asignarlas</p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={onSave} className="bg-blue-600 hover:bg-blue-700">
            <Settings className="h-4 w-4 mr-2" />
            Guardar Asignación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MachineAssignmentDialog;
