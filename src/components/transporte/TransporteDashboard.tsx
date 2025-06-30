
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Truck, DollarSign, Fuel, Route, FileText, Users } from 'lucide-react';
import { useTransporteDataIntegrado } from '@/hooks/useTransporteDataIntegrado';

const TransporteDashboard = () => {
  const { stats, isLoading } = useTransporteDataIntegrado();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Cargando estadísticas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viajes del Mes</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.viajesDelMes}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.crecimientoViajes > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {stats.crecimientoViajes}% vs mes anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.ingresosDelMes.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stats.crecimientoIngresos > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {stats.crecimientoIngresos}% vs mes anterior
            </div>
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
              Más rentable: {stats.rutaMasRentable}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.eficienciaCombustible} gal/h</div>
            <p className="text-xs text-muted-foreground">
              Consumo promedio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de trazabilidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Trazabilidad de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Viajes desde reportes</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600">{stats.viajesDesdeReportes}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(stats.viajesDesdeReportes / stats.viajesDelMes) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Viajes registrados directamente</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-600">{stats.viajesDirectos}</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(stats.viajesDirectos / stats.viajesDelMes) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                ✅ Sistema integrado: Los reportes de trabajadores se sincronizan automáticamente
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Viajes por Vehículo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.viajesPorVehiculo.map((vehiculo, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{vehiculo.nombre}</span>
                  <span className="font-bold">{vehiculo.viajes} viajes</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rutas Más Utilizadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.rutasMasUtilizadas.map((ruta, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{ruta.origen} → {ruta.destino}</div>
                  <div className="text-sm text-gray-500">{ruta.distancia} km</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{ruta.viajes} viajes</div>
                  <div className="text-xs text-gray-500">Este mes</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransporteDashboard;
