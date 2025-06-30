
import { useState, useEffect } from 'react';

interface Recarga {
  id: string;
  valor: number;
  fecha: Date;
  observaciones: string;
}

interface Tanqueada {
  id: string;
  vehiculo: string;
  kilometraje: number;
  galones: number;
  valorTotal: number;
  fecha: Date;
  observaciones: string;
}

export const useSaldoTexaco = () => {
  const [saldo, setSaldo] = useState(500000); // Saldo inicial
  const [recargas, setRecargas] = useState<Recarga[]>([]);
  const [tanqueadas, setTanqueadas] = useState<Tanqueada[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cargar datos del localStorage
    const saldoGuardado = localStorage.getItem('saldoTexaco');
    const recargasGuardadas = localStorage.getItem('recargasTexaco');
    const tanqueadasGuardadas = localStorage.getItem('tanqueadasTexaco');

    if (saldoGuardado) {
      const parsed = JSON.parse(saldoGuardado);
      setSaldo(parsed.saldo);
    }

    if (recargasGuardadas) {
      const parsed = JSON.parse(recargasGuardadas).map((recarga: any) => ({
        ...recarga,
        fecha: new Date(recarga.fecha)
      }));
      setRecargas(parsed);
    }

    if (tanqueadasGuardadas) {
      const parsed = JSON.parse(tanqueadasGuardadas).map((tanqueada: any) => ({
        ...tanqueada,
        fecha: new Date(tanqueada.fecha)
      }));
      setTanqueadas(parsed);
    }
  }, []);

  const agregarRecarga = async (recargaData: Omit<Recarga, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const nuevaRecarga: Recarga = {
        ...recargaData,
        id: Date.now().toString()
      };

      const nuevasRecargas = [nuevaRecarga, ...recargas];
      const nuevoSaldo = saldo + recargaData.valor;

      setRecargas(nuevasRecargas);
      setSaldo(nuevoSaldo);

      // Guardar en localStorage
      localStorage.setItem('recargasTexaco', JSON.stringify(nuevasRecargas));
      localStorage.setItem('saldoTexaco', JSON.stringify({ saldo: nuevoSaldo }));
      
      return true;
    } catch (error) {
      console.error('Error agregando recarga:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const registrarTanqueada = async (tanqueadaData: Omit<Tanqueada, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (tanqueadaData.valorTotal > saldo) {
        console.error('Saldo insuficiente');
        return false;
      }

      const nuevaTanqueada: Tanqueada = {
        ...tanqueadaData,
        id: Date.now().toString()
      };

      const nuevasTanqueadas = [nuevaTanqueada, ...tanqueadas];
      const nuevoSaldo = saldo - tanqueadaData.valorTotal;

      setTanqueadas(nuevasTanqueadas);
      setSaldo(nuevoSaldo);

      // Guardar en localStorage
      localStorage.setItem('tanqueadasTexaco', JSON.stringify(nuevasTanqueadas));
      localStorage.setItem('saldoTexaco', JSON.stringify({ saldo: nuevoSaldo }));
      
      return true;
    } catch (error) {
      console.error('Error registrando tanqueada:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    saldo,
    recargas: recargas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()),
    tanqueadas: tanqueadas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()),
    agregarRecarga,
    registrarTanqueada,
    isLoading
  };
};
