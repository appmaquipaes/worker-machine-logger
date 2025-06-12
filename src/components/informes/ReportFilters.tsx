
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Users, MapPin } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';

interface ReportFiltersProps {
  operators: any[];
  machines: any[];
  clientes: any[];
  fincas: any[];
  selectedOperator: string;
  setSelectedOperator: (value: string) => void;
  selectedMachine: string;
  setSelectedMachine: (value: string) => void;
  selectedReportType: string;
  setSelectedReportType: (value: string) => void;
  selectedCliente: string;
  setSelectedCliente: (value: string) => void;
  selectedFinca: string;
  setSelectedFinca: (value: string) => void;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate: Date;
  setEndDate: (date: Date) => void;
  generateReport: () => void;
  exportToExcel: () => void;
  reportDataLength: number;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  operators,
  machines,
  clientes,
  fincas,
  selectedOperator,
  setSelectedOperator,
  selectedMachine,
  setSelectedMachine,
  selectedReportType,
  setSelectedReportType,
  selectedCliente,
  setSelectedCliente,
  selectedFinca,
  setSelectedFinca,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  generateReport,
  exportToExcel,
  reportDataLength
}) => {
  return (
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
          {reportDataLength > 0 && (
            <Button onClick={exportToExcel} className="btn-secondary-large">
              <Download className="mobile-icon" />
              Exportar Excel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
