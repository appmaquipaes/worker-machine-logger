
import React from 'react';
import { ReportType } from '@/types/report';
import { DollarSign, Wrench } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MaintenanceValueInputProps {
  reportType: ReportType;
  maintenanceValue?: number;
  setMaintenanceValue: (value: number | undefined) => void;
  proveedor: string;
  setProveedor: (value: string) => void;
  proveedores: any[];
}

const MaintenanceValueInput: React.FC<MaintenanceValueInputProps> = ({
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
    <div className="space-y-6">
      {/* Campo de valor para mantenimiento */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={24} className="text-green-600" />
          <Label htmlFor="maintenance-value" className="text-lg">Valor del Mantenimiento</Label>
        </div>
        <Input 
          id="maintenance-value"
          type="number"
          min="0"
          step="1000"
          placeholder="Ej: 250000"
          value={maintenanceValue === undefined ? '' : maintenanceValue}
          onChange={(e) => setMaintenanceValue(parseFloat(e.target.value) || undefined)}
          className="text-lg p-6"
          required
        />
      </div>

      {/* Campo de proveedor */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Wrench size={24} className="text-orange-600" />
          <Label htmlFor="proveedor" className="text-lg">Proveedor del Mantenimiento</Label>
        </div>
        <Select onValueChange={setProveedor} value={proveedor} required>
          <SelectTrigger className="text-lg p-6">
            <SelectValue placeholder="Selecciona un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedores.map((prov) => (
              <SelectItem key={prov.id} value={prov.nombre}>
                {prov.nombre} - {prov.ciudad}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default MaintenanceValueInput;
