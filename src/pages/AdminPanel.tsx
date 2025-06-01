
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Truck, User, Building, Database, MapPin, Users } from 'lucide-react';

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const AdminOptions = [
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar operadores y sus permisos en el sistema',
      icon: <User className="h-8 w-8" />,
      path: '/admin/users'
    },
    {
      title: 'Gestión de Máquinas',
      description: 'Administrar máquinas, volquetas y equipos',
      icon: <Building className="h-8 w-8" />,
      path: '/admin/machines'
    },
    {
      title: 'Administrar Volquetas',
      description: 'Configurar materiales y tarifas para volquetas',
      icon: <Truck className="h-8 w-8" />,
      path: '/admin/volquetas'
    },
    {
      title: 'Proveedores',
      description: 'Administrar proveedores de material',
      icon: <MapPin className="h-8 w-8" />,
      path: '/admin/proveedores'
    },
    {
      title: 'Clientes',
      description: 'Gestionar clientes que reciben materiales',
      icon: <Users className="h-8 w-8" />,
      path: '/admin/clientes'
    },
    {
      title: 'Compras',
      description: 'Registrar y gestionar compras de materiales y servicios',
      icon: <Database className="h-8 w-8" />,
      path: '/admin/compras'
    },
    {
      title: 'Inventario Acopio',
      description: 'Ver y gestionar el inventario actual del acopio',
      icon: <Database className="h-8 w-8" />,
      path: '/admin/inventario'
    },
  ];

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver al dashboard
          </Button>
        </div>
        <p className="text-muted-foreground">
          Bienvenido, {user?.name}. Gestiona todos los aspectos del sistema desde aquí.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AdminOptions.map((option, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="bg-primary/10 p-4 flex justify-center">
              {option.icon}
            </div>
            <CardHeader>
              <CardTitle>{option.title}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button
                variant="default"
                className="w-full"
                onClick={() => navigate(option.path)}
              >
                Acceder
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
