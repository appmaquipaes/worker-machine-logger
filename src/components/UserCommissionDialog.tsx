
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface UserCommissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    comisionPorHora?: number;
  };
  onSave: (userId: string, commission: number) => void;
}

const UserCommissionDialog: React.FC<UserCommissionDialogProps> = ({
  isOpen,
  onClose,
  user,
  onSave
}) => {
  const [commission, setCommission] = useState<number>(user.comisionPorHora || 0);

  const handleSave = () => {
    if (commission < 0) {
      toast.error('La comisión no puede ser negativa');
      return;
    }

    onSave(user.id, commission);
    toast.success(`Comisión actualizada para ${user.name}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Comisión por Hora</DialogTitle>
          <DialogDescription>
            Establecer la comisión por hora para {user.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="commission">Comisión por Hora ($)</Label>
            <Input
              id="commission"
              type="number"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              placeholder="0"
              min="0"
              step="100"
            />
            <p className="text-sm text-muted-foreground">
              Esta comisión se aplicará por cada hora trabajada registrada por el operador
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Guardar Comisión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCommissionDialog;
