
import { useState, useEffect } from 'react';
import { TarifaCliente } from '@/models/TarifasCliente';
import { useDataPersistence } from '@/hooks/useDataPersistence';
import { toast } from "sonner";

export const useTarifasClientePersistence = () => {
  const [tarifas, setTarifas] = useState<TarifaCliente[]>([]);
  const { saveToLocalStorage, loadFromLocalStorage } = useDataPersistence();

  useEffect(() => {
    loadTarifasData();
  }, []);

  const loadTarifasData = () => {
    try {
      const storedTarifas = loadFromLocalStorage('tarifas_cliente', []);
      if (storedTarifas && storedTarifas.length > 0) {
        const parsedTarifas = storedTarifas.map((tarifa: any) => ({
          ...tarifa,
          fecha_creacion: new Date(tarifa.fecha_creacion)
        }));
        setTarifas(parsedTarifas);
        console.log('✅ Tarifas de cliente cargadas:', parsedTarifas.length);
      }
    } catch (error) {
      console.error('❌ Error cargando tarifas de cliente:', error);
      toast.error('Error cargando tarifas de cliente');
    }
  };

  const saveTarifas = (newTarifas: TarifaCliente[]) => {
    console.log('💾 Guardando tarifas de cliente:', newTarifas.length);
    setTarifas(newTarifas);
    const guardadoExitoso = saveToLocalStorage('tarifas_cliente', newTarifas);
    if (!guardadoExitoso) {
      toast.error('Error guardando tarifas de cliente');
      return false;
    }
    console.log('✅ Tarifas de cliente guardadas exitosamente');
    return true;
  };

  const addTarifa = (tarifa: TarifaCliente) => {
    const updatedTarifas = [...tarifas, tarifa];
    return saveTarifas(updatedTarifas);
  };

  const updateTarifa = (id: string, updatedTarifa: Partial<TarifaCliente>) => {
    const updatedTarifas = tarifas.map(tarifa =>
      tarifa.id === id ? { ...tarifa, ...updatedTarifa } : tarifa
    );
    return saveTarifas(updatedTarifas);
  };

  const deleteTarifa = (id: string) => {
    const updatedTarifas = tarifas.filter(tarifa => tarifa.id !== id);
    return saveTarifas(updatedTarifas);
  };

  const toggleTarifaStatus = (id: string) => {
    const updatedTarifas = tarifas.map(tarifa =>
      tarifa.id === id ? { ...tarifa, activa: !tarifa.activa } : tarifa
    );
    return saveTarifas(updatedTarifas);
  };

  return {
    tarifas,
    addTarifa,
    updateTarifa,
    deleteTarifa,
    toggleTarifaStatus,
    loadTarifasData
  };
};
