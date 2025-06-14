
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { DollarSign, Calculator } from 'lucide-react';

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
      <DialogContent className="max-w-md bg-white shadow-2xl border-0">
        <DialogHeader className="text-center space-y-4 pb-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <DollarSign className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Configurar Comisión por Hora
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 font-medium">
              Establecer la comisión por hora para <span className="font-bold text-slate-800">{user.name}</span>
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label htmlFor="commission" className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <Calculator className="h-4 w-4 text-green-600" />
              Comisión por Hora ($)
            </Label>
            <Input
              id="commission"
              type="number"
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
              placeholder="0"
              min="0"
              step="100"
              className="h-12 text-lg font-semibold border-slate-300 focus:border-green-500 focus:ring-green-500 bg-slate-50 focus:bg-white transition-colors"
            />
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                Esta comisión se aplicará por cada hora trabajada registrada por el operador en sus reportes de trabajo.
              </p>
            </div>
          </div>

          {commission > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-green-800">
                    Comisión configurada: ${commission.toLocaleString()} por hora
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Se calculará automáticamente en los reportes
                  </p>
                </div>
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
            onClick={handleSave}
            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Guardar Comisión
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserCommissionDialog;
