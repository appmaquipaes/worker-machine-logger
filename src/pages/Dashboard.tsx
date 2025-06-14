
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Wrench, 
  BarChart3, 
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { clearSelectedMachine } = useMachine();
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar la máquina seleccionada al entrar al dashboard
    clearSelectedMachine();
  }, [clearSelectedMachine]);

  // Redirigir si no hay un usuario autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-amber-50/20">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative container mx-auto py-16 px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span className="text-white/90 text-sm font-medium">Sistema de Gestión Empresarial</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¡Bienvenido, <span className="text-amber-300">{user.name}</span>!
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Gestiona tu operación con eficiencia y control total
          </p>
        </div>
      </div>

      {/* Main Actions Grid */}
      <div className="container mx-auto py-12 px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Seleccionar Máquina Card */}
          <Card className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <Button
              variant="ghost"
              onClick={() => navigate('/machines')}
              className="w-full h-auto p-8 flex flex-col items-center gap-6 relative z-10 hover:bg-transparent"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Wrench size={40} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                  Seleccionar Máquina
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-sm">
                  Elige la máquina con la que trabajarás hoy y comienza tu jornada
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber-600 font-semibold group-hover:gap-4 transition-all">
                <span>Comenzar</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </Card>

          {/* Informes Card */}
          <Card className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <Button
              variant="ghost"
              onClick={() => navigate('/informes')}
              className="w-full h-auto p-8 flex flex-col items-center gap-6 relative z-10 hover:bg-transparent"
            >
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <FileText size={40} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition-colors">
                  Informes
                </h3>
                <p className="text-slate-600 leading-relaxed max-w-sm">
                  Genera reportes detallados y analiza el rendimiento de tu operación
                </p>
              </div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-4 transition-all">
                <span>Ver reportes</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Button>
          </Card>

          {/* Panel Admin Card - Solo visible para administradores */}
          {user.role === 'Administrador' && (
            <Card className="group relative overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="w-full h-auto p-8 flex flex-col items-center gap-6 relative z-10 hover:bg-transparent"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <BarChart3 size={40} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    Panel Admin
                  </h3>
                  <p className="text-slate-600 leading-relaxed max-w-sm">
                    Controla y gestiona todos los aspectos del sistema empresarial
                  </p>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 font-semibold group-hover:gap-4 transition-all">
                  <span>Administrar</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Button>
            </Card>
          )}
        </div>

        {/* Stats Bar */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-800">24/7</div>
              <div className="text-sm text-slate-600">Disponibilidad</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-800">100%</div>
              <div className="text-sm text-slate-600">Confiable</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-800">+50</div>
              <div className="text-sm text-slate-600">Máquinas</div>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-800">∞</div>
              <div className="text-sm text-slate-600">Posibilidades</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
