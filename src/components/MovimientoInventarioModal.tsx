
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MovimientoInventarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  material?: { id: string; nombre_material: string };
  onRegistrar?: (mov: MovimientoInventarioFormState) => void;
}

export interface MovimientoInventarioFormState {
  tipo: "entrada" | "salida";
  cantidad: number;
  observacion?: string;
}

const MovimientoInventarioModal: React.FC<MovimientoInventarioModalProps> = ({
  isOpen,
  onClose,
  material,
  onRegistrar,
}) => {
  const [tipo, setTipo] = useState<"entrada" | "salida">("entrada");
  const [cantidad, setCantidad] = useState<number>(0);
  const [observacion, setObservacion] = useState("");

  const handleRegistrar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cantidad || cantidad <= 0) return;
    
    const movimiento = { tipo, cantidad, observacion };
    
    if (onRegistrar) {
      onRegistrar(movimiento);
    } else {
      // Default logic for basic inventory movement
      console.log("Registrando movimiento:", movimiento);
    }
    
    setTipo("entrada");
    setCantidad(0);
    setObservacion("");
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      setTipo("entrada");
      setCantidad(0);
      setObservacion("");
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Registrar Movimiento de Inventario
            {material && ` - ${material.nombre_material}`}
          </DialogTitle>
          <DialogDescription>
            Selecciona el tipo de movimiento e ingresa la cantidad
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleRegistrar} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Tipo de Movimiento</label>
            <Select value={tipo} onValueChange={v => setTipo(v as "entrada" | "salida")}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de movimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="salida">Salida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block font-medium mb-1">Cantidad (m³)</label>
            <Input
              type="number"
              min={1}
              step={0.1}
              value={cantidad === 0 ? "" : cantidad}
              onChange={e => setCantidad(parseFloat(e.target.value) || 0)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Observación (opcional)</label>
            <Textarea
              rows={2}
              placeholder="Detalle del movimiento"
              value={observacion}
              onChange={e => setObservacion(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="mt-2">
              Registrar Movimiento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MovimientoInventarioModal;
