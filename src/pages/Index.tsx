import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { User, Wrench, ClipboardList } from 'lucide-react';
import { createInitialAdminUser } from '@/utils/initialSetup';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Crear usuario administrador al cargar la página inicial
  React.useEffect(() => {
    createInitialAdminUser();
  }, []);

  // Si el usuario ya está autenticado, redirigir al dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-gradient-to-b from-primary/10 to-background">
      {/* Hero Section con logo grande y bienvenida */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Maquipaes <span className="text-primary">SAS</span>
        </h1>
        <p className="text-xl max-w-2xl mb-10 px-4">
          Sistema de control de trabajadores y maquinaria
        </p>
        
        {/* Instrucciones gráficas de 3 pasos */}
        <div className="w-full max-w-4xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Cómo usar esta aplicación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <User size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Inicia Sesión</h3>
              <p>Ingresa con tu usuario y contraseña para comenzar</p>
            </Card>
            
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Wrench size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Selecciona Máquina</h3>
              <p>Elige la máquina con la que vas a trabajar hoy</p>
            </Card>
            
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <ClipboardList size={40} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Envía Reportes</h3>
              <p>Registra horas, viajes u otros reportes</p>
            </Card>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={() => navigate('/login')} className="text-lg py-6 px-8">
            Iniciar Sesión
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/register')} className="text-lg py-6 px-8">
            Crear Cuenta
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
