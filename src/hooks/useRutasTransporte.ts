
import { useState, useEffect } from 'react';

interface RutaTransporte {
  id: string;
  origen: string;
  destino: string;
  distancia: number;
  tiempoEstimado: number;
  peajes: number;
  observaciones: string;
  viajesRealizados?: number;
  ultimoUso?: Date;
}

export const useRutasTransporte = () => {
  const [rutas, setRutas] = useState<RutaTransporte[]>([]);

  useEffect(() => {
    const rutasGuardadas = localStorage.getItem('rutasTransporte');
    if (rutasGuardadas) {
      const parsed = JSON.parse(rutasGuardadas).map((ruta: any) => ({
        ...ruta,
        ultimoUso: ruta.ultimoUso ? new Date(ruta.ultimoUso) : undefined
      }));
      setRutas(parsed);
    }
  }, []);

  const agregarRuta = async (rutaData: Omit<RutaTransporte, 'id'>): Promise<boolean> => {
    try {
      const nuevaRuta: RutaTransporte = {
        ...rutaData,
        id: Date.now().toString(),
        viajesRealizados: 0
      };

      const nuevasRutas = [...rutas, nuevaRuta];
      setRutas(nuevasRutas);
      localStorage.setItem('rutasTransporte', JSON.stringify(nuevasRutas));
      
      return true;
    } catch (error) {
      console.error('Error agregando ruta:', error);
      return false;
    }
  };

  const editarRuta = async (id: string, rutaData: Partial<RutaTransporte>): Promise<boolean> => {
    try {
      const rutasActualizadas = rutas.map(ruta => 
        ruta.id === id ? { ...ruta, ...rutaData } : ruta
      );
      
      setRutas(rutasActualizadas);
      localStorage.setItem('rutasTransporte', JSON.stringify(rutasActualizadas));
      
      return true;
    } catch (error) {
      console.error('Error editando ruta:', error);
      return false;
    }
  };

  const eliminarRuta = async (id: string): Promise<boolean> => {
    try {
      const rutasActualizadas = rutas.filter(ruta => ruta.id !== id);
      setRutas(rutasActualizadas);
      localStorage.setItem('rutasTransporte', JSON.stringify(rutasActualizadas));
      
      return true;
    } catch (error) {
      console.error('Error eliminando ruta:', error);
      return false;
    }
  };

  const buscarRuta = (origen: string, destino: string): RutaTransporte | undefined => {
    return rutas.find(ruta => 
      ruta.origen === origen && ruta.destino === destino
    );
  };

  return {
    rutas,
    agregarRuta,
    editarRuta,
    eliminarRuta,
    buscarRuta
  };
};
