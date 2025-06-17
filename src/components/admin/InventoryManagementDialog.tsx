
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InventoryManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInventoryUpdated: () => void;
}

const InventoryManagementDialog: React.FC<InventoryManagementDialogProps> = ({
  open,
  onOpenChange,
  onInventoryUpdated
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestión de Inventario</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Funcionalidad de gestión de inventario en desarrollo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryManagementDialog;
