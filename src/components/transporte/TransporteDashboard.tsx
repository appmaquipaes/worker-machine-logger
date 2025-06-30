
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, DollarSign, Fuel, Route } from 'lucide-react';
import { useTransporteData } from '@/hooks/useTransporteData';

const TransporteDashboard = () => {
  const { stats, isLoading } = useTransporteData();

  if (isLoading) {
    return <div className="text-center py-8">Cargando dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viajes del Mes</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viajesDelMes}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.crecimientoViajes}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.ingresosDelMes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats.crecimientoIngresos}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gasto Combustible</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.gastoCombustible.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.eficienciaCombustible} km/galón promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rutas Activas</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rutasActivas}</div>
            <p className="text-xs text-muted-foreground">
              Ruta más rentable: {stats.rutaMasRentable}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Viajes por Vehículo (Último Mes)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.viajesPorVehiculo.map((vehiculo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{vehiculo.nombre}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(vehiculo.viajes / Math.max(...stats.viajesPorVehiculo.map(v => v.viajes))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">{vehiculo.viajes}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rutas Más Utilizadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.rutasMasUtilizadas.map((ruta, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{ruta.origen}</span>
                    <span className="text-gray-500"> → </span>
                    <span className="text-sm font-medium">{ruta.destino}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{ruta.viajes} viajes</div>
                    <div className="text-xs text-gray-500">{ruta.distancia} km</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransporteDashboard;
