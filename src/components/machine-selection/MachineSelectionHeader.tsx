
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const MachineSelectionHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-8 mb-12">
      {/* Header principal con gradiente */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-3xl blur-xl"></div>
        <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-8 shadow-xl">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4">
            Selección de Máquinas
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Elige la máquina con la que vas a trabajar hoy
          </p>
        </div>
      </div>
      
      {/* Botón de regreso mejorado */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard')}
        className="inline-flex items-center gap-3 text-lg px-8 py-4 bg-white/80 backdrop-blur-sm border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl"
      >
        <ArrowLeft size={24} className="transition-transform group-hover:-translate-x-1" />
        Volver al inicio
      </Button>
    </div>
  );
};

export default MachineSelectionHeader;
