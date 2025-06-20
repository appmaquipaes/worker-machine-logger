
import React from 'react';
import { Truck, ArrowRight, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';

interface CamabajaRouteInputsProps {
  origin: string;
  setOrigin: (value: string) => void;
  selectedCliente: string;
  selectedFinca: string;
  onClienteChangeForDestination: (cliente: string) => void;
  onFincaChangeForDestination: (finca: string) => void;
}

const CamabajaRouteInputs: React.FC<CamabajaRouteInputsProps> = ({
  origin,
  setOrigin,
  selectedCliente,
  selectedFinca,
  onClienteChangeForDestination,
  onFincaChangeForDestination
}) => {
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

  // Determinar el tipo de viaje actual para Camabaja
  const getCamabajaRouteType = () => {
    if (origin === 'Acopio Maquipaes') return 'salida';
    if (origin.includes(selectedCliente) && selectedCliente && origin !== 'Acopio Maquipaes') return 'regreso';
    return '';
  };

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
};

export default CamabajaRouteInputs;
