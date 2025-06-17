
import React from 'react';
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import MaquinariaSelector from '@/components/MaquinariaSelector';

interface ReportTypeInputsProps {
  reportType: ReportType;
  selectedMachine?: Machine;
  selectedMaquinaria: string;
  setSelectedMaquinaria: (value: string) => void;
}

const ReportTypeInputs: React.FC<ReportTypeInputsProps> = ({
  reportType,
  selectedMachine,
  selectedMaquinaria,
  setSelectedMaquinaria
}) => {
  const { isMachineryTransportVehicle } = useMachineSpecificReports();

  if (reportType !== 'Viajes' || !isMachineryTransportVehicle(selectedMachine)) {
    return null;
  }

  return (
    <MaquinariaSelector
      selectedMaquinaria={selectedMaquinaria}
      onMaquinariaChange={setSelectedMaquinaria}
    />
  );
};

export default ReportTypeInputs;
