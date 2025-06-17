
import React from 'react';
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import MaquinariaSelector from '@/components/MaquinariaSelector';
import ReportDateInput from '@/components/report-input-fields/ReportDateInput';
import WorkSiteInput from '@/components/report-input-fields/WorkSiteInput';
import HoursInput from '@/components/report-input-fields/HoursInput';
import TripsInput from '@/components/report-input-fields/TripsInput';
import OriginDestinationInputs from '@/components/report-input-fields/OriginDestinationInputs';
import MaterialInputs from '@/components/report-input-fields/MaterialInputs';
import FuelInputs from '@/components/report-input-fields/FuelInputs';
import MaintenanceInputs from '@/components/report-input-fields/MaintenanceInputs';
import NovedadesInput from '@/components/report-input-fields/NovedadesInput';
import EscombreraInputs from '@/components/report-input-fields/EscombreraInputs';
import { useMachine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';

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
  const { isMachineryTransportVehicle } = useMachineSpecificReports();

  return (
    <>
      <ReportDateInput
        reportDate={reportDate}
        setReportDate={setReportDate}
      />

      <WorkSiteInput
        reportType={reportType}
        workSite={workSite}
        onClienteChangeForWorkSite={onClienteChangeForWorkSite}
      />

      <HoursInput
        reportType={reportType}
        hours={hours}
        setHours={setHours}
      />

      <TripsInput
        reportType={reportType}
        trips={trips}
        setTrips={setTrips}
      />

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

      {reportType === 'Viajes' && isMachineryTransportVehicle(selectedMachine) && (
        <MaquinariaSelector
          selectedMaquinaria={selectedMaquinaria}
          onMaquinariaChange={setSelectedMaquinaria}
        />
      )}

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

export default ReportInputFields;
