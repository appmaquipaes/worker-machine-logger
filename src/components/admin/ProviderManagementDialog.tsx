
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProviderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProvidersUpdated: () => void;
}

const ProviderManagementDialog: React.FC<ProviderManagementDialogProps> = ({
  open,
  onOpenChange,
  onProvidersUpdated
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestión de Proveedores</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Funcionalidad de gestión de proveedores en desarrollo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderManagementDialog;
