
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
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [reportData, setReportData] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    
    // Cargar clientes
    const clientesData = loadClientes();
    setClientes(clientesData);
  }, [user, navigate]);

  useEffect(() => {
    // Cargar fincas cuando se selecciona un cliente
    if (selectedCliente && selectedCliente !== 'all') {
      const cliente = getClienteByName(selectedCliente);
      if (cliente) {
        const fincasData = getFincasByCliente(cliente.id);
        setFincas(fincasData);
      } else {
        setFincas([]);
      }
      setSelectedFinca('all'); // Reset finca selection
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
    
    if (startDate) {
      filters.startDate = startDate;
    }
    
    if (endDate) {
      filters.endDate = endDate;
    }

    const reports = getFilteredReports(filters);
    setReportData(reports);
    
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
      'Descripción': report.description,
      'Cliente': report.workSite || extractClienteFromDestination(report.destination),
      'Finca': extractFincaFromDestination(report.destination),
      'Horas': report.hours || '',
      'Viajes': report.trips || '',
      'Valor': report.value ? `$${report.value.toLocaleString()}` : '',
      'Origen': report.origin || '',
      'Destino': report.destination || '',
      'M³': report.cantidadM3 || '',
      'Proveedor': report.proveedor || '',
      'Kilometraje': report.kilometraje || '',
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
    const uniqueMachines = new Set(reportData.map(report => report.machineName)).size;
    const uniqueClientes = new Set(reportData.map(report => 
      report.workSite || extractClienteFromDestination(report.destination)
    ).filter(Boolean)).size;

    return {
      totalReports: reportData.length,
      totalHours,
      totalTrips,
      totalValue,
      uniqueMachines,
      uniqueClientes
    };
  };

  const stats = getStatistics();

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Informes de Máquinas</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver al dashboard
          </Button>
        </div>
        <p className="text-muted-foreground">
          Genera reportes detallados basados en los datos registrados
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Filtros de Reporte
          </CardTitle>
          <CardDescription>
            Selecciona los criterios para generar tu reporte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Máquina</label>
              <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                <SelectTrigger>
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
              <label className="text-sm font-medium">Tipo de Reporte</label>
              <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                <SelectTrigger>
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
              <label className="text-sm font-medium flex items-center gap-1">
                <Users size={16} />
                Cliente
              </label>
              <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                <SelectTrigger>
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
              <label className="text-sm font-medium flex items-center gap-1">
                <MapPin size={16} />
                Finca
              </label>
              <Select 
                value={selectedFinca} 
                onValueChange={setSelectedFinca}
                disabled={selectedCliente === 'all' || fincas.length === 0}
              >
                <SelectTrigger>
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
              <label className="text-sm font-medium">Fecha Inicio</label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Fin</label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={generateReport} className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Generar Reporte
            </Button>
            {reportData.length > 0 && (
              <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar a Excel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats.totalReports}</div>
              <div className="text-sm text-muted-foreground">Total Reportes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalHours}</div>
              <div className="text-sm text-muted-foreground">Total Horas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTrips}</div>
              <div className="text-sm text-muted-foreground">Total Viajes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-amber-600">${stats.totalValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Valor Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.uniqueMachines}</div>
              <div className="text-sm text-muted-foreground">Máquinas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">{stats.uniqueClientes}</div>
              <div className="text-sm text-muted-foreground">Clientes</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabla de datos */}
      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Datos del Reporte
            </CardTitle>
            <CardDescription>
              Detalle de los reportes generados ({reportData.length} registros)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Máquina</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Finca</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Horas</TableHead>
                    <TableHead>Viajes</TableHead>
                    <TableHead>M³</TableHead>
                    <TableHead>Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.reportDate.toLocaleDateString()}</TableCell>
                      <TableCell>{report.userName}</TableCell>
                      <TableCell>{report.machineName}</TableCell>
                      <TableCell>{report.reportType}</TableCell>
                      <TableCell>{report.workSite || extractClienteFromDestination(report.destination) || '-'}</TableCell>
                      <TableCell>{extractFincaFromDestination(report.destination) || '-'}</TableCell>
                      <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                      <TableCell>{report.hours || '-'}</TableCell>
                      <TableCell>{report.trips || '-'}</TableCell>
                      <TableCell>{report.cantidadM3 || '-'}</TableCell>
                      <TableCell>{report.value ? `$${report.value.toLocaleString()}` : '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InformesPage;
