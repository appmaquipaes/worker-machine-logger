
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useReport, Report, ReportType } from '@/context/ReportContext';
import { useMachine, Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from "sonner";
import { format } from 'date-fns';
import { DatePicker } from '@/components/DatePicker';
import { Calendar } from "lucide-react";

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const { reports, getFilteredReports } = useReport();
  const { machines } = useMachine();
  const navigate = useNavigate();
  
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [userNameFilter, setUserNameFilter] = useState('');
  const [machineFilter, setMachineFilter] = useState('');
  const [reportTypeFilter, setReportTypeFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Redirigir si no hay un usuario o no es administrador
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Aplicar filtros
  useEffect(() => {
    let result = [...reports];
    
    if (userNameFilter) {
      result = result.filter(report => 
        report.userName.toLowerCase().includes(userNameFilter.toLowerCase())
      );
    }
    
    if (machineFilter) {
      result = result.filter(report => report.machineId === machineFilter);
    }
    
    if (reportTypeFilter) {
      result = result.filter(report => report.reportType === reportTypeFilter);
    }
    
    if (startDate) {
      result = result.filter(report => {
        const reportDate = new Date(report.reportDate);
        reportDate.setHours(0, 0, 0, 0);
        return reportDate >= startDate;
      });
    }
    
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(report => new Date(report.reportDate) <= endOfDay);
    }
    
    // Ordenar por fecha descendente (más reciente primero)
    result.sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime());
    
    setFilteredReports(result);
  }, [reports, userNameFilter, machineFilter, reportTypeFilter, startDate, endDate]);
  
  const handleExportCSV = () => {
    try {
      // Crear los datos en formato CSV
      const headers = ['ID', 'Trabajador', 'Máquina', 'Tipo', 'Descripción', 'Fecha del Reporte', 'Fecha de Creación'];
      const csvData = [
        headers.join(','),
        ...filteredReports.map(report => [
          report.id,
          report.userName,
          report.machineName,
          report.reportType,
          `"${report.description.replace(/"/g, '""')}"`, // Escapar comillas en texto
          format(report.reportDate, 'dd/MM/yyyy'),
          format(report.createdAt, 'dd/MM/yyyy HH:mm')
        ].join(','))
      ].join('\n');
      
      // Crear un objeto blob con el CSV
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      
      // Crear un link para descargar
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `reportes-${format(new Date(), 'yyyyMMdd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Reporte exportado correctamente');
    } catch (error) {
      console.error('Error al exportar:', error);
      toast.error('Error al exportar el reporte');
    }
  };
  
  const clearFilters = () => {
    setUserNameFilter('');
    setMachineFilter('');
    setReportTypeFilter('');
    setStartDate(undefined);
    setEndDate(undefined);
  };
  
  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground mt-2">
          Visualiza y gestiona todos los reportes de la empresa
        </p>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra los reportes según tus necesidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="userName">Trabajador</Label>
              <Input
                id="userName"
                placeholder="Nombre del trabajador"
                value={userNameFilter}
                onChange={(e) => setUserNameFilter(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="machine">Máquina</Label>
              <Select value={machineFilter} onValueChange={setMachineFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las máquinas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las máquinas</SelectItem>
                  {machines.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reportType">Tipo de Reporte</Label>
              <Select value={reportTypeFilter} onValueChange={setReportTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  <SelectItem value="Horas Trabajadas">Horas Trabajadas</SelectItem>
                  <SelectItem value="Horas Extras">Horas Extras</SelectItem>
                  <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
                  <SelectItem value="Combustible">Combustible</SelectItem>
                  <SelectItem value="Novedades">Novedades</SelectItem>
                  <SelectItem value="Viajes">Viajes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="space-y-2">
              <Label>Fecha Inicial</Label>
              {startDate ? (
                <DatePicker date={startDate} setDate={setStartDate} />
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal text-muted-foreground"
                  onClick={() => setStartDate(new Date())}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Seleccionar fecha inicial</span>
                </Button>
              )}
            </div>
            <div className="space-y-2">
              <Label>Fecha Final</Label>
              {endDate ? (
                <DatePicker date={endDate} setDate={setEndDate} />
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal text-muted-foreground"
                  onClick={() => setEndDate(new Date())}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Seleccionar fecha final</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={clearFilters}>
              Limpiar Filtros
            </Button>
            <Button onClick={handleExportCSV} disabled={filteredReports.length === 0}>
              Exportar a CSV
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Reportes</CardTitle>
          <CardDescription>
            {filteredReports.length} reportes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReports.length > 0 ? (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Trabajador</TableHead>
                    <TableHead>Máquina</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Fecha del Reporte</TableHead>
                    <TableHead>Fecha de Creación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.userName}</TableCell>
                      <TableCell>{report.machineName}</TableCell>
                      <TableCell>{report.reportType}</TableCell>
                      <TableCell className="max-w-xs truncate" title={report.description}>
                        {report.description}
                      </TableCell>
                      <TableCell>
                        {format(report.reportDate, 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        {format(report.createdAt, 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No se encontraron reportes</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
