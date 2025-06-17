
import React from 'react';
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import MaterialInputs from './MaterialInputs';
import FuelInputs from './FuelInputs';
import MaintenanceInputs from './MaintenanceInputs';
import NovedadesInput from './NovedadesInput';

interface ServiceInputsProps {
  reportType: ReportType;
  origin: string;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  cantidadM3?: number;
  setCantidadM3: (value: number | undefined) => void;
  tiposMaterial: string[];
  inventarioAcopio: any[];
  selectedMachine?: Machine;
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
  return (
    <>
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

      <FuelInputs
        reportType={reportType}
        value={value}
        setValue={setValue}
        kilometraje={kilometraje}
        setKilometraje={setKilometraje}
      />

      <MaintenanceInputs
        reportType={reportType}
        maintenanceValue={maintenanceValue}
        setMaintenanceValue={setMaintenanceValue}
        proveedor={proveedor}
        setProveedor={setProveedor}
        proveedores={proveedores}
      />

      <NovedadesInput
        reportType={reportType}
        description={description}
        setDescription={setDescription}
      />
    </>
  );
};

export default ServiceInputs;
