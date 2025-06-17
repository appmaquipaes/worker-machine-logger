
import React from 'react';
import { Truck, Wrench } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Machine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { ReportType } from '@/types/report';

interface MaterialInputsProps {
  reportType: ReportType;
  origin: string;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  cantidadM3?: number;
  setCantidadM3: (value: number | undefined) => void;
  tiposMaterial: string[];
  inventarioAcopio: any[];
  selectedMachine?: Machine;
}

const MaterialInputs: React.FC<MaterialInputsProps> = ({
  reportType,
  origin,
  tipoMateria,
  setTipoMateria,
  cantidadM3,
  setCantidadM3,
  tiposMaterial,
  inventarioAcopio,
  selectedMachine
}) => {
  const { isMaterialTransportVehicle } = useMachineSpecificReports();

  if (reportType !== 'Viajes' || !isMaterialTransportVehicle(selectedMachine)) {
    return null;
  }

  const shouldShowInventoryMaterialSelect = origin === 'Acopio Maquipaes';
  const shouldShowTipoMateriaInput = origin !== 'Acopio Maquipaes';

  return (
    <>
      {shouldShowInventoryMaterialSelect && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={24} />
            <Label htmlFor="material-inventario" className="text-lg">Material del Inventario</Label>
          </div>
          <Select onValueChange={setTipoMateria} value={tipoMateria}>
            <SelectTrigger className="text-lg p-6">
              <SelectValue placeholder="Selecciona el material del inventario" />
            </SelectTrigger>
            <SelectContent>
              {inventarioAcopio.map((item) => (
                <SelectItem key={item.id} value={item.tipo_material}>
                  {item.tipo_material} ({item.cantidad_disponible} m³ disponibles)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {shouldShowTipoMateriaInput && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={24} />
            <Label htmlFor="tipo-materia" className="text-lg">Tipo de Materia</Label>
          </div>
          <Select onValueChange={setTipoMateria} value={tipoMateria}>
            <SelectTrigger className="text-lg p-6">
              <SelectValue placeholder="Selecciona el tipo de materia" />
            </SelectTrigger>
            <SelectContent>
              {tiposMaterial.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Truck size={24} />
          <Label htmlFor="cantidad-m3" className="text-lg">
            Cantidad de m³ Transportados
            {shouldShowInventoryMaterialSelect && tipoMateria && (
              <span className="text-sm text-muted-foreground ml-2">
                (Disponibles: {inventarioAcopio.find(item => item.tipo_material === tipoMateria)?.cantidad_disponible || 0} m³)
              </span>
            )}
          </Label>
        </div>
        <Input 
          id="cantidad-m3"
          type="number"
          min="0.1"
          step="0.1"
          max={shouldShowInventoryMaterialSelect && tipoMateria ? 
            inventarioAcopio.find(item => item.tipo_material === tipoMateria)?.cantidad_disponible : undefined}
          placeholder="Ej: 6"
          value={cantidadM3 === undefined ? '' : cantidadM3}
          onChange={(e) => setCantidadM3(parseFloat(e.target.value) || undefined)}
          className="text-lg p-6"
          required
        />
      </div>
    </>
  );
};

export default MaterialInputs;
