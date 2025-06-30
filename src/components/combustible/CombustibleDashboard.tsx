
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fuel, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useCombustibleData } from '@/hooks/useCombustibleData';

const CombustibleDashboard = () => {
  const { stats, isLoading } = useCombustibleData();

  if (isLoading) {
    return <div className="text-center py-8">Cargando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Texaco</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.saldoTexaco.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Última recarga: {stats.ultimaRecarga}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consumo del Mes</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.consumoDelMes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.galones} galones consumidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eficienciaPromedio} km/gal</div>
            <p className="text-xs text-muted-foreground">
              Volquetas y camiones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.alertas}</div>
            <p className="text-xs text-muted-foreground">
              Vehículos con baja eficiencia
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de consumo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Consumo por Vehículo (Último Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.consumoPorVehiculo.map((vehiculo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{vehiculo.nombre}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${vehiculo.eficiencia >= 8 ? 'bg-green-500' : vehiculo.eficiencia >= 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${(vehiculo.galones / Math.max(...stats.consumoPorVehiculo.map(v => v.galones))) * 100}%` }}
                      />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{vehiculo.galones} gal</div>
                      <div className="text-xs text-gray-500">{vehiculo.eficiencia} km/gal</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consumo Maquinaria (Horas)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.consumoMaquinaria.map((maquina, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{maquina.nombre}</div>
                    <div className="text-xs text-gray-500">{maquina.horas} horas trabajadas</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{maquina.galones} gal</div>
                    <div className="text-xs text-gray-500">{maquina.consumoPorHora} gal/h</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de eficiencia */}
      {stats.vehiculosIneficientes.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Vehículos con Baja Eficiencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.vehiculosIneficientes.map((vehiculo, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                  <span className="font-medium">{vehiculo.nombre}</span>
                  <span className="text-orange-700">
                    {vehiculo.eficiencia} km/gal (esperado: ≥ {vehiculo.eficienciaEsperada})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CombustibleDashboard;
