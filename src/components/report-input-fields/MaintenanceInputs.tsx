
import React from 'react';
import { Wrench } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ReportType } from '@/types/report';

interface MaintenanceInputsProps {
  reportType: ReportType;
  maintenanceValue?: number;
  setMaintenanceValue: (value: number | undefined) => void;
  proveedor: string;
  setProveedor: (value: string) => void;
  proveedores: any[];
}

const MaintenanceInputs: React.FC<MaintenanceInputsProps> = ({
  reportType,
  maintenanceValue,
  setMaintenanceValue,
  proveedor,
  setProveedor,
  proveedores
}) => {
  if (reportType !== 'Mantenimiento') {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Wrench size={24} />
          <Label htmlFor="maintenance-value" className="text-lg">Valor del Mantenimiento</Label>
        </div>
        <Input 
          id="maintenance-value"
          type="number"
          min="1"
          placeholder="Ej: 100000"
          value={maintenanceValue === undefined ? '' : maintenanceValue}
          onChange={(e) => setMaintenanceValue(parseFloat(e.target.value) || undefined)}
          className="text-lg p-6"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Wrench size={24} />
          <Label htmlFor="proveedor" className="text-lg">Proveedor</Label>
        </div>
        <Select onValueChange={setProveedor} value={proveedor}>
          <SelectTrigger className="text-lg p-6">
            <SelectValue placeholder="Selecciona un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedores.map((prov) => (
              <SelectItem key={prov.id} value={prov.nombre}>
                {prov.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default MaintenanceInputs;
