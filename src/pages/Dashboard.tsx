
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Wrench, 
  ClipboardList, 
  BarChart3, 
  ArrowRight
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        ¡Bienvenido, {user.name}!
      </h1>
      <p className="text-xl text-center mb-8">¿Qué deseas hacer hoy?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta para seleccionar máquina */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <Button
            variant="ghost"
            onClick={() => navigate('/machines')}
            className="w-full h-auto flex flex-col items-center gap-4 py-8"
          >
            <div className="bg-primary/20 w-24 h-24 rounded-full flex items-center justify-center">
              <Wrench size={56} className="text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Seleccionar Máquina</h3>
              <p className="text-muted-foreground">
                Elige la máquina con la que trabajarás hoy
              </p>
            </div>
            <ArrowRight size={24} className="mt-2" />
          </Button>
        </Card>

        {/* Tarjeta para reportes */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <Button
            variant="ghost"
            onClick={() => navigate('/reports')}
            className="w-full h-auto flex flex-col items-center gap-4 py-8"
          >
            <div className="bg-primary/20 w-24 h-24 rounded-full flex items-center justify-center">
              <ClipboardList size={56} className="text-primary" />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">Enviar Reportes</h3>
              <p className="text-muted-foreground">
                Registra horas, mantenimientos y otras actividades
              </p>
            </div>
            <ArrowRight size={24} className="mt-2" />
          </Button>
        </Card>

        {/* Tarjeta para panel admin (solo visible para administradores) */}
        {user.role === 'Administrador' && (
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="w-full h-auto flex flex-col items-center gap-4 py-8"
            >
              <div className="bg-primary/20 w-24 h-24 rounded-full flex items-center justify-center">
                <BarChart3 size={56} className="text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Panel Admin</h3>
                <p className="text-muted-foreground">
                  Visualiza y gestiona todos los reportes
                </p>
              </div>
              <ArrowRight size={24} className="mt-2" />
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
