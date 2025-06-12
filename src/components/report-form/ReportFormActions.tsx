
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';

interface ReportFormActionsProps {
  isSubmitting: boolean;
}

const ReportFormActions: React.FC<ReportFormActionsProps> = ({ isSubmitting }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-lg py-6 px-6"
        disabled={isSubmitting}
      >
        <ArrowLeft size={24} />
        Volver al Menú
      </Button>
      
      <Button 
        type="submit"
        className="flex items-center gap-2 text-lg py-6 px-8 bg-green-600 hover:bg-green-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <AlertCircle size={24} className="animate-spin" />
            Registrando...
          </>
        ) : (
          <>
            <Send size={24} />
            Registrar Reporte
          </>
        )}
      </Button>
    </div>
  );
};

export default ReportFormActions;
