
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';
import { ReportType } from '@/context/ReportContext';

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
    <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
      <CheckCircle className="h-6 w-6 text-green-600" />
      <AlertTitle className="text-xl font-bold">¡REGISTRO EXITOSO!</AlertTitle>
      <AlertDescription className="text-lg">
        Su reporte de <strong>{reportType}</strong> ha sido registrado correctamente en el sistema.
        Puede continuar registrando más reportes o volver al menú principal.
      </AlertDescription>
    </Alert>
  );
};

export default ReportSuccessAlert;
