
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Sparkles } from 'lucide-react';
import { ReportType } from '@/types/report';

interface ReportSuccessAlertProps {
  isVisible: boolean;
  reportType: ReportType;
}

const ReportSuccessAlert: React.FC<ReportSuccessAlertProps> = ({ 
  isVisible, 
  reportType 
}) => {
  if (!isVisible) return null;

  return (
    <Alert className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
        </div>
        <div className="flex-1 space-y-1">
          <AlertTitle className="text-xl font-bold text-green-800 flex items-center gap-2">
            ¡REGISTRO EXITOSO!
            <Sparkles className="w-5 h-5 text-amber-500" />
          </AlertTitle>
          <AlertDescription className="text-base text-green-700 leading-relaxed">
            Su reporte de <strong className="text-green-800">{reportType}</strong> ha sido registrado correctamente en el sistema.
            <br />
            <span className="text-green-600">Puede continuar registrando más reportes o volver al menú principal.</span>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default ReportSuccessAlert;
