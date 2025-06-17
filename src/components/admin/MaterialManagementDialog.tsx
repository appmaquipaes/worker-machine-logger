
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MaterialManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialsUpdated: () => void;
}

const MaterialManagementDialog: React.FC<MaterialManagementDialogProps> = ({
  open,
  onOpenChange,
  onMaterialsUpdated
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Gestión de Materiales</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-muted-foreground">
            Funcionalidad de gestión de materiales en desarrollo.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialManagementDialog;
