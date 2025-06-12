import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useReport } from '@/context/ReportContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Download, Calendar, BarChart3, TrendingUp, Users, MapPin } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';

const InformesPage: React.FC = () => {
  const { user } = useAuth();
  const { getFilteredReports } = useReport();
  const { machines } = useMachine();
  const navigate = useNavigate();

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
    if (!user) {
      navigate('/login');
    }
    
    const clientesData = loadClientes();
    setClientes(clientesData);
    
    // Cargar operadores para el filtro
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const operatorUsers = storedUsers.filter((u: any) => u.role === 'Operador');
    setOperators(operatorUsers);
  }, [user, navigate]);

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
    
    // Enriquecer reportes con información de comisión
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

  const stats = getStatistics();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Corporativo */}
      <div className="page-header">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-responsive-xl font-bold text-white mb-2">
                Informes de Máquinas
              </h1>
              <p className="text-blue-100 text-responsive-base">
                Genera reportes detallados basados en los datos registrados
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="btn-outline-large bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600"
            >
              <ArrowLeft className="mobile-icon" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Filtros */}
        <Card className="corporate-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-responsive-lg">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <BarChart3 className="mobile-icon text-white" />
              </div>
              Filtros de Reporte
            </CardTitle>
            <CardDescription className="text-responsive-base">
              Selecciona los criterios para generar tu reporte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Operador</label>
                <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="Todos los operadores" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los operadores</SelectItem>
                    {operators.map((operator) => (
                      <SelectItem key={operator.id} value={operator.id}>
                        {operator.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Máquina</label>
                <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="Todas las máquinas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las máquinas</SelectItem>
                    {machines.map((machine) => (
                      <SelectItem key={machine.id} value={machine.id}>
                        {machine.name} ({machine.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Tipo de Reporte</label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="Todos los tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los tipos</SelectItem>
                    <SelectItem value="Horas Trabajadas">Horas Trabajadas</SelectItem>
                    <SelectItem value="Horas Extras">Horas Extras</SelectItem>
                    <SelectItem value="Viajes">Viajes</SelectItem>
                    <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="Combustible">Combustible</SelectItem>
                    <SelectItem value="Novedades">Novedades</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <Users size={16} />
                  Cliente
                </label>
                <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder="Todos los clientes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los clientes</SelectItem>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.nombre_cliente}>
                        {cliente.nombre_cliente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin size={16} />
                  Finca
                </label>
                <Select 
                  value={selectedFinca} 
                  onValueChange={setSelectedFinca}
                  disabled={selectedCliente === 'all' || fincas.length === 0}
                >
                  <SelectTrigger className="h-12 rounded-xl border-2">
                    <SelectValue placeholder={
                      selectedCliente === 'all' 
                        ? "Primero seleccione un cliente" 
                        : fincas.length === 0 
                          ? "El cliente no tiene fincas"
                          : "Todas las fincas"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las fincas</SelectItem>
                    {fincas.map((finca) => (
                      <SelectItem key={finca.id} value={finca.nombre_finca}>
                        {finca.nombre_finca} - {finca.ciudad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Fecha Inicio</label>
                <div className="h-12">
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Fecha Fin</label>
                <div className="h-12">
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
              </div>
            </div>

            <div className="action-grid-2 gap-4">
              <Button onClick={generateReport} className="btn-primary-large">
                <BarChart3 className="mobile-icon" />
                Generar Reporte
              </Button>
              {reportData.length > 0 && (
                <Button onClick={exportToExcel} className="btn-secondary-large">
                  <Download className="mobile-icon" />
                  Exportar Excel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <Card className="corporate-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{stats.totalReports}</div>
                <div className="text-sm text-slate-600 font-medium">Total Reportes</div>
              </CardContent>
            </Card>
            <Card className="corporate-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">{stats.totalHours}</div>
                <div className="text-sm text-slate-600 font-medium">Total Horas</div>
              </CardContent>
            </Card>
            <Card className="corporate-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{stats.totalTrips}</div>
                <div className="text-sm text-slate-600 font-medium">Total Viajes</div>
              </CardContent>
            </Card>
            <Card className="corporate-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-amber-600 mb-1">${stats.totalValue.toLocaleString()}</div>
                <div className="text-sm text-slate-600 font-medium">Valor Total</div>
              </CardContent>
            </Card>
            <Card className="corporate-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">${stats.totalCommission.toLocaleString()}</div>
                <div className="text-sm text-slate-600 font-medium">Comisiones</div>
              </CardContent>
            </Card>
            <Card className="corporate-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.uniqueMachines}</div>
                <div className="text-sm text-slate-600 font-medium">Máquinas</div>
              </CardContent>
            </Card>
            <Card className="corporate-card">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600 mb-1">{stats.uniqueClientes}</div>
                <div className="text-sm text-slate-600 font-medium">Clientes</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabla de datos */}
        {reportData.length > 0 && (
          <Card className="corporate-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-responsive-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                  <TrendingUp className="mobile-icon text-white" />
                </div>
                Datos del Reporte
              </CardTitle>
              <CardDescription className="text-responsive-base">
                Detalle de los reportes generados ({reportData.length} registros)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border-2 overflow-hidden overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold">Fecha</TableHead>
                      <TableHead className="font-semibold">Usuario</TableHead>
                      <TableHead className="font-semibold">Máquina</TableHead>
                      <TableHead className="font-semibold">Tipo</TableHead>
                      <TableHead className="font-semibold">Cliente</TableHead>
                      <TableHead className="font-semibold">Finca</TableHead>
                      <TableHead className="font-semibold">Horas</TableHead>
                      <TableHead className="font-semibold">Viajes</TableHead>
                      <TableHead className="font-semibold">M³</TableHead>
                      <TableHead className="font-semibold">Valor</TableHead>
                      <TableHead className="font-semibold">Comisión</TableHead>
                      <TableHead className="font-semibold">Cálculo</TableHead>
                      <TableHead className="font-semibold w-48">Novedades</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((report) => (
                      <TableRow key={report.id} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{report.reportDate.toLocaleDateString()}</TableCell>
                        <TableCell>{report.userName}</TableCell>
                        <TableCell>{report.machineName}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {report.reportType}
                          </span>
                        </TableCell>
                        <TableCell>{report.workSite || extractClienteFromDestination(report.destination) || '-'}</TableCell>
                        <TableCell>{extractFincaFromDestination(report.destination) || '-'}</TableCell>
                        <TableCell>{report.hours || '-'}</TableCell>
                        <TableCell>{report.trips || '-'}</TableCell>
                        <TableCell>{report.cantidadM3 || '-'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className={report.value ? 'font-semibold text-green-600' : 'text-slate-400'}>
                              {report.value ? `$${report.value.toLocaleString()}` : '-'}
                            </span>
                            {report.tarifaEncontrada !== undefined && (
                              <span className={`text-xs ${report.tarifaEncontrada ? 'text-green-600' : 'text-orange-600'}`}>
                                {report.tarifaEncontrada ? '✓ Con tarifa' : '⚠ Sin tarifa'}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-orange-600">
                              {report.comisionTotal ? `$${report.comisionTotal.toLocaleString()}` : '-'}
                            </span>
                            {report.comisionPorHora > 0 && (
                              <span className="text-xs text-slate-500">
                                ${report.comisionPorHora.toLocaleString()}/h
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="w-48 max-w-48">
                          <div className="truncate text-sm" title={report.detalleCalculo || ''}>
                            {report.detalleCalculo || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="w-48 max-w-48">
                          <div className="truncate text-sm" title={report.reportType === 'Novedades' ? report.description : ''}>
                            {report.reportType === 'Novedades' ? report.description : '-'}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InformesPage;
