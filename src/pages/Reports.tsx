
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useReport, Report, ReportType } from "@/context/ReportContext";
import { useMachine } from "@/context/MachineContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, FileSpreadsheet, Filter, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/DatePicker";
import * as XLSX from 'xlsx';
import { toast } from "sonner";

const Reports = () => {
  const { user } = useAuth();
  const { reports, getFilteredReports } = useReport();
  const { machines } = useMachine();
  const navigate = useNavigate();
  
  // State for filters
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);
  const [filterUserId, setFilterUserId] = useState<string>("");
  const [filterMachineId, setFilterMachineId] = useState<string>("");
  const [filterReportType, setFilterReportType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  // Get unique users from reports
  const uniqueUsers = Array.from(new Set(reports.map((report) => report.userId)))
    .map((userId) => {
      const report = reports.find((r) => r.userId === userId);
      return {
        id: userId,
        name: report?.userName || userId,
      };
    });

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role !== 'Administrador') {
      navigate("/dashboard");
      toast.error("Solo los administradores pueden ver los reportes");
    }
  }, [user, navigate]);

  // Apply filters when they change
  useEffect(() => {
    const filtered = getFilteredReports({
      userId: filterUserId || undefined,
      machineId: filterMachineId || undefined,
      reportType: filterReportType as ReportType || undefined,
      startDate: startDate,
      endDate: endDate,
    });
    setFilteredReports(filtered);
  }, [filterUserId, filterMachineId, filterReportType, startDate, endDate, reports, getFilteredReports]);

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Export to Excel function
  const exportToExcel = () => {
    // Create worksheet from JSON
    const worksheet = XLSX.utils.json_to_sheet(
      filteredReports.map((report) => ({
        "Usuario": report.userName,
        "Máquina": report.machineName,
        "Tipo de Reporte": report.reportType,
        "Descripción": report.description,
        "Fecha": formatDate(report.reportDate.toString()),
        "Viajes": report.trips || "",
        "Horas": report.hours || "",
        "Valor": report.value ? `$${report.value.toLocaleString()}` : "",
        "Sitio": report.workSite || "",
        "Origen": report.origin || "",
        "Destino": report.destination || "",
        "Cantidad (m³)": report.cantidadM3 || "",
      }))
    );

    // Auto-fit columns
    const maxWidths: { [key: string]: number } = {};
    const header = Object.keys(filteredReports[0] || {});

    // Create workbook and download
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reportes");
    
    // Generate filename with current date
    const now = new Date();
    const filename = `Reportes_Maquipaes_${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.xlsx`;
    
    XLSX.writeFile(workbook, filename);
    toast.success("Reportes exportados correctamente");
  };

  // Reset filters
  const resetFilters = () => {
    setFilterUserId("");
    setFilterMachineId("");
    setFilterReportType("");
    setStartDate(undefined);
    setEndDate(undefined);
    setFilteredReports(reports);
  };

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Reportes</h1>
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="gap-2">
            <ArrowLeft size={16} />
            Volver al Dashboard
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Filter size={18} />
              Filtros de Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* User filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-user">Usuario</Label>
                <Select value={filterUserId} onValueChange={setFilterUserId}>
                  <SelectTrigger id="filter-user">
                    <SelectValue placeholder="Todos los usuarios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los usuarios</SelectItem>
                    {uniqueUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Machine filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-machine">Máquina</Label>
                <Select value={filterMachineId} onValueChange={setFilterMachineId}>
                  <SelectTrigger id="filter-machine">
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

              {/* Report type filter */}
              <div className="space-y-2">
                <Label htmlFor="filter-type">Tipo de Reporte</Label>
                <Select value={filterReportType} onValueChange={setFilterReportType}>
                  <SelectTrigger id="filter-type">
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

              {/* Date filter */}
              <div className="space-y-2">
                <Label>Fecha Desde</Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>

              <div className="space-y-2">
                <Label>Fecha Hasta</Label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="flex items-center gap-2"
              >
                <RefreshCw size={18} />
                Resetear Filtros
              </Button>

              <Button 
                variant="default" 
                onClick={exportToExcel}
                className="flex items-center gap-2"
              >
                <FileSpreadsheet size={18} />
                Exportar a Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredReports.length} {filteredReports.length === 1 ? 'reporte' : 'reportes'} 
          {filterUserId || filterMachineId || filterReportType || startDate || endDate ? ' con los filtros aplicados' : ''}
        </div>

        <div className="grid gap-6">
          {filteredReports.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No hay reportes disponibles con los filtros seleccionados.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredReports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">
                      {report.machineName} - {report.reportType}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(report.reportDate.toString())}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <p>{report.description}</p>
                    
                    {/* Conditional rendering based on report type */}
                    {report.trips && (
                      <p>
                        <span className="font-semibold">Viajes:</span> {report.trips}
                      </p>
                    )}
                    {report.hours && (
                      <p>
                        <span className="font-semibold">Horas:</span> {report.hours}
                      </p>
                    )}
                    {report.value && (
                      <p>
                        <span className="font-semibold">Valor:</span> ${report.value.toLocaleString()}
                      </p>
                    )}
                    {report.workSite && (
                      <p>
                        <span className="font-semibold">Sitio:</span> {report.workSite}
                      </p>
                    )}
                    {report.origin && (
                      <p>
                        <span className="font-semibold">Origen:</span> {report.origin}
                      </p>
                    )}
                    {report.destination && (
                      <p>
                        <span className="font-semibold">Destino:</span> {report.destination}
                      </p>
                    )}
                    {report.cantidadM3 && (
                      <p>
                        <span className="font-semibold">Cantidad:</span> {report.cantidadM3} m³
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Reportado por: {report.userName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
