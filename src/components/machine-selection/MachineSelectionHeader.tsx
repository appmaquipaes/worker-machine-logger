
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Truck, Sparkles } from 'lucide-react';

const MachineSelectionHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl mb-12 shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="relative px-8 py-12">
        <div className="flex justify-between items-start mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Volver al Dashboard</span>
          </Button>
          
          <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-amber-100 text-sm font-medium">Selección de Maquinaria</span>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <Truck className="w-10 h-10 text-amber-300" />
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Selecciona tu <span className="text-amber-300">Máquina</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Elige la máquina o vehículo con el que trabajarás hoy. Cada selección te llevará directamente 
              al formulario de reporte personalizado para ese equipo.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white/90 text-sm">🚛 Vehículos de Transporte</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white/90 text-sm">🏗️ Maquinaria Pesada</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white/90 text-sm">⚡ Equipos Especializados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineSelectionHeader;
