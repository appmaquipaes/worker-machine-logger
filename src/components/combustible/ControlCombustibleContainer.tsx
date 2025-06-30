
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Fuel, Truck, Settings, BarChart3 } from 'lucide-react';
import CombustibleDashboard from './CombustibleDashboard';
import SaldoTexaco from './SaldoTexaco';
import CombustibleMaquinaria from './CombustibleMaquinaria';
import ConfiguracionCombustible from './ConfiguracionCombustible';

const ControlCombustibleContainer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Control de Combustible</h1>
        <p className="text-gray-600">Gestión integral de combustible para volquetas y maquinaria</p>
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
