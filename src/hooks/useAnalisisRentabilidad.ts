
import { useState, useEffect } from 'react';
import { useViajesTransporte } from './useViajesTransporte';
import { useReportPersistence } from './useReportPersistence';

interface AnalisisRentabilidad {
  ingresosTotales: number;
  gastosTotales: number;
  gastoCombustible: number;
  utilidadNeta: number;
  margenRentabilidad: number;
  crecimientoIngresos: number;
  eficienciaPromedio: number;
  costoPorKm: number;
  rentabilidadPorVehiculo: Array<{
    nombre: string;
    viajes: number;
    kilometraje: number;
    ingresos: number;
    gastos: number;
    utilidad: number;
    margen: number;
  }>;
  rutasMasRentables: Array<{
    origen: string;
    destino: string;
    viajes: number;
    distancia: number;
    ingresoPromedio: number;
    margen: number;
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
    costoPorKm: 0,
    rentabilidadPorVehiculo: [],
    rutasMasRentables: []
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const { viajes } = useViajesTransporte();
  const { reports } = useReportPersistence();

  useEffect(() => {
    const calcularAnalisis = () => {
      const fechaLimite = obtenerFechaLimite(filtroTiempo);
      
      // Filtrar viajes por tiempo y vehículo
      const viajesFiltrados = viajes.filter(viaje => {
        const cumpleTiempo = viaje.fecha >= fechaLimite;
        const cumpleVehiculo = filtroVehiculo === 'todos' || 
          (filtroVehiculo === 'volquetas' && viaje.maquina.toLowerCase().includes('volqueta')) ||
          (filtroVehiculo === 'camiones' && viaje.maquina.toLowerCase().includes('camión'));
        return cumpleTiempo && cumpleVehiculo;
      });

      // Filtrar reportes de gastos
      const reportesGastos = reports.filter(report => {
        const reportDate = new Date(report.reportDate);
        const esTransporte = ['Volqueta', 'Camión'].some(tipo => 
          report.machineName.toLowerCase().includes(tipo.toLowerCase())
        );
        const cumpleTiempo = reportDate >= fechaLimite;
        const cumpleVehiculo = filtroVehiculo === 'todos' || 
          (filtroVehiculo === 'volquetas' && report.machineName.toLowerCase().includes('volqueta')) ||
          (filtroVehiculo === 'camiones' && report.machineName.toLowerCase().includes('camión'));
        
        return esTransporte && cumpleTiempo && cumpleVehiculo && 
               ['Combustible', 'Mantenimiento'].includes(report.reportType);
      });

      // Calcular métricas principales
      const ingresosTotales = viajesFiltrados.reduce((total, viaje) => 
        total + viaje.valorTransporte + viaje.valorMaterial, 0
      );

      const gastoCombustible = reportesGastos
        .filter(r => r.reportType === 'Combustible')
        .reduce((total, report) => total + (report.value || 0), 0);

      const gastoMantenimiento = reportesGastos
        .filter(r => r.reportType === 'Mantenimiento')
        .reduce((total, report) => total + (report.value || 0), 0);

      const gastosTotales = gastoCombustible + gastoMantenimiento;
      const utilidadNeta = ingresosTotales - gastosTotales;
      const margenRentabilidad = ingresosTotales > 0 ? 
        Math.round((utilidadNeta / ingresosTotales) * 100) : 0;

      // Calcular eficiencia
      const totalKilometraje = viajesFiltrados.reduce((total, viaje) => 
        total + (viaje.distancia * viaje.numeroViajes), 0
      );
      const eficienciaPromedio = gastoCombustible > 0 ? 
        Math.round(totalKilometraje / (gastoCombustible / 12000)) : 0; // 12000 pesos por galón
      const costoPorKm = totalKilometraje > 0 ? 
        Math.round(gastosTotales / totalKilometraje) : 0;

      // Análisis por vehículo
      const vehiculosUnicos = [...new Set(viajesFiltrados.map(v => v.maquina))];
      const rentabilidadPorVehiculo = vehiculosUnicos.map(vehiculo => {
        const viajesVehiculo = viajesFiltrados.filter(v => v.maquina === vehiculo);
        const reportesVehiculo = reportesGastos.filter(r => r.machineName === vehiculo);
        
        const ingresos = viajesVehiculo.reduce((total, viaje) => 
          total + viaje.valorTransporte + viaje.valorMaterial, 0
        );
        const gastos = reportesVehiculo.reduce((total, report) => total + (report.value || 0), 0);
        const utilidad = ingresos - gastos;
        const viajes = viajesVehiculo.reduce((total, viaje) => total + viaje.numeroViajes, 0);
        const kilometraje = viajesVehiculo.reduce((total, viaje) => 
          total + (viaje.distancia * viaje.numeroViajes), 0
        );

        return {
          nombre: vehiculo,
          viajes,
          kilometraje,
          ingresos,
          gastos,
          utilidad,
          margen: ingresos > 0 ? Math.round((utilidad / ingresos) * 100) : 0
        };
      });

      // Rutas más rentables
      const rutasMap = new Map();
      viajesFiltrados.forEach(viaje => {
        const key = `${viaje.origen}-${viaje.destino}`;
        if (!rutasMap.has(key)) {
          rutasMap.set(key, {
            origen: viaje.origen,
            destino: viaje.destino,
            viajes: 0,
            ingresoTotal: 0,
            distanciaTotal: 0
          });
        }
        const ruta = rutasMap.get(key);
        ruta.viajes += viaje.numeroViajes;
        ruta.ingresoTotal += viaje.valorTransporte + viaje.valorMaterial;
        ruta.distanciaTotal += viaje.distancia * viaje.numeroViajes;
      });

      const rutasMasRentables = Array.from(rutasMap.values())
        .map(ruta => ({
          ...ruta,
          distancia: Math.round(ruta.distanciaTotal / ruta.viajes),
          ingresoPromedio: Math.round(ruta.ingresoTotal / ruta.viajes),
          margen: 80 // Placeholder, se puede calcular con más detalle
        }))
        .sort((a, b) => b.ingresoPromedio - a.ingresoPromedio)
        .slice(0, 5);

      setAnalisis({
        ingresosTotales,
        gastosTotales,
        gastoCombustible,
        utilidadNeta,
        margenRentabilidad,
        crecimientoIngresos: 15, // Placeholder
        eficienciaPromedio,
        costoPorKm,
        rentabilidadPorVehiculo: rentabilidadPorVehiculo.sort((a, b) => b.utilidad - a.utilidad),
        rutasMasRentables
      });

      setIsLoading(false);
    };

    calcularAnalisis();
  }, [viajes, reports, filtroTiempo, filtroVehiculo]);

  const obtenerFechaLimite = (filtro: string): Date => {
    const ahora = new Date();
    switch (filtro) {
      case 'semana':
        return new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'mes':
        return new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      case 'trimestre':
        return new Date(ahora.getFullYear(), ahora.getMonth() - 3, 1);
      default:
        return new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    }
  };

  return {
    analisis,
    isLoading
  };
};
