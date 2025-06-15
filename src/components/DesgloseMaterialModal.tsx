
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { InventarioAcopio } from '@/models/InventarioAcopio';

const SUBPRODUCTOS = [
  "B-200",
  "B-400",
  "Rajón 20-30",
  "Sobrante de Zaranda",
  "Piedra Filtro",
  "Arena Amarilla",
  "Gravilla",
  "Arena de Rio",
];

interface DesgloseMaterialModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inventario: InventarioAcopio[];
  onDesgloseRealizado: (movimiento: { cantidadRecebo: number, subproductos: { [key: string]: number } }) => void;
}

const DesgloseMaterialModal: React.FC<DesgloseMaterialModalProps> = ({
  open,
  onOpenChange,
  inventario,
  onDesgloseRealizado,
}) => {
  const recebo = inventario.find(i => i.tipo_material.toLowerCase().includes("recebo común"));
  const [cantidadRecebo, setCantidadRecebo] = useState<number>(0);
  const [subproductos, setSubproductos] = useState<{[key: string]: number}>({});

  React.useEffect(() => {
    if (!open) {
      setCantidadRecebo(0);
      setSubproductos({});
    }
  }, [open]);

  const handleSubproductoChange = (nombre: string, valor: string) => {
    setSubproductos(prev => ({
      ...prev,
      [nombre]: Number(valor) || 0
    }));
  };

  const handleGuardar = () => {
    const totalSubproductos = Object.values(subproductos).reduce((acc, val) => acc + (val || 0), 0);
    if (!recebo) {
      toast.error("No hay Recebo Común en inventario");
      return;
    }
    if (cantidadRecebo <= 0) {
      toast.error("Cantidad de Recebo Común inválida");
      return;
    }
    if (cantidadRecebo > recebo.cantidad_disponible) {
      toast.error("No hay suficiente Recebo Común disponible");
      return;
    }
    if (totalSubproductos === 0) {
      toast.error("Debes ingresar al menos un subproducto mayor a cero");
      return;
    }
    if (totalSubproductos > cantidadRecebo + 0.01) {
      toast.error("La suma de los subproductos no puede superar la cantidad desglosada");
      return;
    }
    onDesgloseRealizado({
      cantidadRecebo,
      subproductos,
    });
    onOpenChange(false);
    toast.success("Desglose registrado correctamente");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white shadow-2xl border-0">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-700 mb-2">Desglosar Recebo Común</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label className="font-semibold text-slate-700 mb-2 block">Cantidad Recebo Común a desgranar (m³)</Label>
            <Input
              type="number"
              min={0}
              max={recebo?.cantidad_disponible || 0}
              value={cantidadRecebo}
              onChange={e => setCantidadRecebo(Number(e.target.value) || 0)}
              placeholder={`Máx: ${recebo?.cantidad_disponible || 0}`}
              className="h-12 border-slate-300 mb-3"
              disabled={!recebo}
            />
            <div className="text-xs text-muted-foreground">
              Disponible: {recebo?.cantidad_disponible ?? 0} m³
            </div>
          </div>
          <div>
            <Label className="font-semibold text-slate-700 mb-2 block">Subproductos obtenidos (m³)</Label>
            <div className="grid grid-cols-1 gap-3">
              {SUBPRODUCTOS.map(nombre => (
                <div key={nombre} className="flex items-center gap-4">
                  <Label className="min-w-[130px]">{nombre}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={subproductos[nombre] || ""}
                    onChange={e => handleSubproductoChange(nombre, e.target.value)}
                    className="w-28"
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={handleGuardar}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold mt-6 shadow-lg"
            disabled={!recebo}
          >
            Guardar Desglose
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesgloseMaterialModal;
