
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';

interface EditarMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materialEditado: {
    id: string;
    tipo_material: string;
    cantidad_disponible: number;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGuardar: () => void;
}

const EditarMaterialDialog: React.FC<EditarMaterialDialogProps> = ({
  open,
  onOpenChange,
  materialEditado,
  onInputChange,
  onGuardar
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white shadow-2xl border-0">
        <DialogHeader className="text-center space-y-4 pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Edit className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-slate-800">Editar Material</DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-6 pt-6">
          <div>
            <Label htmlFor="tipo_material_edit" className="text-slate-700 font-semibold">Tipo de Material</Label>
            <Input
              type="text"
              id="tipo_material_edit"
              name="tipo_material"
              value={materialEditado.tipo_material}
              onChange={onInputChange}
              className="h-12 border-slate-300 focus:border-blue-500"
            />
          </div>
          <div>
            <Label htmlFor="cantidad_disponible_edit" className="text-slate-700 font-semibold">Cantidad Disponible (m³)</Label>
            <Input
              type="number"
              id="cantidad_disponible_edit"
              name="cantidad_disponible"
              value={materialEditado.cantidad_disponible.toString()}
              onChange={onInputChange}
              className="h-12 border-slate-300 focus:border-blue-500"
            />
          </div>
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={onGuardar}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
            >
              <Edit className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditarMaterialDialog;
