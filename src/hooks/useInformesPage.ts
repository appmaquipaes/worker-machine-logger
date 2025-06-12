
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useReport } from '@/context/ReportContext';
import { useMachine } from '@/context/MachineContext';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

export const useInformesPage = () => {
  const { user } = useAuth();
  const { getFilteredReports } = useReport();
  const { machines } = useMachine();

  const [selectedMachine, setSelectedMachine] = useState<string>('all');
  const [selectedReportType, setSelectedReportType] = useState<string>('all');
  const [selectedCliente, setSelectedCliente] = useState<string>('all');
  const [selectedFinca, setSelectedFinca] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [reportData, setReportData] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);

  useEffect(() => {
    const clientesData = loadClientes();
    setClientes(clientesData);
    
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const operatorUsers = storedUsers.filter((u: any) => u.role === 'Operador');
    setOperators(operatorUsers);
  }, []);

  useEffect(() => {
    if (selectedCliente && selectedCliente !== 'all') {
      const cliente = getClienteByName(selectedCliente);
      if (cliente) {
        const fincasData = getFincasByCliente(cliente.id);
        setFincas(fincasData);
      } else {
        setFincas([]);
      }
      setSelectedFinca('all');
    } else {
      setFincas([]);
      setSelectedFinca('all');
    }
  }, [selectedCliente]);

  const generateReport = () => {
    const filters: any = {};
    
    if (selectedMachine !== 'all') {
      filters.machineId = selectedMachine;
    }
    
    if (selectedReportType !== 'all') {
      filters.reportType = selectedReportType;
    }

    if (selectedCliente !== 'all') {
      filters.cliente = selectedCliente;
    }

    if (selectedFinca !== 'all') {
      filters.finca = selectedFinca;
    }

    if (selectedOperator !== 'all') {
      filters.userId = selectedOperator;
    }
    
    if (startDate) {
      filters.startDate = startDate;
    }
    
    if (endDate) {
      filters.endDate = endDate;
    }

    const reports = getFilteredReports(filters);
    
    const reportsWithCommission = reports.map(report => {
      const operator = operators.find(op => op.id === report.userId);
      const comisionPorHora = operator?.comisionPorHora || 0;
      const comisionTotal = (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') && report.hours
        ? report.hours * comisionPorHora
        : 0;
      
      return {
        ...report,
        comisionPorHora,
        comisionTotal
      };
    });
    
    setReportData(reportsWithCommission);
    
    if (reports.length === 0) {
      toast.info('No se encontraron reportes con los filtros seleccionados');
    } else {
      toast.success(`Se generó el reporte con ${reports.length} registros`);
    }
  };

  const exportToExcel = () => {
    if (reportData.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = reportData.map(report => ({
      'Fecha': report.reportDate.toLocaleDateString(),
      'Usuario': report.userName,
      'Máquina': report.machineName,
      'Tipo de Reporte': report.reportType,
      'Cliente': report.workSite || extractClienteFromDestination(report.destination),
      'Finca': extractFincaFromDestination(report.destination),
      'Horas': report.hours || '',
      'Viajes': report.trips || '',
      'M³': report.cantidadM3 || '',
      'Valor': report.value ? `$${report.value.toLocaleString()}` : '',
      'Comisión por Hora': report.comisionPorHora ? `$${report.comisionPorHora.toLocaleString()}` : '',
      'Comisión Total': report.comisionTotal ? `$${report.comisionTotal.toLocaleString()}` : '',
      'Detalle Cálculo': report.detalleCalculo || '',
      'Tarifa Encontrada': report.tarifaEncontrada ? 'Sí' : 'No',
      'Origen': report.origin || '',
      'Destino': report.destination || '',
      'Proveedor': report.proveedor || '',
      'Kilometraje': report.kilometraje || '',
      'Novedades': report.reportType === 'Novedades' ? report.description : '',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    
    const fileName = `reporte_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte exportado correctamente');
  };

  const extractClienteFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[0] || '';
  };

  const extractFincaFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[1] || '';
  };

  const getStatistics = () => {
    if (reportData.length === 0) return null;

    const totalHours = reportData.reduce((sum, report) => sum + (report.hours || 0), 0);
    const totalTrips = reportData.reduce((sum, report) => sum + (report.trips || 0), 0);
    const totalValue = reportData.reduce((sum, report) => sum + (report.value || 0), 0);
    const totalCommission = reportData.reduce((sum, report) => sum + (report.comisionTotal || 0), 0);
    const uniqueMachines = new Set(reportData.map(report => report.machineName)).size;
    const uniqueClientes = new Set(reportData.map(report => 
      report.workSite || extractClienteFromDestination(report.destination)
    ).filter(Boolean)).size;

    return {
      totalReports: reportData.length,
      totalHours,
      totalTrips,
      totalValue,
      totalCommission,
      uniqueMachines,
      uniqueClientes
    };
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
