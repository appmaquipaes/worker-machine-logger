
import { useState, useEffect } from 'react';
import { useCombustibleMaquinaria } from './useCombustibleMaquinaria';
import { useReportesToCombustible } from './useReportesToCombustible';

export const useCombustibleMaquinariaIntegrado = () => {
  const { 
    consumos: consumosDirectos, 
    registrarConsumo, 
    estadisticas: estadisticasDirectas,
    isLoading 
  } = useCombustibleMaquinaria();
  
  const { consumosFromReports } = useReportesToCombustible();
  const [consumosIntegrados, setConsumosIntegrados] = useState<any[]>([]);
  const [estadisticasIntegradas, setEstadisticasIntegradas] = useState<any>(estadisticasDirectas);

  useEffect(() => {
    // Combinar consumos directos con consumos desde reportes
    const todosLosConsumos = [
      ...consumosDirectos.map(consumo => ({ ...consumo, esDesdeReporte: false })),
      ...consumosFromReports
    ];

    // Ordenar por fecha (más recientes primero)
    todosLosConsumos.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

    setConsumosIntegrados(todosLosConsumos);

    // Recalcular estadísticas incluyendo reportes
    calcularEstadisticasIntegradas(todosLosConsumos);
  }, [consumosDirectos, consumosFromReports]);

  const calcularEstadisticasIntegradas = (consumos: any[]) => {
    const ahora = new Date();
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    
    const consumosDelMes = consumos.filter(consumo => consumo.fecha >= inicioMes);
    
    const galonesDelMes = consumosDelMes.reduce((total, consumo) => total + consumo.galones, 0);
    const horasDelMes = consumosDelMes.reduce((total, consumo) => total + consumo.horasTrabajadas, 0);
    const costoDelMes = consumosDelMes.reduce((total, consumo) => total + consumo.valorTotal, 0);
    
    const consumoPromedio = horasDelMes > 0 ? Math.round((galonesDelMes / horasDelMes) * 10) / 10 : 0;

    // Consumo por máquina
    const consumoPorMaquina = consumosDelMes.reduce((acc, consumo) => {
      const existing = acc.find(m => m.nombre === consumo.maquina);
      if (existing) {
        existing.galones += consumo.galones;
        existing.horas += consumo.horasTrabajadas;
      } else {
        acc.push({
          nombre: consumo.maquina,
          galones: consumo.galones,
          horas: consumo.horasTrabajadas,
          consumoPorHora: 0,
          eficiencia: 'Normal'
        });
      }
      return acc;
    }, [] as any[]);

    // Calcular eficiencia por máquina
    consumoPorMaquina.forEach(maquina => {
      maquina.consumoPorHora = maquina.horas > 0 ? 
        Math.round((maquina.galones / maquina.horas) * 10) / 10 : 0;
      
      if (maquina.consumoPorHora <= 3) {
        maquina.eficiencia = 'Eficiente';
      } else if (maquina.consumoPorHora >= 5) {
        maquina.eficiencia = 'Ineficiente';
      } else {
        maquina.eficiencia = 'Normal';
      }
    });

    setEstadisticasIntegradas({
      galonesDelMes: Math.round(galonesDelMes * 10) / 10,
      horasDelMes: Math.round(horasDelMes * 10) / 10,
      costoDelMes: Math.round(costoDelMes),
      consumoPromedio,
      consumoPorMaquina
    });
  };

  return {
    consumos: consumosIntegrados,
    consumosDirectos,
    consumosFromReports,
    estadisticas: estadisticasIntegradas,
    registrarConsumo,
    isLoading
  };
};
