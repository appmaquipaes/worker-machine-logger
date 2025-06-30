
import { useState, useEffect } from 'react';

interface ViajeTransporte {
  id: string;
  maquina: string;
  origen: string;
  destino: string;
  distancia: number;
  material: string;
  cantidadM3: number;
  numeroViajes: number;
  valorTransporte: number;
  valorMaterial: number;
  conductor: string;
  observaciones: string;
  fecha: Date;
  tipoVenta: string;
  consumoCombustible?: number;
  eficiencia?: number;
}

export const useViajesTransporte = () => {
  const [viajes, setViajes] = useState<ViajeTransporte[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const viajesGuardados = localStorage.getItem('viajesTransporte');
    if (viajesGuardados) {
      const parsed = JSON.parse(viajesGuardados).map((viaje: any) => ({
        ...viaje,
        fecha: new Date(viaje.fecha)
      }));
      setViajes(parsed);
    }
  }, []);

  const registrarViaje = async (viajeData: Omit<ViajeTransporte, 'id' | 'tipoVenta'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const tipoVenta = viajeData.origen === 'Acopio Maquipaes' ? 'Solo transporte' : 'Material + transporte';
      
      const nuevoViaje: ViajeTransporte = {
        ...viajeData,
        id: Date.now().toString(),
        tipoVenta,
        eficiencia: viajeData.distancia > 0 ? viajeData.distancia * viajeData.numeroViajes : 0
      };

      const nuevosViajes = [nuevoViaje, ...viajes];
      setViajes(nuevosViajes);
      localStorage.setItem('viajesTransporte', JSON.stringify(nuevosViajes));
      
      return true;
    } catch (error) {
      console.error('Error registrando viaje:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    viajes,
    registrarViaje,
    isLoading
  };
};
