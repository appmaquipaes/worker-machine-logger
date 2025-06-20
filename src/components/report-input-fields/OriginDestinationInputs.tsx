
import React from 'react';
import { MapPin, Info, Truck, ArrowRight } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
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

  // Renderizar interfaz específica para Camabaja
  if (isCamabaja) {
    return (
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardContent className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-orange-800 mb-2">
              🚛 Transporte de Maquinaria - Camabaja
            </h3>
            <p className="text-orange-700">
              Configura el tipo de viaje para determinar automáticamente origen y destino
            </p>
          </div>

          {/* Selector de tipo de viaje */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold text-orange-800">
              1. Selecciona el Tipo de Viaje:
            </Label>
            <Select onValueChange={handleCamabajaRouteChange} value={getCamabajaRouteType()}>
              <SelectTrigger className="text-lg p-6 border-orange-300 focus:border-orange-500">
                <SelectValue placeholder="Selecciona el tipo de viaje" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salida">
                  <div className="flex items-center gap-3 py-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium">Salida: Llevando Maquinaria</div>
                      <div className="text-sm text-gray-600">Acopio → Cliente</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="regreso">
                  <div className="flex items-center gap-3 py-2">
                    <Truck className="h-5 w-5 text-blue-600 rotate-180" />
                    <div>
                      <div className="font-medium">Regreso: Trayendo Maquinaria</div>
                      <div className="text-sm text-gray-600">Cliente → Acopio</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {getCamabajaRouteType() && (
            <>
              {/* Mostrar ruta visual */}
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-orange-300">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="font-semibold text-gray-700">ORIGEN</div>
                    <div className="text-lg font-bold text-orange-600">
                      {getCamabajaRouteType() === 'salida' ? 'Acopio Maquipaes' : 
                       selectedCliente ? `${selectedCliente}` : 'Cliente'}
                    </div>
                  </div>
                  <ArrowRight className="h-8 w-8 text-orange-500" />
                  <div className="text-center">
                    <div className="font-semibold text-gray-700">DESTINO</div>
                    <div className="text-lg font-bold text-blue-600">
                      {getCamabajaRouteType() === 'salida' ? 
                       (selectedCliente ? selectedCliente : 'Cliente') : 'Acopio Maquipaes'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selector de cliente */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-orange-800">
                  2. {getCamabajaRouteType() === 'salida' ? 
                      'Selecciona el Cliente de Destino:' : 
                      'Selecciona el Cliente de Origen:'}
                </Label>
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

          <Alert className="border-orange-300 bg-orange-100">
            <Info className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Información importante:</strong><br/>
              • <strong>Salida:</strong> Transporta maquinaria desde el Acopio hacia el sitio del cliente<br/>
              • <strong>Regreso:</strong> Trae la maquinaria de vuelta desde el cliente al Acopio<br/>
              • El origen y destino se configuran automáticamente según el tipo de viaje
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Interfaz para otras máquinas (código existente)
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
