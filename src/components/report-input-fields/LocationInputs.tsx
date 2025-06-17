
import React from 'react';
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import OriginDestinationInputs from './OriginDestinationInputs';
import EscombreraInputs from './EscombreraInputs';

interface LocationInputsProps {
  reportType: ReportType;
  origin: string;
  setOrigin: (value: string) => void;
  selectedCliente: string;
  selectedFinca: string;
  onClienteChangeForDestination: (cliente: string) => void;
  onFincaChangeForDestination: (finca: string) => void;
  proveedores: any[];
  selectedMachine?: Machine;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  trips?: number;
  setTrips: (value: number | undefined) => void;
}

const LocationInputs: React.FC<LocationInputsProps> = ({
  reportType,
  origin,
  setOrigin,
  selectedCliente,
  selectedFinca,
  onClienteChangeForDestination,
  onFincaChangeForDestination,
  proveedores,
  selectedMachine,
  tipoMateria,
  setTipoMateria,
  trips,
  setTrips
}) => {
  return (
    <>
      <OriginDestinationInputs
        reportType={reportType}
        origin={origin}
        setOrigin={setOrigin}
        selectedCliente={selectedCliente}
        selectedFinca={selectedFinca}
        onClienteChangeForDestination={onClienteChangeForDestination}
        onFincaChangeForDestination={onFincaChangeForDestination}
        proveedores={proveedores}
        selectedMachine={selectedMachine}
      />

      <EscombreraInputs
        reportType={reportType}
        selectedCliente={selectedCliente}
        onClienteChangeForDestination={onClienteChangeForDestination}
        tipoMateria={tipoMateria}
        setTipoMateria={setTipoMateria}
        trips={trips}
        setTrips={setTrips}
        selectedMachine={selectedMachine}
      />
    </>
  );
};

export default LocationInputs;
