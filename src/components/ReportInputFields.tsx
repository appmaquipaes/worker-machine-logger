
import React from 'react';
import { ReportType } from '@/context/ReportContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { DatePicker } from '@/components/DatePicker';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import { 
  Clock, 
  AlarmClock, 
  Wrench as ToolIcon, 
  Fuel, 
  Info, 
  Truck,
  Calendar,
  MapPin,
  Gauge
} from 'lucide-react';

interface ReportInputFieldsProps {
  reportType: ReportType;
  reportDate: Date;
  setReportDate: (date: Date) => void;
  description: string;
  setDescription: (value: string) => void;
  trips?: number;
  setTrips: (value: number | undefined) => void;
  hours?: number;
  setHours: (value: number | undefined) => void;
  value?: number;
  setValue: (value: number | undefined) => void;
  workSite: string;
  setWorkSite: (value: string) => void;
  origin: string;
  setOrigin: (value: string) => void;
  selectedCliente: string;
  setSelectedCliente: (value: string) => void;
  selectedFinca: string;
  setSelectedFinca: (value: string) => void;
  maintenanceValue?: number;
  setMaintenanceValue: (value: number | undefined) => void;
  cantidadM3?: number;
  setCantidadM3: (value: number | undefined) => void;
  proveedor: string;
  setProveedor: (value: string) => void;
  kilometraje?: number;
  setKilometraje: (value: number | undefined) => void;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  proveedores: any[];
  tiposMaterial: string[];
  inventarioAcopio: any[];
  onClienteChangeForWorkSite: (cliente: string) => void;
  onClienteChangeForDestination: (cliente: string) => void;
  onFincaChangeForDestination: (finca: string) => void;
}

