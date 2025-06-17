
import React from 'react';
import { ReportType } from '@/types/report';
import { useMachine } from '@/context/MachineContext';
import BasicReportInputs from '@/components/report-input-fields/BasicReportInputs';
import LocationInputs from '@/components/report-input-fields/LocationInputs';
import ServiceInputs from '@/components/report-input-fields/ServiceInputs';
import ReportTypeInputs from '@/components/report-input-fields/ReportTypeInputs';

interface ReportInputFieldsProps {
  reportType: ReportType;
  reportDate: Date;
  setReportDate: (date: Date) => void;
  description: string;
  setDescription: (value: string) => void;
  trips?: number;
  setTrips: (value: number | undefined) => void;
  hours?: number;
  setHours: (value: number | undefined) => void;
  value?: number;
  setValue: (value: number | undefined) => void;
  workSite: string;
  setWorkSite: (value: string) => void;
  origin: string;
  setOrigin: (value: string) => void;
  selectedCliente: string;
  setSelectedCliente: (value: string) => void;
  selectedFinca: string;
  setSelectedFinca: (value: string) => void;
  maintenanceValue?: number;
  setMaintenanceValue: (value: number | undefined) => void;
  cantidadM3?: number;
  setCantidadM3: (value: number | undefined) => void;
  proveedor: string;
  setProveedor: (value: string) => void;
  kilometraje?: number;
  setKilometraje: (value: number | undefined) => void;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  proveedores: any[];
  tiposMaterial: string[];
  inventarioAcopio: any[];
  onClienteChangeForWorkSite: (cliente: string) => void;
  onClienteChangeForDestination: (cliente: string) => void;
  onFincaChangeForDestination: (finca: string) => void;
  selectedMaquinaria?: string;
  setSelectedMaquinaria?: (value: string) => void;
}

const ReportInputFields: React.FC<ReportInputFieldsProps> = ({
  reportType,
  reportDate,
  setReportDate,
  description,
  setDescription,
  trips,
  setTrips,
  hours,
  setHours,
  value,
  setValue,
  workSite,
  setWorkSite,
  origin,
  setOrigin,
  selectedCliente,
  setSelectedCliente,
  selectedFinca,
  setSelectedFinca,
  maintenanceValue,
  setMaintenanceValue,
  cantidadM3,
  setCantidadM3,
  proveedor,
  setProveedor,
  kilometraje,
  setKilometraje,
  tipoMateria,
  setTipoMateria,
  proveedores,
  tiposMaterial,
  inventarioAcopio,
  onClienteChangeForWorkSite,
  onClienteChangeForDestination,
  onFincaChangeForDestination,
  selectedMaquinaria = '',
  setSelectedMaquinaria = () => {}
}) => {
  const { selectedMachine } = useMachine();

  return (
    <>
      <BasicReportInputs
        reportType={reportType}
        reportDate={reportDate}
        setReportDate={setReportDate}
        workSite={workSite}
        onClienteChangeForWorkSite={onClienteChangeForWorkSite}
        hours={hours}
        setHours={setHours}
        trips={trips}
        setTrips={setTrips}
      />

      <LocationInputs
        reportType={reportType}
        origin={origin}
        setOrigin={setOrigin}
        selectedCliente={selectedCliente}
        selectedFinca={selectedFinca}
        onClienteChangeForDestination={onClienteChangeForDestination}
        onFincaChangeForDestination={onFincaChangeForDestination}
        proveedores={proveedores}
        selectedMachine={selectedMachine}
        tipoMateria={tipoMateria}
        setTipoMateria={setTipoMateria}
        trips={trips}
        setTrips={setTrips}
      />

      <ReportTypeInputs
        reportType={reportType}
        selectedMachine={selectedMachine}
        selectedMaquinaria={selectedMaquinaria}
        setSelectedMaquinaria={setSelectedMaquinaria}
      />

      <ServiceInputs
        reportType={reportType}
        origin={origin}
        tipoMateria={tipoMateria}
        setTipoMateria={setTipoMateria}
        cantidadM3={cantidadM3}
        setCantidadM3={setCantidadM3}
        tiposMaterial={tiposMaterial}
        inventarioAcopio={inventarioAcopio}
        selectedMachine={selectedMachine}
        value={value}
        setValue={setValue}
        kilometraje={kilometraje}
        setKilometraje={setKilometraje}
        maintenanceValue={maintenanceValue}
        setMaintenanceValue={setMaintenanceValue}
        proveedor={proveedor}
        setProveedor={setProveedor}
        proveedores={proveedores}
        description={description}
        setDescription={setDescription}
      />
    </>
  );
};

export default ReportInputFields;
