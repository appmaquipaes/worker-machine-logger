
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, MapPin } from 'lucide-react';
import FilterSection from './filters/FilterSection';
import DateRangeFilters from './filters/DateRangeFilters';
import ActionButtons from './filters/ActionButtons';

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
  const operatorOptions = [
    { value: 'all', label: 'Todos los operadores' },
    ...operators.map(operator => ({
      value: operator.id,
      label: operator.name
    }))
  ];

  const machineOptions = [
    { value: 'all', label: 'Todas las máquinas' },
    ...machines.map(machine => ({
      value: machine.id,
      label: `${machine.name} (${machine.type})`
    }))
  ];

  const reportTypeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'Horas Trabajadas', label: 'Horas Trabajadas' },
    { value: 'Horas Extras', label: 'Horas Extras' },
    { value: 'Viajes', label: 'Viajes' },
    { value: 'Mantenimiento', label: 'Mantenimiento' },
    { value: 'Combustible', label: 'Combustible' },
    { value: 'Novedades', label: 'Novedades' }
  ];

  const clienteOptions = [
    { value: 'all', label: 'Todos los clientes' },
    ...clientes.map(cliente => ({
      value: cliente.nombre_cliente,
      label: cliente.nombre_cliente
    }))
  ];

  const fincaOptions = [
    { 
      value: 'all', 
      label: selectedCliente === 'all' 
        ? "Primero seleccione un cliente" 
        : fincas.length === 0 
          ? "El cliente no tiene fincas"
          : "Todas las fincas",
      disabled: selectedCliente === 'all' || fincas.length === 0
    },
    ...fincas.map(finca => ({
      value: finca.nombre_finca,
      label: `${finca.nombre_finca} - ${finca.ciudad}`
    }))
  ];

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
          <FilterSection
            label="Operador"
            value={selectedOperator}
            onValueChange={setSelectedOperator}
            placeholder="Todos los operadores"
            options={operatorOptions}
          />

          <FilterSection
            label="Máquina"
            value={selectedMachine}
            onValueChange={setSelectedMachine}
            placeholder="Todas las máquinas"
            options={machineOptions}
          />

          <FilterSection
            label="Tipo de Reporte"
            value={selectedReportType}
            onValueChange={setSelectedReportType}
            placeholder="Todos los tipos"
            options={reportTypeOptions}
          />

          <FilterSection
            label="Cliente"
            value={selectedCliente}
            onValueChange={setSelectedCliente}
            placeholder="Todos los clientes"
            options={clienteOptions}
            icon={<Users size={16} />}
          />

          <FilterSection
            label="Finca"
            value={selectedFinca}
            onValueChange={setSelectedFinca}
            placeholder={fincaOptions[0].label}
            options={fincaOptions}
            icon={<MapPin size={16} />}
            disabled={selectedCliente === 'all' || fincas.length === 0}
          />

          <DateRangeFilters
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
          />
        </div>

        <ActionButtons
          generateReport={generateReport}
          exportToExcel={exportToExcel}
          reportDataLength={reportDataLength}
        />
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
