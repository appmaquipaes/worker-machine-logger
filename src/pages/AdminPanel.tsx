
import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Database, Truck, FileText, Users } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirigir si no hay usuario o no es administrador
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'Administrador') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Si el usuario no es admin, no mostrar nada
  if (!user || user.role !== 'Administrador') return null;

  // Opciones del panel de administración
  const adminOptions = [
    {
      title: 'Gestión de Máquinas',
      description: 'Agregar, editar o eliminar máquinas del sistema',
      icon: <Database className="h-10 w-10 text-primary" />,
      path: '/admin/machines'
    },
    {
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios y sus permisos',
      icon: <Users className="h-10 w-10 text-primary" />,
      path: '/admin/users'
    },
    {
      title: 'Administración de Volquetas',
      description: 'Configurar materiales y tarifas de transporte',
      icon: <Truck className="h-10 w-10 text-primary" />,
      path: '/admin/volquetas'
    },
    {
      title: 'Compras de Material',
      description: 'Registrar compras de material y actualizar inventario',
      icon: <FileText className="h-10 w-10 text-primary" />,
      path: '/admin/compras'
    },
    {
      title: 'Inventario de Material',
      description: 'Ver el stock disponible de materiales',
      icon: <Database className="h-10 w-10 text-primary" />,
      path: '/admin/inventario'
    },
    {
      title: 'Ventas de Material',
      description: 'Registrar ventas y actualizar inventario',
      icon: <FileText className="h-10 w-10 text-primary" />,
      path: '/admin/ventas'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground mt-2">
          Bienvenido al panel de administración, {user.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {adminOptions.map((option, index) => (
          <Link to={option.path} key={index} className="block">
            <Card className="h-full transition-all hover:shadow-md hover:border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-4">
                  {option.icon}
                  <span>{option.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{option.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
