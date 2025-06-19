
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine, Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { ArrowLeft, Settings, Wrench } from 'lucide-react';
import MachineForm from '@/components/MachineForm';
import MachineTable from '@/components/MachineTable';

const MachineManagement: React.FC = () => {
  const { user } = useAuth();
  const { machines, deleteMachine, addMachine } = useMachine();
  const navigate = useNavigate();

  // Redirigir si no hay un usuario o no es administrador
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleAddMachine = (newMachine: Omit<Machine, 'id'>) => {
    addMachine(newMachine);
  };

  const handleDeleteMachine = (id: string) => {
    deleteMachine(id);
  };

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header with improved visual design */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl mb-12 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="relative px-8 py-12">
            <div className="flex justify-between items-start mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Volver al panel admin</span>
              </Button>
              
              <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Settings className="w-4 h-4 text-amber-300" />
                <span className="text-amber-100 text-sm font-medium">Administración</span>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                <Wrench className="w-10 h-10 text-amber-300" />
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Gestión de <span className="text-amber-300">Máquinas</span>
                </h1>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Administra el inventario completo de maquinaria pesada y vehículos de la empresa. 
                  Añade nuevos equipos o gestiona los existentes en el sistema.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">🚛 Gestión de Flota</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">🏗️ Control de Inventario</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">⚡ Estado en Tiempo Real</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <MachineForm onMachineCreated={handleAddMachine} />
        <MachineTable machines={machines} onDeleteMachine={handleDeleteMachine} />
      </div>
    </div>
  );
};

export default MachineManagement;
