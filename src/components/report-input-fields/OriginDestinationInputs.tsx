
import React from 'react';
import { MapPin, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const { isMachineryTransportVehicle, isCargador } = useMachineSpecificReports();

  if (reportType !== 'Viajes') {
    return null;
  }

  // Para Cargadores, forzar origen como Acopio
  React.useEffect(() => {
    if (isCargador(selectedMachine)) {
      setOrigin('Acopio Maquipaes');
    }
  }, [selectedMachine, isCargador, setOrigin]);

  // Función mejorada para normalizar el origen cuando es acopio
  const handleOriginChange = (value: string) => {
    console.log('🔄 Origen seleccionado:', value);
    
    // Si contiene "Acopio Maquipaes", normalizar a solo "Acopio Maquipaes"
    if (value.toLowerCase().includes('acopio maquipaes')) {
      const normalizedValue = 'Acopio Maquipaes';
      console.log('✅ Normalizando origen de acopio:', value, '→', normalizedValue);
      setOrigin(normalizedValue);
    } else {
      setOrigin(value);
    }
  };

  // Función para mostrar el valor correcto en el Select
  const getDisplayValue = () => {
    // Si el origen actual es "Acopio Maquipaes", buscar el proveedor original para mostrarlo
    if (origin === 'Acopio Maquipaes') {
      const acopioProvider = proveedores.find(prov => 
        prov.nombre.toLowerCase().includes('acopio maquipaes')
      );
      return acopioProvider ? `${acopioProvider.nombre} - ${acopioProvider.ciudad}` : origin;
    }
    return origin;
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={24} />
          <Label htmlFor="origin" className="text-lg">
            {isMachineryTransportVehicle(selectedMachine) 
              ? 'Origen (Punto de Recogida)' 
              : isCargador(selectedMachine)
                ? 'Origen (Fijo - Acopio)'
                : 'Origen (Proveedor)'
            }
          </Label>
        </div>

        {isCargador(selectedMachine) ? (
          <div className="space-y-3">
            <Input 
              id="origin"
              type="text"
              value="Acopio Maquipaes"
              readOnly
              className="text-lg p-6 bg-gray-50 text-gray-700 font-medium"
            />
            <Alert className="border-blue-200 bg-blue-50">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <strong>Cargador siempre opera desde el Acopio:</strong> El origen está fijo como "Acopio Maquipaes" 
                ya que los cargadores siempre cargan material desde nuestro acopio hacia los clientes.
              </AlertDescription>
            </Alert>
          </div>
        ) : isMachineryTransportVehicle(selectedMachine) ? (
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
          <Select onValueChange={handleOriginChange} value={getDisplayValue()}>
            <SelectTrigger className="text-lg p-6">
              <SelectValue placeholder="Selecciona el origen" />
            </SelectTrigger>
            <SelectContent>
              {proveedores.map((prov) => (
                <SelectItem key={prov.id} value={`${prov.nombre} - ${prov.ciudad}`}>
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
          <Label className="text-lg">
            {isCargador(selectedMachine) 
              ? 'Destino (Cliente que recibe el material)'
              : 'Destino (Cliente y Finca)'
            }
          </Label>
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
