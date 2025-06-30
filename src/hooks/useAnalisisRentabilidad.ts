
import { useState, useEffect } from 'react';
import { useViajesTransporte } from './useViajesTransporte';

interface AnalisisRentabilidad {
  ingresosTotales: number;
  gastosTotales: number;
  gastoCombustible: number;
  utilidadNeta: number;
  margenRentabilidad: number;
  crecimientoIngresos: number;
  eficienciaPromedio: number;
  costoPorKm: string;
  rentabilidadPorVehiculo: Array<{
    nombre: string;
    viajes: number;
    kilometraje: number;
    utilidad: number;
    margen: number;
  }>;
  rutasMasRentables: Array<{
    origen: string;
    destino: string;
    viajes: number;
    distancia: number;
    ingresoPromedio: number;
  }>;
}

export const useAnalisisRentabilidad = (filtroTiempo: string, filtroVehiculo: string) => {
  const [analisis, setAnalisis] = useState<AnalisisRentabilidad>({
    ingresosTotales: 0,
    gastosTotales: 0,
    gastoCombustible: 0,
    utilidadNeta: 0,
    margenRentabilidad: 0,
    crecimientoIngresos: 0,
    eficienciaPromedio: 0,
    costoPorKm: '0',
    rentabilidadPorVehiculo: [],
    rutasMasRentables: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const { viajes } = useViajesTransporte();

  useEffect(() => {
    const calcularAnalisis = () => {
      // Filtrar por tiempo
      const ahora = new Date();
      let fechaInicio: Date;
      
      switch (filtroTiempo) {
        case 'semana':
          fechaInicio = new Date(ahora.getTime() - (7 * 24 * 60 * 60 * 1000));
          break;
        case 'trimestre':
          fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth() - 3, 1);
          break;
        default: // mes
          fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      }

      let viajesFiltrados = viajes.filter(viaje => viaje.fecha >= fechaInicio);

      // Filtrar por vehículo
      if (filtroVehiculo !== 'todos') {
        viajesFiltrados = viajesFiltrados.filter(viaje => {
          if (filtroVehiculo === 'volquetas') {
            return viaje.maquina.toLowerCase().includes('volqueta');
          } else if (filtroVehiculo === 'camiones') {
            return viaje.maquina.toLowerCase().includes('camión');
          }
          return true;
        });
      }

      // Cálculos básicos
      const ingresosTotales = viajesFiltrados.reduce((total, viaje) => 
        total + viaje.valorTransporte + viaje.valorMaterial, 0
      );

      const gastoCombustible = viajesFiltrados.reduce((total, viaje) => 
        total + (viaje.consumoCombustible || 0), 0
      );

      const gastosTotales = gastoCombustible; // Se pueden agregar más gastos
      const utilidadNeta = ingresosTotales - gastosTotales;
      const margenRentabilidad = ingresosTotales > 0 ? 
        Math.round((utilidadNeta / ingresosTotales) * 100) : 0;

      // Rentabilidad por vehículo
      const rentabilidadPorVehiculo = viajesFiltrados.reduce((acc, viaje) => {
        const existing = acc.find(v => v.nombre === viaje.maquina);
        const ingresos = viaje.valorTransporte + viaje.valorMaterial;
        const gastos = viaje.consumoCombustible || 0;
        
        if (existing) {
          existing.viajes += viaje.numeroViajes;
          existing.kilometraje += viaje.distancia * viaje.numeroViajes;
          existing.utilidad += (ingresos - gastos);
        } else {
          acc.push({
            nombre: viaje.maquina,
            viajes: viaje.numeroViajes,
            kilometraje: viaje.distancia * viaje.numeroViajes,
            utilidad: ingresos - gastos,
            margen: 0 // Se calculará después
          });
        }
        return acc;
      }, [] as Array<{nombre: string, viajes: number, kilometraje: number, utilidad: number, margen: number}>)
      .map(vehiculo => ({
        ...vehiculo,
        margen: vehiculo.utilidad > 0 ? Math.round((vehiculo.utilidad / (vehiculo.utilidad + 50000)) * 100) : 0
      }))
      .sort((a, b) => b.utilidad - a.utilidad);

      // Rutas más rentables
      const rutasMasRentables = viajesFiltrados.reduce((acc, viaje) => {
        const key = `${viaje.origen}-${viaje.destino}`;
        const existing = acc.find(r => r.origen === viaje.origen && r.destino === viaje.destino);
        const ingresoViaje = viaje.valorTransporte + viaje.valorMaterial;
        
        if (existing) {
          existing.viajes += viaje.numeroViajes;
          existing.ingresoPromedio = ((existing.ingresoPromedio * (existing.viajes - viaje.numeroViajes)) + ingresoViaje) / existing.viajes;
        } else {
          acc.push({
            origen: viaje.origen,
            destino: viaje.destino,
            viajes: viaje.numeroViajes,
            distancia: viaje.distancia,
            ingresoPromedio: ingresoViaje / viaje.numeroViajes
          });
        }
        return acc;
      }, [] as Array<{origen: string, destino: string, viajes: number, distancia: number, ingresoPromedio: number}>)
      .sort((a, b) => b.ingresoPromedio - a.ingresoPromedio)
      .slice(0, 5);

      setAnalisis({
        ingresosTotales,
        gastosTotales,
        gastoCombustible,
        utilidadNeta,
        margenRentabilidad,
        crecimientoIngresos: 12, // Placeholder
        eficienciaPromedio: 8.5, // Placeholder
        costoPorKm: (gastosTotales / Math.max(1, viajesFiltrados.reduce((total, viaje) => total + (viaje.distancia * viaje.numeroViajes), 0))).toFixed(2),
        rentabilidadPorVehiculo,
        rutasMasRentables
      });

      setIsLoading(false);
    };

    calcularAnalisis();
  }, [viajes, filtroTiempo, filtroVehiculo]);

  return { analisis, isLoading };
};
