
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Machine } from '@/context/MachineContext';
import { ReportType } from '@/types/report';
import { Info, Truck, Settings, CheckCircle, Sparkles } from 'lucide-react';
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
    <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden animate-fade-in">
      {/* Header con gradiente */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <CardHeader className="relative pb-4">
          <CardTitle className="flex items-center gap-3 text-white text-xl font-bold">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Info size={20} className="text-white" />
            </div>
            <div>
              <span>Instrucciones para el Operador</span>
              <div className="flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span className="text-blue-200 text-sm font-normal">Guía paso a paso</span>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-blue-100 text-base mt-2">
            {getMachineTypeLabel(machine)}: <span className="font-semibold text-white">{machine.type} {machine.name}</span>
            {machine.plate && <span className="ml-2 text-blue-200">({machine.plate})</span>}
          </CardDescription>
        </CardHeader>
      </div>

      <CardContent className="p-6 space-y-6">
        {/* Alert Principal */}
        <Alert className="border-2 border-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              {isTransportVehicle ? <Truck size={16} className="text-white" /> : <Settings size={16} className="text-white" />}
            </div>
            <span className="font-bold text-blue-800 text-lg">Tipo de Reporte: {reportType}</span>
          </div>
          <AlertDescription className="text-blue-700 text-base leading-relaxed">
            {getReportTypeDescription(machine, reportType)}
          </AlertDescription>
        </Alert>
        
        {/* Instrucciones Específicas */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            Pasos a seguir:
          </h4>
          <ul className="space-y-3">
            {getSpecificInstructions().map((instruction, index) => (
              <li 
                key={index} 
                className="flex items-start gap-3 text-slate-700 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 hover:shadow-md group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'both'
                }}
              >
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <span className="text-sm leading-relaxed group-hover:text-slate-800 transition-colors">
                  {instruction}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Nota Final */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-sm">
              💡 Recuerda: La precisión en los datos garantiza reportes confiables y una mejor gestión operativa.
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OperatorInstructions;
