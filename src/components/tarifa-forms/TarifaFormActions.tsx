
import React from 'react';
import { Button } from '@/components/ui/button';

interface TarifaFormActionsProps {
  isEditing: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

const TarifaFormActions: React.FC<TarifaFormActionsProps> = ({
  isEditing,
  onSubmit,
  onCancel
}) => {
  return (
    <div className="flex justify-end space-x-4 pt-6 border-t-2 border-slate-100">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 hover:border-slate-400 rounded-xl"
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSubmit}
        className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isEditing ? 'Actualizar Tarifa' : 'Crear Tarifa'}
      </Button>
    </div>
  );
};

export default TarifaFormActions;
