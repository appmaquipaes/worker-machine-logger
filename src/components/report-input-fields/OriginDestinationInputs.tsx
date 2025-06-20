
import React from 'react';
import { Machine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { ReportType } from '@/types/report';
import CamabajaRouteInputs from './CamabajaRouteInputs';
import StandardOriginDestinationInputs from './StandardOriginDestinationInputs';

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
  const { isCargador } = useMachineSpecificReports();

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

  // Renderizar interfaz específica para Camabaja
  if (isCamabaja) {
    return (
      <CamabajaRouteInputs
        origin={origin}
        setOrigin={setOrigin}
        selectedCliente={selectedCliente}
        selectedFinca={selectedFinca}
        onClienteChangeForDestination={onClienteChangeForDestination}
        onFincaChangeForDestination={onFincaChangeForDestination}
      />
    );
  }

  // Interfaz para otras máquinas
  return (
    <StandardOriginDestinationInputs
      origin={origin}
      setOrigin={setOrigin}
      selectedCliente={selectedCliente}
      selectedFinca={selectedFinca}
      onClienteChangeForDestination={onClienteChangeForDestination}
      onFincaChangeForDestination={onFincaChangeForDestination}
      proveedores={proveedores}
      selectedMachine={selectedMachine}
    />
  );
};

export default OriginDestinationInputs;
