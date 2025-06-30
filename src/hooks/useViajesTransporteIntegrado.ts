
import { useState, useEffect } from 'react';
import { useViajesTransporte } from './useViajesTransporte';
import { useReportesToTransporte } from './useReportesToTransporte';

export const useViajesTransporteIntegrado = () => {
  const { viajes: viajesDirectos, registrarViaje, isLoading } = useViajesTransporte();
  const { viajesFromReports } = useReportesToTransporte();
  const [viajesIntegrados, setViajesIntegrados] = useState<any[]>([]);

  useEffect(() => {
    // Combinar viajes directos con viajes desde reportes
    const todosLosViajes = [
      ...viajesDirectos.map(viaje => ({ ...viaje, esDesdeReporte: false })),
      ...viajesFromReports
    ];

    // Ordenar por fecha (más recientes primero)
    todosLosViajes.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

    setViajesIntegrados(todosLosViajes);
  }, [viajesDirectos, viajesFromReports]);

  return {
    viajes: viajesIntegrados,
    viajesDirectos,
    viajesFromReports,
    registrarViaje,
    isLoading
  };
};
