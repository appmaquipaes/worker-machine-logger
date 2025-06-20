
import React from 'react';
import { MapPin, Info, Truck } from 'lucide-react';
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

  // Para Camabaja en viaje de regreso, actualizar origen cuando cambie el cliente
  React.useEffect(() => {
    const isCamabaja = selectedMachine?.type === 'Camabaja';
    const isRegreso = origin !== 'Acopio Maquipaes' && !origin.includes('Cliente (seleccionar');
    
    if (isCamabaja && selectedCliente && isRegreso) {
      const nuevoOrigen = `${selectedCliente} - ${selectedFinca || 'Finca'}`;
      if (origin !== nuevoOrigen && origin !== 'Acopio Maquipaes') {
        setOrigin(nuevoOrigen);
        console.log('🔄 Actualizando origen de regreso Camabaja:', nuevoOrigen);
      }
    }
  }, [selectedCliente, selectedFinca, origin, selectedMachine, setOrigin]);

  // Verificar si es Camabaja específicamente
  const isCamabaja = selectedMachine?.type === 'Camabaja';

  // Función para manejar cambios en el origen
  const handleOriginChange = (value: string) => {
    console.log('🔄 Origen seleccionado:', value);
    
    // Solo normalizar si contiene "acopio maquipaes" para efectos de inventario
    if (value.toLowerCase().includes('acopio maquipaes')) {
      const normalizedValue = 'Acopio Maquipaes';
      console.log('✅ Normalizando origen de acopio:', value, '→', normalizedValue);
      setOrigin(normalizedValue);
    } else {
      setOrigin(value);
    }
  };

  // Función para manejar el selector de tipo de viaje de Camabaja
  const handleCamabajaRouteChange = (value: string) => {
    console.log('🚛 Tipo de viaje Camabaja seleccionado:', value);
    
    if (value === 'salida') {
      setOrigin('Acopio Maquipaes');
      console.log('→ Configurado como salida: Acopio → Cliente');
    } else if (value === 'regreso') {
      // Para regreso, el origen será el cliente
      if (selectedCliente) {
        setOrigin(`${selectedCliente} - ${selectedFinca || 'Finca'}`);
        console.log('→ Configurado como regreso: Cliente → Acopio');
      } else {
        setOrigin('Cliente (seleccionar destino primero)');
      }
    }
  };

  // Función para obtener el valor correcto para el Select de proveedores
  const getSelectValue = () => {
    // Si el origin actual es exactamente "Acopio Maquipaes", buscar el proveedor correspondiente
    if (origin === 'Acopio Maquipaes') {
      const acopioProvider = proveedores.find(prov => 
        prov.nombre.toLowerCase().includes('acopio') && prov.nombre.toLowerCase().includes('maquipaes')
      );
      if (acopioProvider) {
        return `${acopioProvider.nombre} - ${acopioProvider.ciudad}`;
      }
    }
    
    // Para otros casos, verificar si el valor actual existe en la lista de proveedores
    const existingProvider = proveedores.find(prov => 
      `${prov.nombre} - ${prov.ciudad}` === origin
    );
    
    return existingProvider ? origin : '';
  };

  // Determinar el tipo de viaje actual para Camabaja
  const getCamabajaRouteType = () => {
    if (origin === 'Acopio Maquipaes') return 'salida';
    if (origin.includes(selectedCliente) && selectedCliente && origin !== 'Acopio Maquipaes') return 'regreso';
    return '';
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={24} />
          <Label htmlFor="origin" className="text-lg">
            {isCamabaja 
              ? 'Tipo de Viaje y Origen'
              : isMachineryTransportVehicle(selectedMachine) 
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
        ) : isCamabaja ? (
          <div className="space-y-4">
            {/* Selector de tipo de viaje para Camabaja */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Tipo de Viaje:</Label>
              <Select onValueChange={handleCamabajaRouteChange} value={getCamabajaRouteType()}>
                <SelectTrigger className="text-lg p-6">
                  <SelectValue placeholder="Selecciona el tipo de viaje" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salida">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Salida: Acopio → Cliente (llevando maquinaria)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="regreso">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 rotate-180" />
                      <span>Regreso: Cliente → Acopio (trayendo maquinaria)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mostrar origen actual */}
            <div className="space-y-2">
              <Label className="text-base">Origen determinado:</Label>
              <Input 
                id="origin"
                type="text"
                value={origin}
                readOnly
                className="text-lg p-6 bg-gray-50 text-gray-600 font-medium"
              />
            </div>

            <Alert className="border-orange-200 bg-orange-50">
              <Truck className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Camabaja - Transporte de Maquinaria:</strong><br/>
                • <strong>Salida:</strong> Transporta maquinaria desde Acopio hacia el cliente<br/>
                • <strong>Regreso:</strong> Trae la maquinaria de vuelta desde el cliente al Acopio<br/>
                <em>Nota: Para viajes de regreso, selecciona primero el destino (Acopio) y el origen se actualizará automáticamente.</em>
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
          <Select onValueChange={handleOriginChange} value={getSelectValue()}>
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
            {isCamabaja 
              ? 'Destino (Selecciona el cliente para viajes de regreso, o Acopio para viajes de salida)'
              : isCargador(selectedMachine) 
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
