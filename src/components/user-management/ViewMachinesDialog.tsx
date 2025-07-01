
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Truck, Building } from 'lucide-react';

type User = {
  id: string;
  name: string;
  role: string;
  assignedMachines?: string[];
};

type Machine = {
  id: string;
  name: string;
  type: string;
  plate?: string;
};

interface ViewMachinesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  machines: Machine[];
}

const ViewMachinesDialog: React.FC<ViewMachinesDialogProps> = ({
  isOpen,
  onClose,
  user,
  machines
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

  const assignedMachines = machines.filter(machine => 
    user?.assignedMachines?.includes(machine.id)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Máquinas Asignadas
          </DialogTitle>
          <DialogDescription>
            Máquinas asignadas al {user?.role.toLowerCase()} {user?.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {assignedMachines.length > 0 ? (
            assignedMachines.map((machine) => (
              <div key={machine.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {getMachineIcon(machine.type)}
                  <div>
                    <p className="font-medium text-slate-800">{machine.name}</p>
                    {machine.plate && (
                      <p className="text-sm text-slate-500">Placa: {machine.plate}</p>
                    )}
                  </div>
                </div>
                <Badge className={`text-xs font-medium ${getMachineTypeColor(machine.type)}`}>
                  {machine.type}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-sm text-slate-500 font-medium">No hay máquinas asignadas</p>
              <p className="text-xs text-slate-400">Este usuario aún no tiene máquinas asignadas</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMachinesDialog;
