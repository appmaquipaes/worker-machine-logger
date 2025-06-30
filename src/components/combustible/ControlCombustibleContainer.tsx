
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Fuel, Truck, Settings, BarChart3, ArrowLeft } from 'lucide-react';
import CombustibleDashboard from './CombustibleDashboard';
import SaldoTexaco from './SaldoTexaco';
import CombustibleMaquinaria from './CombustibleMaquinaria';
import ConfiguracionCombustible from './ConfiguracionCombustible';

const ControlCombustibleContainer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Control de Combustible</h1>
            <p className="text-gray-600">Gestión integral de combustible para volquetas y maquinaria</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Panel Admin
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="texaco" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Saldo Texaco
          </TabsTrigger>
          <TabsTrigger value="maquinaria" className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            Maquinaria
          </TabsTrigger>
          <TabsTrigger value="configuracion" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuración
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CombustibleDashboard />
        </TabsContent>

        <TabsContent value="texaco">
          <SaldoTexaco />
        </TabsContent>

        <TabsContent value="maquinaria">
          <CombustibleMaquinaria />
        </TabsContent>

        <TabsContent value="configuracion">
          <ConfiguracionCombustible />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlCombustibleContainer;
