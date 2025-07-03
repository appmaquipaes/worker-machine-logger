
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReportTypeSelector from '@/components/ReportTypeSelector';
import ReportInputFields from '@/components/ReportInputFields';
import ReportFormHeader from '@/components/report-form/ReportFormHeader';
import ReportSuccessAlert from '@/components/report-form/ReportSuccessAlert';
import ReportFormActions from '@/components/report-form/ReportFormActions';
import OperatorInstructions from '@/components/machine-specific/OperatorInstructions';
import { useReportForm } from '@/hooks/useReportForm';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';

const ReportForm = () => {
  const { user } = useAuth();
  const { selectedMachine } = useMachine();
  
  const {
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
    showSuccess,
    isSubmitting,
    handleSubmit
  } = useReportForm();
  
  if (!user || !selectedMachine) return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23e2e8f0%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
      
      <div className="relative container max-w-4xl mx-auto py-8 px-4">
        <ReportFormHeader selectedMachine={selectedMachine} />

        <ReportSuccessAlert 
          isVisible={showSuccess} 
          reportType={reportType} 
        />
        
        <Card className="shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
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
                proveedores={[]}
                tiposMaterial={[]}
                inventarioAcopio={[]}
                onClienteChangeForWorkSite={() => {}}
                onProveedorChange={() => {}}
              />
              
              <ReportFormActions isSubmitting={isSubmitting} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportForm;
