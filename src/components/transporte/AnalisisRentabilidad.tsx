
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Fuel } from 'lucide-react';
import { useAnalisisRentabilidad } from '@/hooks/useAnalisisRentabilidad';

const AnalisisRentabilidad = () => {
  const [filtroTiempo, setFiltroTiempo] = useState('mes');
  const [filtroVehiculo, setFiltroVehiculo] = useState('todos');
  
  const { analisis, isLoading } = useAnalisisRentabilidad(filtroTiempo, filtroVehiculo);

  if (isLoading) {
    return <div className="text-center py-8">Cargando análisis...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Análisis de Rentabilidad</h2>
        <div className="flex gap-4">
          <Select value={filtroTiempo} onValueChange={setFiltroTiempo}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semana">Semana</SelectItem>
              <SelectItem value="mes">Mes</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filtroVehiculo} onValueChange={setFiltroVehiculo}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="volquetas">Volquetas</SelectItem>
              <SelectItem value="camiones">Camiones</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analisis.ingresosTotales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {analisis.crecimientoIngresos > 0 ? (
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{analisis.crecimientoIngresos}%
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {analisis.crecimientoIngresos}%
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analisis.gastosTotales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Combustible: ${analisis.gastoCombustible.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilidad Neta</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analisis.utilidadNeta.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Margen: {analisis.margenRentabilidad}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analisis.eficienciaPromedio} km/gal
            </div>
            <p className="text-xs text-muted-foreground">
              Costo por km: ${analisis.costoPorKm}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Análisis por vehículo */}
      <Card>
        <CardHeader>
          <CardTitle>Rentabilidad por Vehículo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analisis.rentabilidadPorVehiculo.map((vehiculo, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{vehiculo.nombre}</div>
                  <div className="text-sm text-gray-500">
                    {vehiculo.viajes} viajes • {vehiculo.kilometraje} km
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    ${vehiculo.utilidad.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    Margen: {vehiculo.margen}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Análisis por ruta */}
      <Card>
        <CardHeader>
          <CardTitle>Rutas Más Rentables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analisis.rutasMasRentables.map((ruta, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">
                    {ruta.origen} → {ruta.destino}
                  </div>
                  <div className="text-sm text-gray-500">
                    {ruta.viajes} viajes • {ruta.distancia} km promedio
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    ${ruta.ingresoPromedio.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    por viaje
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalisisRentabilidad;
