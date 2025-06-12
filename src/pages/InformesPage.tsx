
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useInformesPage } from '@/hooks/useInformesPage';
import ReportFilters from '@/components/informes/ReportFilters';
import ReportStatistics from '@/components/informes/ReportStatistics';
import ReportDataTable from '@/components/informes/ReportDataTable';

const InformesPage: React.FC = () => {
  const navigate = useNavigate();
  const {
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
  } = useInformesPage();

  if (!user) {
    navigate('/login');
    return null;
  }

  const stats = getStatistics();

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
        <ReportFilters
          operators={operators}
          machines={machines}
          clientes={clientes}
          fincas={fincas}
          selectedOperator={selectedOperator}
          setSelectedOperator={setSelectedOperator}
          selectedMachine={selectedMachine}
          setSelectedMachine={setSelectedMachine}
          selectedReportType={selectedReportType}
          setSelectedReportType={setSelectedReportType}
          selectedCliente={selectedCliente}
          setSelectedCliente={setSelectedCliente}
          selectedFinca={selectedFinca}
          setSelectedFinca={setSelectedFinca}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          generateReport={generateReport}
          exportToExcel={exportToExcel}
          reportDataLength={reportData.length}
        />

        {/* Estadísticas */}
        <ReportStatistics stats={stats} />

        {/* Tabla de datos */}
        <ReportDataTable
          reportData={reportData}
          extractClienteFromDestination={extractClienteFromDestination}
          extractFincaFromDestination={extractFincaFromDestination}
        />
      </div>
    </div>
  );
};

export default InformesPage;
