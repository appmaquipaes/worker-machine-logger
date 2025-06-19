
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Máquinas Asignadas</DialogTitle>
          <DialogDescription>
            Máquinas asignadas al {user?.role.toLowerCase()} {user?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {user?.assignedMachines?.length ? (
            user.assignedMachines.map((machineId) => {
              const machine = machines.find(m => m.id === machineId);
              return machine ? (
                <div key={machineId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{machine.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {machine.type} {machine.plate && `- ${machine.plate}`}
                    </p>
                  </div>
                </div>
              ) : null;
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No hay máquinas asignadas
            </p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMachinesDialog;
