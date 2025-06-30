
import { useState, useEffect } from 'react';
import { useViajesTransporte } from './useViajesTransporte';

interface CombustibleStats {
  saldoTexaco: number;
  ultimaRecarga: string;
  consumoDelMes: number;
  galones: number;
  eficienciaPromedio: number;
  alertas: number;
  consumoPorVehiculo: Array<{
    nombre: string;
    galones: number;
    eficiencia: number;
  }>;
  consumoMaquinaria: Array<{
    nombre: string;
    horas: number;
    galones: number;
    consumoPorHora: number;
  }>;
  vehiculosIneficientes: Array<{
    nombre: string;
    eficiencia: number;
    eficienciaEsperada: number;
  }>;
}

export const useCombustibleData = () => {
  const [stats, setStats] = useState<CombustibleStats>({
    saldoTexaco: 0,
    ultimaRecarga: 'N/A',
    consumoDelMes: 0,
    galones: 0,
    eficienciaPromedio: 0,
    alertas: 0,
    consumoPorVehiculo: [],
    consumoMaquinaria: [],
    vehiculosIneficientes: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const { viajes } = useViajesTransporte();

  useEffect(() => {
    const calcularStats = () => {
      // Obtener datos guardados en localStorage
      const saldoTexacoData = localStorage.getItem('saldoTexaco');
      const recargasData = localStorage.getItem('recargasTexaco');
      const configCombustible = localStorage.getItem('configCombustible');

      const saldo = saldoTexacoData ? JSON.parse(saldoTexacoData) : { saldo: 500000 };
      const recargas = recargasData ? JSON.parse(recargasData) : [];
      const config = configCombustible ? JSON.parse(configCombustible) : {};

      // Calcular fecha del mes actual
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

      // Viajes del mes actual
      const viajesDelMes = viajes.filter(viaje => viaje.fecha >= inicioMes);

      // Consumo total del mes
      const consumoDelMes = viajesDelMes.reduce((total, viaje) => 
        total + (viaje.consumoCombustible || 0), 0
      );

      // Calcular galones (asumiendo precio promedio)
      const precioPorGalon = config.precioPorGalon || 12000;
      const galones = Math.round(consumoDelMes / precioPorGalon);

      // Consumo por vehículo
      const consumoPorVehiculo = viajesDelMes.reduce((acc, viaje) => {
        const existing = acc.find(v => v.nombre === viaje.maquina);
        const consumo = viaje.consumoCombustible || 0;
        const galonesViaje = consumo / precioPorGalon;
        const kilometraje = viaje.distancia * viaje.numeroViajes;
        
        if (existing) {
          existing.galones += galonesViaje;
          existing.kilometraje += kilometraje;
        } else {
          acc.push({
            nombre: viaje.maquina,
            galones: galonesViaje,
            kilometraje: kilometraje,
            eficiencia: 0
          });
        }
        return acc;
      }, [] as Array<{nombre: string, galones: number, kilometraje: number, eficiencia: number}>)
      .map(vehiculo => ({
        ...vehiculo,
        galones: Math.round(vehiculo.galones),
        eficiencia: vehiculo.galones > 0 ? Math.round((vehiculo.kilometraje / vehiculo.galones) * 10) / 10 : 0
      }))
      .sort((a, b) => b.galones - a.galones);

      // Eficiencia promedio
      const eficienciaPromedio = consumoPorVehiculo.length > 0 
        ? Math.round((consumoPorVehiculo.reduce((sum, v) => sum + v.eficiencia, 0) / consumoPorVehiculo.length) * 10) / 10
        : 0;

      // Vehículos ineficientes (menos de 6 km/gal)
      const vehiculosIneficientes = consumoPorVehiculo
        .filter(v => v.eficiencia > 0 && v.eficiencia < 6)
        .map(v => ({
          nombre: v.nombre,
          eficiencia: v.eficiencia,
          eficienciaEsperada: 8
        }));

      // Consumo maquinaria (datos simulados por ahora)
      const consumoMaquinaria = [
        { nombre: 'Excavadora CAT 320', horas: 180, galones: 720, consumoPorHora: 4.0 },
        { nombre: 'Bulldozer D6T', horas: 160, galones: 800, consumoPorHora: 5.0 },
        { nombre: 'Cargador 950H', horas: 200, galones: 600, consumoPorHora: 3.0 }
      ];

      // Última recarga
      const ultimaRecarga = recargas.length > 0 
        ? new Date(recargas[recargas.length - 1].fecha).toLocaleDateString()
        : 'No hay recargas';

      setStats({
        saldoTexaco: saldo.saldo,
        ultimaRecarga,
        consumoDelMes,
        galones,
        eficienciaPromedio,
        alertas: vehiculosIneficientes.length,
        consumoPorVehiculo,
        consumoMaquinaria,
        vehiculosIneficientes
      });

      setIsLoading(false);
    };

    calcularStats();
  }, [viajes]);

  return { stats, isLoading };
};
