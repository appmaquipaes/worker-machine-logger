
import React from 'react';
import { ReportType } from '@/types/report';
import { Machine } from '@/context/MachineContext';
import ReportTypeCard from './ReportTypeCard';
import { useReportTypeConfig } from '@/hooks/useReportTypeConfig';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';

interface ReportTypeGridProps {
  reportType: ReportType;
  onReportTypeChange: (type: ReportType) => void;
  selectedMachine?: Machine;
}

const ReportTypeGrid: React.FC<ReportTypeGridProps> = ({
  reportType,
  onReportTypeChange,
  selectedMachine
}) => {
  const { getAllReportTypes } = useReportTypeConfig();
  const { getAvailableReportTypes } = useMachineSpecificReports();

  const allReportTypes = getAllReportTypes();
  const availableReportTypeStrings = getAvailableReportTypes(selectedMachine);
  
  const availableReportTypes = allReportTypes.filter(reportTypeItem => 
    availableReportTypeStrings.includes(reportTypeItem.type)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableReportTypes.map((reportTypeConfig) => (
        <ReportTypeCard
          key={reportTypeConfig.type}
          {...reportTypeConfig}
          isSelected={reportType === reportTypeConfig.type}
          onClick={() => onReportTypeChange(reportTypeConfig.type)}
        />
      ))}
    </div>
  );
};

export default ReportTypeGrid;
