
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useInformesFilters } from './useInformesFilters';
import { useInformesData } from './useInformesData';
import { useInformesReports } from './useInformesReports';

export const useInformesPage = () => {
  const { user } = useAuth();
  const { machines } = useMachine();
  const { operators } = useInformesData();
  
  const {
    selectedMachine,
    setSelectedMachine,
    selectedReportType,
    setSelectedReportType,
    selectedCliente,
    setSelectedCliente,
    selectedFinca,
    setSelectedFinca,
    selectedOperator,
    setSelectedOperator,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    clientes,
    fincas,
    getFilters
  } = useInformesFilters();

  const {
    reportData,
    generateReport: generateReportBase,
    exportToExcel,
    extractClienteFromDestination,
    extractFincaFromDestination,
    getStatistics
  } = useInformesReports(operators);

  const generateReport = () => {
    const filters = getFilters();
    generateReportBase(filters);
  };

  return {
    user,
    machines,
    operators,
    clientes,
    fincas,
    selectedMachine,
    setSelectedMachine,
    selectedReportType,
    setSelectedReportType,
    selectedCliente,
    setSelectedCliente,
    selectedFinca,
    setSelectedFinca,
    selectedOperator,
    setSelectedOperator,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    reportData,
    generateReport,
    exportToExcel,
    extractClienteFromDestination,
    extractFincaFromDestination,
    getStatistics
  };
};
