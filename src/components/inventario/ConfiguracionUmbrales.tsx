
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Settings, Trash2, Plus, AlertTriangle } from 'lucide-react';
import { UmbralMaterial } from '@/hooks/useInventarioAlertas';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';

interface ConfiguracionUmbralesProps {
  umbrales: UmbralMaterial[];
  onConfigurarUmbral: (material: string, umbralMinimo: number, umbralCritico: number) => void;
}

const ConfiguracionUmbrales: React.FC<ConfiguracionUmbralesProps> = ({
  umbrales,
  onConfigurarUmbral
}) => {
  const [materialSeleccionado, setMaterialSeleccionado] = useState('');
  const [umbralMinimo, setUmbralMinimo] = useState('');
  const [umbralCritico, setUmbralCritico] = useState('');

  const inventario = loadInventarioAcopio();
  const materialesDisponibles = inventario.map(item => item.tipo_material);

  const handleAgregarUmbral = () => {
    if (!materialSeleccionado || !umbralMinimo || !umbralCritico) {
      return;
    }

    const min = parseFloat(umbralMinimo);
    const critico = parseFloat(umbralCritico);

    if (min <= 0 || critico <= 0 || critico >= min) {
      return;
    }

    onConfigurarUmbral(materialSeleccionado, min, critico);
    setMaterialSeleccionado('');
    setUmbralMinimo('');
    setUmbralCritico('');
  };

  const eliminarUmbral = (material: string) => {
    onConfigurarUmbral(material, 0, 0);
  };

  return (
    <Card className="shadow-lg border-blue-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
        <CardTitle className="text-xl font-bold text-blue-800 flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuración de Umbrales
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Formulario para agregar umbral */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <Label htmlFor="material" className="text-sm font-medium text-blue-800">
              Material
            </Label>
            <Select value={materialSeleccionado} onValueChange={setMaterialSeleccionado}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleccionar material" />
              </SelectTrigger>
              <SelectContent>
                {materialesDisponibles
                  .filter(material => !umbrales.find(u => u.material === material))
                  .map(material => (
                    <SelectItem key={material} value={material}>
                      {material}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="umbralCritico" className="text-sm font-medium text-blue-800">
              Umbral Crítico (m³)
            </Label>
            <Input
              id="umbralCritico"
              type="number"
              value={umbralCritico}
              onChange={(e) => setUmbralCritico(e.target.value)}
              placeholder="0"
              min="0"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="umbralMinimo" className="text-sm font-medium text-blue-800">
              Umbral Mínimo (m³)
            </Label>
            <Input
              id="umbralMinimo"
              type="number"
              value={umbralMinimo}
              onChange={(e) => setUmbralMinimo(e.target.value)}
              placeholder="0"
              min="0"
              className="mt-1"
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleAgregarUmbral}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!materialSeleccionado || !umbralMinimo || !umbralCritico}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        {/* Tabla de umbrales configurados */}
        {umbrales.length > 0 ? (
          <div className="rounded-lg border border-blue-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="font-bold text-blue-800">Material</TableHead>
                  <TableHead className="font-bold text-blue-800">Umbral Crítico</TableHead>
                  <TableHead className="font-bold text-blue-800">Umbral Mínimo</TableHead>
                  <TableHead className="font-bold text-blue-800">Stock Actual</TableHead>
                  <TableHead className="font-bold text-blue-800">Estado</TableHead>
                  <TableHead className="font-bold text-blue-800 w-20">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {umbrales.map((umbral) => {
                  const itemInventario = inventario.find(item => item.tipo_material === umbral.material);
                  const stockActual = itemInventario?.cantidad_disponible || 0;
                  
                  let estado = 'Normal';
                  let estadoColor = 'bg-green-100 text-green-800';
                  
                  if (stockActual === 0) {
                    estado = 'Sin Stock';
                    estadoColor = 'bg-red-100 text-red-800';
                  } else if (stockActual <= umbral.umbralCritico) {
                    estado = 'Crítico';
                    estadoColor = 'bg-red-100 text-red-800';
                  } else if (stockActual <= umbral.umbralMinimo) {
                    estado = 'Bajo';
                    estadoColor = 'bg-yellow-100 text-yellow-800';
                  }

                  return (
                    <TableRow key={umbral.material} className="hover:bg-blue-50">
                      <TableCell className="font-medium">{umbral.material}</TableCell>
                      <TableCell>{umbral.umbralCritico} m³</TableCell>
                      <TableCell>{umbral.umbralMinimo} m³</TableCell>
                      <TableCell className="font-semibold">{stockActual} m³</TableCell>
                      <TableCell>
                        <Badge className={`${estadoColor} border-0`}>
                          {estado}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar umbral?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Se eliminará la configuración de umbral para "{umbral.material}".
                                Las alertas activas para este material se desactivarán.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => eliminarUmbral(umbral.material)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Settings className="h-12 w-12 mx-auto mb-3 text-gray-400" />
            <p className="text-lg font-medium">No hay umbrales configurados</p>
            <p className="text-sm">Agrega umbrales para recibir alertas automáticas</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConfiguracionUmbrales;
