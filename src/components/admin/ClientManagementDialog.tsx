
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ClientManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientsUpdated: () => void;
}

const ClientManagementDialog: React.FC<ClientManagementDialogProps> = ({
  open,
  onOpenChange,
  onClientsUpdated
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestión de Clientes</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Funcionalidad de gestión de clientes en desarrollo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientManagementDialog;
