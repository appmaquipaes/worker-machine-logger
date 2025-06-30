
import { useState, useEffect } from 'react';
import { useUnifiedDataManager } from './useUnifiedDataManager';
import { supabase } from '@/integrations/supabase/client';
import { Venta } from '@/types/venta';

export const useEnhancedVentasManager = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar ventas usando el sistema unificado
  const loadVentas = async () => {
    setIsLoading(true);
    
    // Por ahora, las ventas permanecen en localStorage ya que no hay tabla en Supabase
    // En el futuro se puede migrar a Supabase cuando se cree la tabla correspondiente
    const supabaseQuery = async () => {
      // Placeholder para futura implementación en Supabase
      return { data: [], error: null };
    };

    try {
      // Usar localStorage como fuente principal para ventas por ahora
      const stored = localStorage.getItem('ventas');
      const localVentas = stored ? JSON.parse(stored) : [];
      
      // Formatear las ventas para asegurar tipos correctos
      const formattedVentas: Venta[] = localVentas.map((venta: any) => ({
        ...venta,
        fecha: new Date(venta.fecha),
        total_venta: parseFloat(venta.total_venta) || 0,
        detalles: venta.detalles || []
      }));

      setVentas(formattedVentas);
      console.log(`✅ Ventas cargadas: ${formattedVentas.length}`);
      
    } catch (error) {
      console.error('❌ Error cargando ventas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar venta usando el sistema unificado
  const addVenta = async (ventaData: Omit<Venta, 'id'>) => {
    // Supabase operation placeholder - por implementar cuando se cree la tabla
    const supabaseOperation = async () => {
      // return await supabase.from('ventas').insert(ventaData);
      return { error: new Error('Tabla ventas no implementada en Supabase') };
    };

    const localStorageUpdater = () => {
      const ventaWithId = { 
        ...ventaData, 
        id: Date.now().toString()
      };
      const updatedVentas = [ventaWithId, ...ventas];
      setVentas(updatedVentas);
      localStorage.setItem('ventas', JSON.stringify(updatedVentas));
    };

    const success = await writeData(
      'ventas',
      ventaData,
      'create',
      supabaseOperation,
      'ventas',
      localStorageUpdater
    );

    return success;
  };

  // Actualizar venta usando el sistema unificado
  const updateVenta = async (id: string, updatedVenta: Partial<Venta>) => {
    // Supabase operation placeholder
    const supabaseOperation = async () => {
      // return await supabase.from('ventas').update(updatedVenta).eq('id', id);
      return { error: new Error('Tabla ventas no implementada en Supabase') };
    };

    const localStorageUpdater = () => {
      const updatedVentas = ventas.map(venta =>
        venta.id === id ? { ...venta, ...updatedVenta } : venta
      );
      setVentas(updatedVentas);
      localStorage.setItem('ventas', JSON.stringify(updatedVentas));
    };

    return await writeData(
      'ventas',
      { id, ...updatedVenta },
      'update',
      supabaseOperation,
      'ventas',
      localStorageUpdater
    );
  };

  // Eliminar venta usando el sistema unificado
  const deleteVenta = async (id: string) => {
    // Supabase operation placeholder
    const supabaseOperation = async () => {
      // return await supabase.from('ventas').delete().eq('id', id);
      return { error: new Error('Tabla ventas no implementada en Supabase') };
    };

    const localStorageUpdater = () => {
      const updatedVentas = ventas.filter(venta => venta.id !== id);
      setVentas(updatedVentas);
      localStorage.setItem('ventas', JSON.stringify(updatedVentas));
    };

    return await writeData(
      'ventas',
      { id },
      'delete',
      supabaseOperation,
      'ventas',
      localStorageUpdater
    );
  };

  return {
    ventas,
    isLoading,
    loadVentas,
    addVenta,
    updateVenta,
    deleteVenta
  };
};
