
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MachineSelectionHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold">Selección de Máquinas</h1>
      <p className="text-xl mt-4 mb-8">
        Toca la máquina con la que vas a trabajar hoy
      </p>
      
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-lg mb-8"
      >
        <ArrowLeft size={24} />
        Volver al inicio
      </Button>
    </div>
  );
};

export default MachineSelectionHeader;
