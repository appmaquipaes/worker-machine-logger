
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface ReportFormActionsProps {
  isSubmitting: boolean;
}

const ReportFormActions: React.FC<ReportFormActionsProps> = ({ isSubmitting }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-slate-200">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-3 text-base py-6 px-8 rounded-xl border-2 hover:border-slate-400 transition-all duration-300 hover:shadow-lg group"
        disabled={isSubmitting}
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Volver al Menú</span>
      </Button>
      
      <Button 
        type="submit"
        className="flex items-center gap-3 text-base py-6 px-10 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <AlertCircle size={20} className="animate-spin" />
            <span className="font-medium">Registrando...</span>
          </>
        ) : (
          <>
            <Send size={20} className="group-hover:translate-x-1 transition-transform" />
            <span className="font-medium">Registrar Reporte</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ReportFormActions;
