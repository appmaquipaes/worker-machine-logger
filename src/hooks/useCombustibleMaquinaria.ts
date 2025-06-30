
import { useState, useEffect } from 'react';

interface ConsumoMaquinaria {
  id: string;
  maquina: string;
  horasTrabajadas: number;
  galones: number;
  valorTotal: number;
  fecha: Date;
  observaciones: string;
}

interface EstadisticasMaquinaria {
  galonesDelMes: number;
  horasDelMes: number;
  consumoPromedio: number;
  costoDelMes: number;
  consumoPorMaquina: Array<{
    nombre: string;
    horas: number;
    galones: number;
    consumoPorHora: number;
    eficiencia: string;
  }>;
}

export const useCombustibleMaquinaria = () => {
  const [consumos, setConsumos] = useState<ConsumoMaquinaria[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasMaquinaria>({
    galonesDelMes: 0,
    horasDelMes: 0,
    consumoPromedio: 0,
    costoDelMes: 0,
    consumoPorMaquina: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const consumosGuardados = localStorage.getItem('consumosMaquinaria');
    if (consumosGuardados) {
      const parsed = JSON.parse(consumosGuardados).map((consumo: any) => ({
        ...consumo,
        fecha: new Date(consumo.fecha)
      }));
      setConsumos(parsed);
    }
  }, []);

  useEffect(() => {
    calcularEstadisticas();
  }, [consumos]);

  const calcularEstadisticas = () => {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);

    // Consumos del mes actual
    const consumosDelMes = consumos.filter(consumo => consumo.fecha >= inicioMes);

    const galonesDelMes = consumosDelMes.reduce((total, consumo) => total + consumo.galones, 0);
    const horasDelMes = consumosDelMes.reduce((total, consumo) => total + consumo.horasTrabajadas, 0);
    const costoDelMes = consumosDelMes.reduce((total, consumo) => total + consumo.valorTotal, 0);
    const consumoPromedio = horasDelMes > 0 ? Math.round((galonesDelMes / horasDelMes) * 10) / 10 : 0;

    // Consumo por máquina
    const consumoPorMaquina = consumosDelMes.reduce((acc, consumo) => {
      const existing = acc.find(m => m.nombre === consumo.maquina);
      if (existing) {
        existing.horas += consumo.horasTrabajadas;
        existing.galones += consumo.galones;
      } else {
        acc.push({
          nombre: consumo.maquina,
          horas: consumo.horasTrabajadas,
          galones: consumo.galones,
          consumoPorHora: 0,
          eficiencia: 'Normal'
        });
      }
      return acc;
    }, [] as Array<{nombre: string, horas: number, galones: number, consumoPorHora: number, eficiencia: string}>)
    .map(maquina => {
      const consumoPorHora = maquina.horas > 0 ? Math.round((maquina.galones / maquina.horas) * 10) / 10 : 0;
      let eficiencia = 'Normal';
      
      // Clasificar eficiencia según tipo de máquina
      if (maquina.nombre.includes('Excavadora')) {
        eficiencia = consumoPorHora <= 3.5 ? 'Eficiente' : consumoPorHora <= 4.5 ? 'Normal' : 'Ineficiente';
      } else if (maquina.nombre.includes('Bulldozer')) {
        eficiencia = consumoPorHora <= 4.5 ? 'Eficiente' : consumoPorHora <= 5.5 ? 'Normal' : 'Ineficiente';
      } else if (maquina.nombre.includes('Cargador')) {
        eficiencia = consumoPorHora <= 2.5 ? 'Eficiente' : consumoPorHora <= 3.5 ? 'Normal' : 'Ineficiente';
      }

      return {
        ...maquina,
        galones: Math.round(maquina.galones * 10) / 10,
        horas: Math.round(maquina.horas * 10) / 10,
        consumoPorHora,
        eficiencia
      };
    })
    .sort((a, b) => b.galones - a.galones);

    setEstadisticas({
      galonesDelMes: Math.round(galonesDelMes * 10) / 10,
      horasDelMes: Math.round(horasDelMes * 10) / 10,
      consumoPromedio,
      costoDelMes,
      consumoPorMaquina
    });
  };

  const registrarConsumo = async (consumoData: Omit<ConsumoMaquinaria, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const nuevoConsumo: ConsumoMaquinaria = {
        ...consumoData,
        id: Date.now().toString()
      };

      const nuevosConsumos = [nuevoConsumo, ...consumos];
      setConsumos(nuevosConsumos);
      localStorage.setItem('consumosMaquinaria', JSON.stringify(nuevosConsumos));
      
      return true;
    } catch (error) {
      console.error('Error registrando consumo:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    consumos: consumos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()),
    estadisticas,
    registrarConsumo,
    isLoading
  };
};
