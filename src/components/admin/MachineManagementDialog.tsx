
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MachineManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMachinesUpdated: () => void;
}

const MachineManagementDialog: React.FC<MachineManagementDialogProps> = ({
  open,
  onOpenChange,
  onMachinesUpdated
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestión de Máquinas</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Funcionalidad de gestión de máquinas en desarrollo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MachineManagementDialog;
