
import React from 'react';
import { MapPin, Info, Building2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import { Machine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';

interface StandardOriginDestinationInputsProps {
  origin: string;
  setOrigin: (value: string) => void;
  selectedCliente: string;
  selectedFinca: string;
  onClienteChangeForDestination: (cliente: string) => void;
  onFincaChangeForDestination: (finca: string) => void;
  proveedores: any[];
  selectedMachine?: Machine;
}

const StandardOriginDestinationInputs: React.FC<StandardOriginDestinationInputsProps> = ({
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

  // Obtener información del proveedor seleccionado
  const proveedorSeleccionado = proveedores.find(prov => 
    `${prov.nombre} - ${prov.ciudad}` === origin
  );

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
                : 'Origen - Proveedor de Material'
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
            <Alert className="border-green-200 bg-green-50">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
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
          <div className="space-y-3">
            {(selectedMachine?.type === 'Camión' || selectedMachine?.type === 'Volqueta') && (
              <Alert className="border-blue-200 bg-blue-50">
                <Building2 className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Selección de Proveedor:</strong> Elige el proveedor que suministra el material 
                  que vas a transportar. Los materiales disponibles se mostrarán según el proveedor seleccionado.
                </AlertDescription>
              </Alert>
            )}
            
            <Select onValueChange={handleOriginChange} value={getSelectValue()}>
              <SelectTrigger className="text-lg p-6">
                <SelectValue placeholder="Selecciona el proveedor de origen" />
              </SelectTrigger>
              <SelectContent>
                {proveedores.map((prov) => (
                  <SelectItem key={prov.id} value={`${prov.nombre} - ${prov.ciudad}`}>
                    <div className="flex flex-col">
                      <span className="font-medium">{prov.nombre}</span>
                      <span className="text-sm text-gray-600">{prov.ciudad} - {prov.tipo_proveedor}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {proveedorSeleccionado && (
              <div className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 size={16} className="text-gray-600" />
                  <span className="font-medium text-gray-800">Información del Proveedor</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Contacto:</span>
                    <span className="ml-1 font-medium">{proveedorSeleccionado.contacto_principal}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="ml-1 font-medium">{proveedorSeleccionado.telefono}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Tipo:</span>
                    <span className="ml-1 font-medium">{proveedorSeleccionado.tipo_proveedor}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ciudad:</span>
                    <span className="ml-1 font-medium">{proveedorSeleccionado.ciudad}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
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

export default StandardOriginDestinationInputs;
