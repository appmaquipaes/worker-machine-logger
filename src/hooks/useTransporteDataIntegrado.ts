
import { useState, useEffect } from 'react';
import { useViajesTransporteIntegrado } from './useViajesTransporteIntegrado';
import { useRutasTransporte } from './useRutasTransporte';

interface TransporteStats {
  viajesDelMes: number;
  crecimientoViajes: number;
  ingresosDelMes: number;
  crecimientoIngresos: number;
  gastoCombustible: number;
  eficienciaCombustible: number;
  rutasActivas: number;
  rutaMasRentable: string;
  viajesPorVehiculo: Array<{
    nombre: string;
    viajes: number;
  }>;
  rutasMasUtilizadas: Array<{
    origen: string;
    destino: string;
    viajes: number;
    distancia: number;
  }>;
  viajesDesdeReportes: number;
  viajesDirectos: number;
}

export const useTransporteDataIntegrado = () => {
  const [stats, setStats] = useState<TransporteStats>({
    viajesDelMes: 0,
    crecimientoViajes: 0,
    ingresosDelMes: 0,
    crecimientoIngresos: 0,
    gastoCombustible: 0,
    eficienciaCombustible: 0,
    rutasActivas: 0,
    rutaMasRentable: '',
    viajesPorVehiculo: [],
    rutasMasUtilizadas: [],
    viajesDesdeReportes: 0,
    viajesDirectos: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  const { viajes, viajesFromReports } = useViajesTransporteIntegrado();
  const { rutas } = useRutasTransporte();

  useEffect(() => {
    const calcularStats = () => {
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const inicioMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth() - 1, 1);
      const finMesAnterior = new Date(ahora.getFullYear(), ahora.getMonth(), 0);

      // Viajes del mes actual
      const viajesDelMes = viajes.filter(viaje => viaje.fecha >= inicioMes);
      const viajesMesAnterior = viajes.filter(viaje => 
        viaje.fecha >= inicioMesAnterior && viaje.fecha <= finMesAnterior
      );

      // Conteo de viajes por fuente
      const viajesDesdeReportes = viajesDelMes.filter(v => v.esDesdeReporte).length;
      const viajesDirectos = viajesDelMes.length - viajesDesdeReportes;

      // Ingresos del mes
      const ingresosDelMes = viajesDelMes.reduce((total, viaje) => 
        total + (viaje.valorTransporte || 0) + (viaje.valorMaterial || 0), 0
      );
      const ingresosMesAnterior = viajesMesAnterior.reduce((total, viaje) => 
        total + (viaje.valorTransporte || 0) + (viaje.valorMaterial || 0), 0
      );

      // Cálculo de crecimientos
      const crecimientoViajes = viajesMesAnterior.length > 0 
        ? Math.round(((viajesDelMes.length - viajesMesAnterior.length) / viajesMesAnterior.length) * 100)
        : 0;

      const crecimientoIngresos = ingresosMesAnterior > 0 
        ? Math.round(((ingresosDelMes - ingresosMesAnterior) / ingresosMesAnterior) * 100)
        : 0;

      // Viajes por vehículo
      const viajesPorVehiculo = viajesDelMes.reduce((acc, viaje) => {
        const existing = acc.find(v => v.nombre === viaje.maquina);
        if (existing) {
          existing.viajes += viaje.numeroViajes || 1;
        } else {
          acc.push({ nombre: viaje.maquina, viajes: viaje.numeroViajes || 1 });
        }
        return acc;
      }, [] as Array<{nombre: string, viajes: number}>);

      // Rutas más utilizadas
      const rutasMasUtilizadas = viajesDelMes.reduce((acc, viaje) => {
        const existing = acc.find(r => r.origen === viaje.origen && r.destino === viaje.destino);
        if (existing) {
          existing.viajes += viaje.numeroViajes || 1;
        } else {
          acc.push({
            origen: viaje.origen,
            destino: viaje.destino,
            viajes: viaje.numeroViajes || 1,
            distancia: viaje.distancia || 0
          });
        }
        return acc;
      }, [] as Array<{origen: string, destino: string, viajes: number, distancia: number}>)
      .sort((a, b) => b.viajes - a.viajes)
      .slice(0, 5);

      setStats({
        viajesDelMes: viajesDelMes.reduce((total, viaje) => total + (viaje.numeroViajes || 1), 0),
        crecimientoViajes,
        ingresosDelMes,
        crecimientoIngresos,
        gastoCombustible: 150000, // Se puede integrar con datos de combustible
        eficienciaCombustible: 8.5,
        rutasActivas: rutas.length,
        rutaMasRentable: rutasMasUtilizadas[0] ? 
          `${rutasMasUtilizadas[0].origen} → ${rutasMasUtilizadas[0].destino}` : 'N/A',
        viajesPorVehiculo: viajesPorVehiculo.slice(0, 5),
        rutasMasUtilizadas,
        viajesDesdeReportes,
        viajesDirectos
      });

      setIsLoading(false);
    };

    calcularStats();
  }, [viajes, viajesFromReports, rutas]);

  return { stats, isLoading };
};
