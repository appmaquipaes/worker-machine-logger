
import React from 'react';
import { MapPin } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import { Machine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { ReportType } from '@/types/report';

interface OriginDestinationInputsProps {
  reportType: ReportType;
  origin: string;
  setOrigin: (value: string) => void;
  selectedCliente: string;
  selectedFinca: string;
  onClienteChangeForDestination: (cliente: string) => void;
  onFincaChangeForDestination: (finca: string) => void;
  proveedores: any[];
  selectedMachine?: Machine;
}

const OriginDestinationInputs: React.FC<OriginDestinationInputsProps> = ({
  reportType,
  origin,
  setOrigin,
  selectedCliente,
  selectedFinca,
  onClienteChangeForDestination,
  onFincaChangeForDestination,
  proveedores,
  selectedMachine
}) => {
  const { isMachineryTransportVehicle } = useMachineSpecificReports();

  if (reportType !== 'Viajes') {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={24} />
          <Label htmlFor="origin" className="text-lg">
            {isMachineryTransportVehicle(selectedMachine) ? 'Origen (Punto de Recogida)' : 'Origen (Proveedor)'}
          </Label>
        </div>
        {isMachineryTransportVehicle(selectedMachine) ? (
          <Input 
            id="origin"
            type="text"
            placeholder="Ej: Patio de máquinas, Obra anterior, etc."
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="text-lg p-6"
            required
          />
        ) : (
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
        )}
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
  );
};

export default OriginDestinationInputs;
