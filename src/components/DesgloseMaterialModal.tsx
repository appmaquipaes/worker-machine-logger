
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { InventarioAcopio } from '@/models/InventarioAcopio';
import { Scissors, AlertTriangle, Package, ArrowRight } from 'lucide-react';

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

  const calcularTotalSubproductos = () => {
    return Object.values(subproductos).reduce((acc, val) => acc + (val || 0), 0);
  };

  const handleGuardar = () => {
    const totalSubproductos = calcularTotalSubproductos();
    
    if (!recebo) {
      toast.error("No hay Recebo Común en inventario");
      return;
    }
    if (cantidadRecebo <= 0) {
      toast.error("La cantidad de Recebo Común debe ser mayor a cero");
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
      <DialogContent className="max-w-4xl bg-white shadow-2xl border-0 rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4 pb-6 border-b border-slate-200">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-2">
            <DialogTitle className="text-3xl font-bold text-slate-800">Desglosar Recebo Común</DialogTitle>
            <p className="text-lg text-slate-600">Transforma recebo común en diferentes subproductos</p>
          </div>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Información del Material Disponible */}
          {recebo ? (
            <Card className="border-2 border-blue-200 bg-blue-50 rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-3">
                  <Package className="h-6 w-6" />
                  Material Disponible
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-blue-700">Recebo Común</span>
                  <span className="text-2xl font-bold text-blue-800">
                    {recebo.cantidad_disponible.toLocaleString()} m³
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-2 border-red-200 bg-red-50 rounded-2xl">
              <CardContent className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                  <div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">No hay Recebo Común disponible</h3>
                    <p className="text-lg text-red-600">Agrega Recebo Común al inventario para poder desglosarlo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {recebo && (
            <>
              {/* Cantidad a Desglosar */}
              <Card className="border-2 border-slate-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <ArrowRight className="h-6 w-6 text-orange-600" />
                    Cantidad a Desglosar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Label className="text-lg font-bold text-slate-700">Cantidad de Recebo Común (m³)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={recebo.cantidad_disponible}
                      step={0.1}
                      value={cantidadRecebo === 0 ? "" : cantidadRecebo}
                      onChange={e => setCantidadRecebo(Number(e.target.value) || 0)}
                      placeholder={`Máximo: ${recebo.cantidad_disponible}`}
                      className="h-14 text-lg border-2 border-slate-300 focus:border-orange-500 rounded-xl"
                    />
                    <p className="text-sm text-slate-500 font-medium">
                      Disponible: {recebo.cantidad_disponible.toLocaleString()} m³
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Subproductos */}
              <Card className="border-2 border-slate-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <Package className="h-6 w-6 text-green-600" />
                    Subproductos Obtenidos
                  </CardTitle>
                  <p className="text-lg text-slate-600 mt-2">
                    Ingresa las cantidades de cada subproducto que se obtienen del desglose
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SUBPRODUCTOS.map(nombre => (
                      <div key={nombre} className="space-y-3">
                        <Label className="text-lg font-semibold text-slate-700">{nombre}</Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min={0}
                            step={0.1}
                            value={subproductos[nombre] || ""}
                            onChange={e => handleSubproductoChange(nombre, e.target.value)}
                            className="h-12 text-lg border-2 border-slate-300 focus:border-green-500 rounded-xl pr-12"
                            placeholder="0.0"
                          />
                          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">m³</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Resumen */}
                  {cantidadRecebo > 0 && (
                    <div className="mt-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Resumen del Desglose</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-blue-100 rounded-xl">
                          <p className="text-sm font-semibold text-blue-600 mb-1">Material Original</p>
                          <p className="text-xl font-bold text-blue-800">{cantidadRecebo.toLocaleString()} m³</p>
                        </div>
                        <div className="text-center p-4 bg-green-100 rounded-xl">
                          <p className="text-sm font-semibold text-green-600 mb-1">Total Subproductos</p>
                          <p className="text-xl font-bold text-green-800">{calcularTotalSubproductos().toLocaleString()} m³</p>
                        </div>
                        <div className="text-center p-4 bg-purple-100 rounded-xl">
                          <p className="text-sm font-semibold text-purple-600 mb-1">Diferencia</p>
                          <p className={`text-xl font-bold ${(cantidadRecebo - calcularTotalSubproductos()) >= 0 ? 'text-purple-800' : 'text-red-600'}`}>
                            {(cantidadRecebo - calcularTotalSubproductos()).toLocaleString()} m³
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Botón de Acción */}
              <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleGuardar}
                  className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  disabled={!recebo || cantidadRecebo <= 0 || calcularTotalSubproductos() === 0}
                >
                  <Scissors className="h-6 w-6 mr-3" />
                  Realizar Desglose
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesgloseMaterialModal;
