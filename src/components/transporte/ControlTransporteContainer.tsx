
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Truck, Route, TrendingUp, BarChart3 } from 'lucide-react';
import TransporteDashboard from './TransporteDashboard';
import RegistroViajesTransporte from './RegistroViajesTransporte';
import GestionRutas from './GestionRutas';
import AnalisisRentabilidad from './AnalisisRentabilidad';

const ControlTransporteContainer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Control de Transporte</h1>
        <p className="text-gray-600">Gestión integral de volquetas y camiones</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="viajes" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Registro Viajes
          </TabsTrigger>
          <TabsTrigger value="rutas" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            Gestión Rutas
          </TabsTrigger>
          <TabsTrigger value="rentabilidad" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Análisis Rentabilidad
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <TransporteDashboard />
        </TabsContent>

        <TabsContent value="viajes">
          <RegistroViajesTransporte />
        </TabsContent>

        <TabsContent value="rutas">
          <GestionRutas />
        </TabsContent>

        <TabsContent value="rentabilidad">
          <AnalisisRentabilidad />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ControlTransporteContainer;
