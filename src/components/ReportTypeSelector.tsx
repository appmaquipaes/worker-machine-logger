
import React from 'react';
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import ReportTypeGrid from '@/components/report-type-selector/ReportTypeGrid';
import MachineInfoDisplay from '@/components/report-type-selector/MachineInfoDisplay';

interface ReportTypeSelectorProps {
  reportType: ReportType;
  onReportTypeChange: (type: ReportType) => void;
  selectedMachine?: Machine;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({
  reportType,
  onReportTypeChange,
  selectedMachine
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
          Selecciona el tipo de reporte
        </h3>
        <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto font-medium">
          {selectedMachine && ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(selectedMachine.type) 
            ? 'Registra la actividad realizada con este vehículo de transporte'
            : 'Registra la actividad realizada con esta máquina'
          }
        </p>
      </div>
      
      <ReportTypeGrid
        reportType={reportType}
        onReportTypeChange={onReportTypeChange}
        selectedMachine={selectedMachine}
      />

      {selectedMachine && (
        <MachineInfoDisplay selectedMachine={selectedMachine} />
      )}
    </div>
  );
};

export default ReportTypeSelector;
