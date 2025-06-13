
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReportTypeSelector from '@/components/ReportTypeSelector';
import ReportInputFields from '@/components/ReportInputFields';
import ReportFormHeader from '@/components/report-form/ReportFormHeader';
import ReportSuccessAlert from '@/components/report-form/ReportSuccessAlert';
import ReportFormActions from '@/components/report-form/ReportFormActions';
import OperatorInstructions from '@/components/machine-specific/OperatorInstructions';
import { useReportForm } from '@/hooks/useReportForm';

const ReportForm = () => {
  const {
    // State
    reportType, setReportType,
    description, setDescription,
    trips, setTrips,
    hours, setHours,
    value, setValue,
    reportDate, setReportDate,
    workSite, setWorkSite,
    origin, setOrigin,
    selectedCliente, setSelectedCliente,
    selectedFinca, setSelectedFinca,
    maintenanceValue, setMaintenanceValue,
    cantidadM3, setCantidadM3,
    proveedor, setProveedor,
    kilometraje, setKilometraje,
    tipoMateria, setTipoMateria,
    isSubmitting,
    lastSubmitSuccess,
    
    // Data
    proveedores,
    tiposMaterial,
    inventarioAcopio,
    
    // Handlers
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination,
    handleSubmit,
    
    // Computed
    user,
    selectedMachine
  } = useReportForm();
  
  if (!user || !selectedMachine) return null;
  
  return (
    <div className="container max-w-xl mx-auto py-8 px-4">
      <ReportFormHeader selectedMachine={selectedMachine} />

      <ReportSuccessAlert 
        isVisible={lastSubmitSuccess} 
        reportType={reportType} 
      />
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <ReportTypeSelector 
              reportType={reportType}
              onReportTypeChange={setReportType}
              selectedMachine={selectedMachine}
            />
            
            {/* Mostrar instrucciones específicas para el operador */}
            {reportType && (
              <OperatorInstructions 
                machine={selectedMachine}
                reportType={reportType}
              />
            )}
            
            <ReportInputFields
              reportType={reportType}
              reportDate={reportDate}
              setReportDate={setReportDate}
              description={description}
              setDescription={setDescription}
              trips={trips}
              setTrips={setTrips}
              hours={hours}
              setHours={setHours}
              value={value}
              setValue={setValue}
              workSite={workSite}
              setWorkSite={setWorkSite}
              origin={origin}
              setOrigin={setOrigin}
              selectedCliente={selectedCliente}
              setSelectedCliente={setSelectedCliente}
              selectedFinca={selectedFinca}
              setSelectedFinca={setSelectedFinca}
              maintenanceValue={maintenanceValue}
              setMaintenanceValue={setMaintenanceValue}
              cantidadM3={cantidadM3}
              setCantidadM3={setCantidadM3}
              proveedor={proveedor}
              setProveedor={setProveedor}
              kilometraje={kilometraje}
              setKilometraje={setKilometraje}
              tipoMateria={tipoMateria}
              setTipoMateria={setTipoMateria}
              proveedores={proveedores}
              tiposMaterial={tiposMaterial}
              inventarioAcopio={inventarioAcopio}
              onClienteChangeForWorkSite={handleClienteChangeForWorkSite}
              onClienteChangeForDestination={handleClienteChangeForDestination}
              onFincaChangeForDestination={handleFincaChangeForDestination}
            />
            
            <ReportFormActions isSubmitting={isSubmitting} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportForm;
