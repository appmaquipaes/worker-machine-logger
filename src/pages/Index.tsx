
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Settings, BarChart3, Users, Package, FileText } from 'lucide-react';

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Bienvenido a <span className="text-primary">MAQUIPAES SAS</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sistema integral de gestión para maquinaria pesada, transporte y materiales de construcción. 
            Controla tus operaciones, optimiza recursos y maximiza la rentabilidad.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/login')} className="px-8 py-3">
              Iniciar Sesión
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/register')} className="px-8 py-3">
              Registrarse
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-6 w-6 text-primary" />
                Control de Maquinaria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gestiona excavadoras, volquetas, cargadores y toda tu flota de maquinaria pesada con reportes detallados de horas trabajadas y rendimiento.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Análisis de Rentabilidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitorea costos operativos, ingresos por servicios y análisis de rentabilidad por máquina, ruta y proyecto.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                Gestión de Inventario
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Controla el inventario de materiales como arena, grava, tierra y recebo con seguimiento de entradas, salidas y costos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Administración de Personal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Gestiona operadores, conductores y personal administrativo con asignación de máquinas y control de comisiones.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-6 w-6 text-primary" />
                Control de Combustible
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitorea el consumo de combustible por máquina, gestiona saldos Texaco y optimiza la eficiencia operativa.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Reportes Integrales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Genera reportes detallados de operaciones, ventas, compras y análisis financiero con exportación a Excel.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ¿Listo para optimizar tu operación?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Únete a MAQUIPAES y lleva el control de tu maquinaria al siguiente nivel
          </p>
          <Button size="lg" onClick={() => navigate('/register')} className="px-8 py-3">
            Comenzar Ahora
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
