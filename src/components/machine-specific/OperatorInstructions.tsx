
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';
import { Info, Truck, Settings } from 'lucide-react';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';

interface OperatorInstructionsProps {
  machine: Machine;
  reportType: ReportType;
}

const OperatorInstructions: React.FC<OperatorInstructionsProps> = ({
  machine,
  reportType
}) => {
  const { getReportTypeDescription, getMachineTypeLabel } = useMachineSpecificReports();
  
  const isTransportVehicle = ['Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula'].includes(machine.type);

  const getSpecificInstructions = (): string[] => {
    switch (reportType) {
      case 'Horas Trabajadas':
        return isTransportVehicle 
          ? [
              'Registra las horas exactas de operación del vehículo',
              'Incluye el cliente/sitio donde se realizó el transporte',
              'Las horas deben corresponder al tiempo real de trabajo'
            ]
          : [
              'Registra las horas exactas de operación de la máquina',
              'Incluye el cliente/sitio donde se realizó el trabajo',
              'No incluyas tiempos de descanso o paradas prolongadas'
            ];
      
      case 'Viajes':
        return [
          'Especifica claramente el origen (proveedor) del material',
          'Indica el cliente y finca de destino',
          'Registra la cantidad exacta de m³ transportados',
          'Selecciona el tipo de material correcto'
        ];
      
      case 'Combustible':
        return [
          'Registra el valor exacto del combustible cargado',
          'Anota el kilometraje actual del odómetro',
          'Asegúrate de que los datos coincidan con el recibo'
        ];
      
      case 'Mantenimiento':
        return [
          'Especifica el proveedor que realizó el servicio',
          'Registra el valor total del mantenimiento',
          'Incluye detalles importantes en observaciones si es necesario'
        ];
      
      case 'Novedades':
        return [
          'Describe claramente la situación o incidente',
          'Incluye todos los detalles relevantes',
          'Especifica si requiere seguimiento o acción inmediata'
        ];
      
      default:
        return ['Completa todos los campos requeridos', 'Verifica la información antes de enviar'];
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Info size={20} />
          Instrucciones para el Operador
        </CardTitle>
        <CardDescription className="text-blue-600">
          {getMachineTypeLabel(machine)}: {machine.type} {machine.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 border-blue-300 bg-blue-100">
          <div className="flex items-center gap-2 mb-2">
            {isTransportVehicle ? <Truck size={16} /> : <Settings size={16} />}
            <span className="font-semibold text-blue-800">Tipo de Reporte: {reportType}</span>
          </div>
          <AlertDescription className="text-blue-700">
            {getReportTypeDescription(machine, reportType)}
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <h4 className="font-semibold text-blue-800 mb-3">Instrucciones específicas:</h4>
          <ul className="space-y-2">
            {getSpecificInstructions().map((instruction, index) => (
              <li key={index} className="flex items-start gap-2 text-blue-700">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-sm">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperatorInstructions;
