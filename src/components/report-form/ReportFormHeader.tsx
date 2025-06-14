
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings, FileText, Sparkles } from 'lucide-react';
import { Machine } from '@/context/MachineContext';

interface ReportFormHeaderProps {
  selectedMachine: Machine;
}

const ReportFormHeader: React.FC<ReportFormHeaderProps> = ({ selectedMachine }) => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl mb-8 shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative px-6 py-10">
        <div className="flex justify-between items-start mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Dashboard</span>
          </Button>
          
          <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-amber-100 text-sm font-medium">Registro de Actividades</span>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-amber-300" />
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Nuevo <span className="text-amber-300">Reporte</span>
            </h1>
            <div className="space-y-2">
              <p className="text-xl text-blue-100 font-medium">
                {selectedMachine.name}
                {selectedMachine.plate && (
                  <span className="ml-2 text-white/80">({selectedMachine.plate})</span>
                )}
              </p>
              <p className="text-blue-200 text-sm">
                {selectedMachine.type} • Registra la actividad realizada
              </p>
            </div>
          </div>

          {/* Machine Type Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
            <Settings className="w-4 h-4 text-white/80" />
            <span className="text-white/90 text-sm font-medium">{selectedMachine.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFormHeader;
