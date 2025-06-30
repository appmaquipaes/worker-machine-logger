
import React from 'react';
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import MaterialInputs from './MaterialInputs';
import HourlyValueInput from './HourlyValueInput';
import FuelValueInput from './FuelValueInput';
import MaintenanceValueInput from './MaintenanceValueInput';
import NovedadesDescriptionInput from './NovedadesDescriptionInput';

interface ServiceInputsProps {
  reportType: ReportType;
  origin: string;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  cantidadM3?: number;
  setCantidadM3: (value: number | undefined) => void;
  tiposMaterial: string[];
  inventarioAcopio: any[];
  selectedMachine?: Machine | null;
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
  // Componente para valores de horas trabajadas y extras
  if (reportType === 'Horas Trabajadas' || reportType === 'Horas Extras') {
    return (
      <HourlyValueInput
        reportType={reportType}
        value={value}
        setValue={setValue}
      />
    );
  }

  // Componente para combustible
  if (reportType === 'Combustible') {
    return (
      <FuelValueInput
        reportType={reportType}
        value={value}
        setValue={setValue}
        kilometraje={kilometraje}
        setKilometraje={setKilometraje}
      />
    );
  }

  // Componente para mantenimiento
  if (reportType === 'Mantenimiento') {
    return (
      <MaintenanceValueInput
        reportType={reportType}
        maintenanceValue={maintenanceValue}
        setMaintenanceValue={setMaintenanceValue}
        proveedor={proveedor}
        setProveedor={setProveedor}
        proveedores={proveedores}
      />
    );
  }

  // Componente para novedades
  if (reportType === 'Novedades') {
    return (
      <NovedadesDescriptionInput
        reportType={reportType}
        description={description}
        setDescription={setDescription}
      />
    );
  }

  // Para viajes, mostrar MaterialInputs si es necesario
  if (reportType === 'Viajes') {
    return (
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
    );
  }

  // Para otros tipos de reporte, no mostrar campos adicionales
  return null;
};

export default ServiceInputs;