const ReportInputFields: React.FC<ReportInputFieldsProps> = ({
  reportType,
  reportDate,
  setReportDate,
  description,
  setDescription,
  trips,
  setTrips,
  hours,
  setHours,
  value,
  setValue,
  workSite,
  origin,
  setOrigin,
  selectedCliente,
  selectedFinca,
  maintenanceValue,
  setMaintenanceValue,
  cantidadM3,
  setCantidadM3,
  proveedor,
  setProveedor,
  kilometraje,
  setKilometraje,
  tipoMateria,
  setTipoMateria,
  proveedores,
  tiposMaterial,
  inventarioAcopio,
  onClienteChangeForWorkSite,
  onClienteChangeForDestination,
  onFincaChangeForDestination
}) => {
  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'Horas Trabajadas':
        return <Clock size={28} />;
      case 'Horas Extras':
        return <AlarmClock size={28} />;
      case 'Mantenimiento':
        return <ToolIcon size={28} />;
      case 'Combustible':
        return <Fuel size={28} />;
      case 'Viajes':
        return <Truck size={28} />;
      case 'Novedades':
        return <Info size={28} />;
      default:
        return <Info size={28} />;
    }
  };

  const shouldShowHoursInput = (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras');
  const shouldShowTripsInput = reportType === 'Viajes';
  const shouldShowValueInput = reportType === 'Combustible';
  const shouldShowWorkSiteInput = reportType === 'Horas Trabajadas';
  const shouldShowOriginDestination = reportType === 'Viajes';
  const shouldShowM3Input = reportType === 'Viajes';
  const shouldShowInventoryMaterialSelect = reportType === 'Viajes' && origin === 'Acopio Maquipaes';
  const shouldShowTipoMateriaInput = reportType === 'Viajes' && origin !== 'Acopio Maquipaes';
  const shouldShowKilometrajeInput = reportType === 'Combustible';
  const shouldShowProveedorInput = reportType === 'Mantenimiento';

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={24} />
          <Label htmlFor="report-date" className="text-lg">Fecha del Reporte</Label>
        </div>
        <DatePicker date={reportDate} setDate={setReportDate} />
      </div>

      {shouldShowWorkSiteInput && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={24} />
            <Label className="text-lg">Cliente del Sitio de Trabajo</Label>
          </div>
          <ClienteFincaSelector
            selectedCliente={workSite}
            selectedFinca=""
            onClienteChange={onClienteChangeForWorkSite}
            onFincaChange={() => {}}
          />
        </div>
      )}

      {shouldShowHoursInput && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            {reportType === 'Horas Trabajadas' ? <Clock size={24} /> : <AlarmClock size={24} />}
            <Label htmlFor="hours" className="text-lg">
              {reportType === 'Horas Trabajadas' ? 'Horas Trabajadas' : 'Horas Extras'}
            </Label>
          </div>
          <Input 
            id="hours"
            type="number"
            min="0.1"
            step="0.1"
            placeholder="Ej: 8.5"
            value={hours === undefined ? '' : hours}
            onChange={(e) => setHours(parseFloat(e.target.value) || undefined)}
            className="text-lg p-6"
            required
          />
        </div>
      )}

      {shouldShowTripsInput && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={24} />
            <Label htmlFor="trips" className="text-lg">Número de Viajes</Label>
          </div>
          <Input 
            id="trips"
            type="number"
            min="1"
            placeholder="Ej: 5"
            value={trips === undefined ? '' : trips}
            onChange={(e) => setTrips(parseInt(e.target.value) || undefined)}
            className="text-lg p-6"
          />
        </div>
      )}

      {shouldShowOriginDestination && (
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={24} />
              <Label htmlFor="origin" className="text-lg">Origen (Proveedor)</Label>
            </div>
            <Select onValueChange={setOrigin} value={origin}>
              <SelectTrigger className="text-lg p-6">
                <SelectValue placeholder="Selecciona el origen" />
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
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={24} />
              <Label className="text-lg">Destino (Cliente y Finca)</Label>
            </div>
            <ClienteFincaSelector
              selectedCliente={selectedCliente}
              selectedFinca={selectedFinca}
              onClienteChange={onClienteChangeForDestination}
              onFincaChange={onFincaChangeForDestination}
              autoSetDestination={true}
            />
          </div>
        </>
      )}

      {shouldShowInventoryMaterialSelect && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <ToolIcon size={24} />
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
            <ToolIcon size={24} />
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

      {shouldShowM3Input && (
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
      )}

      {shouldShowKilometrajeInput && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Gauge size={24} />
            <Label htmlFor="kilometraje" className="text-lg">Kilometraje Actual</Label>
          </div>
          <Input 
            id="kilometraje"
            type="number"
            min="0"
            placeholder="Ej: 150000"
            value={kilometraje === undefined ? '' : kilometraje}
            onChange={(e) => setKilometraje(parseFloat(e.target.value) || undefined)}
            className="text-lg p-6"
            required
          />
        </div>
      )}

      {shouldShowValueInput && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Fuel size={24} />
            <Label htmlFor="value" className="text-lg">Valor del Combustible</Label>
          </div>
          <Input 
            id="value"
            type="number"
            min="1"
            placeholder="Ej: 50000"
            value={value === undefined ? '' : value}
            onChange={(e) => setValue(parseFloat(e.target.value) || undefined)}
            className="text-lg p-6"
            required
          />
        </div>
      )}

      {reportType === 'Mantenimiento' && (
        <>
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <ToolIcon size={24} />
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

          {shouldShowProveedorInput && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <ToolIcon size={24} />
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
          )}
        </>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          {getReportTypeIcon(reportType)}
          <Label htmlFor="description" className="text-lg">
            {shouldShowInventoryMaterialSelect ? 'Observaciones adicionales' : 'Descripción'}
          </Label>
        </div>
        
        <Textarea
          id="description"
          placeholder={shouldShowInventoryMaterialSelect ? 
            'Observaciones adicionales del viaje (opcional)' : 
            'Ingrese los detalles del reporte'}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="text-lg p-4"
          required={!shouldShowInventoryMaterialSelect}
        />
      </div>
    </>
  );
};

export default ReportInputFields;
