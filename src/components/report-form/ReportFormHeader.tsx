
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Machine } from '@/context/MachineContext';

interface ReportFormHeaderProps {
  selectedMachine: Machine;
}

const ReportFormHeader: React.FC<ReportFormHeaderProps> = ({ selectedMachine }) => {
  const navigate = useNavigate();

  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold">Enviar Reporte</h1>
      <p className="text-xl mt-2">
        Máquina: <span className="font-bold">{selectedMachine.name}</span>
        {selectedMachine.plate && (
          <span className="ml-2">({selectedMachine.plate})</span>
        )}
      </p>
      
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-lg mt-4 mx-auto"
      >
        <ArrowLeft size={24} />
        Volver al inicio
      </Button>
    </div>
  );
};

export default ReportFormHeader;
