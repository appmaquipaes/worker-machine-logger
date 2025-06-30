
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Building, Database, MapPin, Users, ShoppingCart, DollarSign, Truck, Fuel } from 'lucide-react';

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
      icon: <User className="mobile-icon-large text-blue-600" />,
      path: '/admin/users',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Gestión de Máquinas',
      description: 'Administrar máquinas, volquetas y equipos',
      icon: <Building className="mobile-icon-large text-orange-600" />,
      path: '/admin/machines',
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Proveedores',
      description: 'Administrar proveedores de material',
      icon: <MapPin className="mobile-icon-large text-green-600" />,
      path: '/admin/proveedores',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Clientes',
      description: 'Gestionar clientes que reciben materiales',
      icon: <Users className="mobile-icon-large text-purple-600" />,
      path: '/admin/clientes',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Tarifas por Cliente',
      description: 'Configurar tarifas de flete personalizadas por cliente y destino',
      icon: <DollarSign className="mobile-icon-large text-amber-600" />,
      path: '/admin/tarifas-cliente',
      color: 'from-amber-500 to-yellow-500'
    },
    {
      title: 'Gestión de Compras',
      description: 'Registrar y gestionar compras de materiales y servicios',
      icon: <Database className="mobile-icon-large text-indigo-600" />,
      path: '/admin/compras',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Ventas',
      description: 'Gestionar ventas de material y servicios de transporte',
      icon: <ShoppingCart className="mobile-icon-large text-teal-600" />,
      path: '/admin/ventas',
      color: 'from-teal-500 to-teal-600'
    },
    {
      title: 'Inventario Acopio',
      description: 'Ver y gestionar el inventario actual del acopio',
      icon: <Database className="mobile-icon-large text-slate-600" />,
      path: '/admin/inventario',
      color: 'from-slate-500 to-slate-600'
    },
    {
      title: 'Control de Transporte',
      description: 'Gestionar viajes, rutas y análisis de rentabilidad de volquetas',
      icon: <Truck className="mobile-icon-large text-cyan-600" />,
      path: '/admin/control-transporte',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      title: 'Control de Combustible',
      description: 'Administrar combustible, saldo Texaco y consumo de maquinaria',
      icon: <Fuel className="mobile-icon-large text-red-600" />,
      path: '/admin/control-combustible',
      color: 'from-red-500 to-red-600'
    },
  ];

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Corporativo */}
      <div className="page-header">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-responsive-xl font-bold text-white mb-2">
                Panel de Administración
              </h1>
              <p className="text-blue-100 text-responsive-base">
                Bienvenido, {user?.name}. Gestiona todos los aspectos del sistema desde aquí.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')}
              className="btn-outline-large bg-white/10 border-white/30 text-white hover:bg-white hover:text-blue-600"
            >
              <ArrowLeft className="mobile-icon" />
              <span className="hidden sm:inline">Volver</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Grid de opciones */}
      <div className="container mx-auto px-4 py-6">
        <div className="action-grid gap-6">
          {AdminOptions.map((option, index) => (
            <Card key={index} className="corporate-card group hover:shadow-2xl transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className={`
                  mx-auto mb-4 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl 
                  bg-gradient-to-br ${option.color} 
                  flex items-center justify-center shadow-lg
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {option.icon}
                </div>
                <CardTitle className="text-responsive-lg font-bold text-slate-800">
                  {option.title}
                </CardTitle>
                <CardDescription className="text-responsive-base text-slate-600 leading-relaxed">
                  {option.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button
                  variant="default"
                  className="btn-primary-large w-full"
                  onClick={() => navigate(option.path)}
                >
                  <span className="font-semibold">Acceder</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
