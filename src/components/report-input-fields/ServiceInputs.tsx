
import React from 'react';
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import { DollarSign, Fuel, Wrench, FileText, Calculator } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import MaterialInputs from './MaterialInputs';

interface ServiceInputsProps {
  reportType: ReportType;
  origin: string;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  cantidadM3?: number;
  setCantidadM3: (value: number | undefined) => void;
  tiposMaterial: string[];
  inventarioAcopio: any[];
  selectedMachine?: Machine | null;
  value?: number;
  setValue: (value: number | undefined) => void;
  kilometraje?: number;
  setKilometraje: (value: number | undefined) => void;
  maintenanceValue?: number;
  setMaintenanceValue: (value: number | undefined) => void;
  proveedor: string;
  setProveedor: (value: string) => void;
  proveedores: any[];
  description: string;
  setDescription: (value: string) => void;
}

const ServiceInputs: React.FC<ServiceInputsProps> = ({
  reportType,
  origin,
  tipoMateria,
  setTipoMateria,
  cantidadM3,
  setCantidadM3,
  tiposMaterial,
  inventarioAcopio,
  selectedMachine,
  value,
  setValue,
  kilometraje,
  setKilometraje,
  maintenanceValue,
  setMaintenanceValue,
  proveedor,
  setProveedor,
  proveedores,
  description,
  setDescription
}) => {
  // Mostrar campo de valor para Horas Trabajadas y Horas Extras
  if (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={24} className="text-green-600" />
            <Label htmlFor="hourly-value" className="text-lg font-semibold text-slate-800">
              Valor por Hora
            </Label>
          </div>
          <Input 
            id="hourly-value"
            type="number"
            min="0"
            step="1000"
            placeholder="Ej: 160000"
            value={value === undefined ? '' : value}
            onChange={(e) => setValue(parseFloat(e.target.value) || undefined)}
            className="text-lg p-6 border-2 border-slate-300 focus:border-green-500 rounded-xl"
            required
          />
          <p className="text-sm text-slate-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            💡 <strong>Importante:</strong> Ingresa el valor que se cobra por cada hora trabajada. 
            El sistema calculará automáticamente el total multiplicando las horas por este valor.
          </p>
        </div>
      </div>
    );
  }

  // Resto de los campos para otros tipos de reporte
  if (reportType === 'Combustible') {
    return (
      <div className="space-y-6">
        {/* Campo de valor para combustible */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={24} className="text-green-600" />
            <Label htmlFor="fuel-value" className="text-lg">Valor del Combustible</Label>
          </div>
          <Input 
            id="fuel-value"
            type="number"
            min="0"
            step="1000"
            placeholder="Ej: 150000"
            value={value === undefined ? '' : value}
            onChange={(e) => setValue(parseFloat(e.target.value) || undefined)}
            className="text-lg p-6"
            required
          />
        </div>

        {/* Campo de kilometraje */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Fuel size={24} className="text-blue-600" />
            <Label htmlFor="kilometraje" className="text-lg">Kilometraje Actual</Label>
          </div>
          <Input 
            id="kilometraje"
            type="number"
            min="0"
            placeholder="Ej: 125000"
            value={kilometraje === undefined ? '' : kilometraje}
            onChange={(e) => setKilometraje(parseFloat(e.target.value) || undefined)}
            className="text-lg p-6"
            required
          />
        </div>
      </div>
    );
  }

  if (reportType === 'Mantenimiento') {
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
  }

  if (reportType === 'Novedades') {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={24} className="text-purple-600" />
          <Label htmlFor="description" className="text-lg">Descripción de la Novedad</Label>
        </div>
        <Textarea 
          id="description"
          placeholder="Describe detalladamente la novedad o incidente..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-lg p-6 min-h-[120px]"
          required
        />
      </div>
    );
  }

  // Para viajes, mostrar MaterialInputs si es necesario
  if (reportType === 'Viajes') {
    return (
      <MaterialInputs
        reportType={reportType}
        origin={origin}
        tipoMateria={tipoMateria}
        setTipoMateria={setTipoMateria}
        cantidadM3={cantidadM3}
        setCantidadM3={setCantidadM3}
        tiposMaterial={tiposMaterial}
        inventarioAcopio={inventarioAcopio}
        selectedMachine={selectedMachine}
      />
    );
  }

  // Para otros tipos de reporte, no mostrar campos adicionales
  return null;
};

export default ServiceInputs;
