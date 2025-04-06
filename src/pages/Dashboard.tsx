
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Wrench, ChevronRight, BarChart3 } from 'lucide-react';

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
      <h1 className="text-3xl font-bold mb-8">
        ¡Bienvenido, {user.name}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tarjeta para seleccionar máquina */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Seleccionar Máquina</CardTitle>
            <CardDescription>
              Elige la máquina con la que trabajarás hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              onClick={() => navigate('/machines')}
              className="w-full"
            >
              Ver Máquinas
            </Button>
          </CardContent>
        </Card>

        {/* Tarjeta para reportes */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Enviar Reportes</CardTitle>
            <CardDescription>
              Registra horas, mantenimientos y otras actividades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="default"
              onClick={() => navigate('/reports')}
              className="w-full"
            >
              Ir a Reportes
            </Button>
          </CardContent>
        </Card>

        {/* Tarjetas para administración (solo visible para administradores) */}
        {user.role === 'Administrador' && (
          <>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Panel de Administración</CardTitle>
                <CardDescription>
                  Visualiza y gestiona todos los reportes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="default"
                  onClick={() => navigate('/admin')}
                  className="w-full"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Panel Admin
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Gestión de Máquinas</CardTitle>
                <CardDescription>
                  Añadir o eliminar máquinas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="default"
                  onClick={() => navigate('/admin/machines')}
                  className="w-full"
                >
                  <Wrench className="mr-2 h-4 w-4" />
                  Gestionar Máquinas
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Administrar trabajadores y administradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="default"
                  onClick={() => navigate('/admin/users')}
                  className="w-full"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Gestionar Usuarios
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
