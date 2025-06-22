
import { useCallback } from 'react';
import { toast } from 'sonner';

export const useDataPersistence = () => {
  
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    try {
      console.log(`💾 Guardando datos en localStorage - Key: ${key}`, data);
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      
      // Verificar que se guardó correctamente
      const verificacion = localStorage.getItem(key);
      if (verificacion) {
        console.log(`✅ Datos guardados exitosamente en ${key}`);
        return true;
      } else {
        console.error(`❌ Error: No se pudo verificar el guardado en ${key}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error guardando en localStorage (${key}):`, error);
      toast.error(`Error guardando datos en ${key}`);
      return false;
    }
  }, []);

  const loadFromLocalStorage = useCallback((key: string, defaultValue: any = []) => {
    try {
      console.log(`📂 Cargando datos de localStorage - Key: ${key}`);
      const storedData = localStorage.getItem(key);
      
      if (!storedData) {
        console.log(`ℹ️ No hay datos almacenados en ${key}, usando valor por defecto`);
        return defaultValue;
      }
      
      const parsedData = JSON.parse(storedData);
      console.log(`✅ Datos cargados exitosamente de ${key}:`, parsedData.length || 'N/A', 'elementos');
      return parsedData;
    } catch (error) {
      console.error(`❌ Error cargando de localStorage (${key}):`, error);
      toast.error(`Error cargando datos de ${key}`);
      return defaultValue;
    }
  }, []);

  const clearLocalStorage = useCallback((key: string) => {
    try {
      localStorage.removeItem(key);
      console.log(`🗑️ Datos eliminados de ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Error eliminando datos de ${key}:`, error);
      return false;
    }
  }, []);

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    clearLocalStorage
  };
};
