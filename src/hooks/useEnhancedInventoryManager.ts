
import { useState, useEffect } from 'react';
import { useUnifiedDataManager } from './useUnifiedDataManager';
import { supabase } from '@/integrations/supabase/client';
import { InventarioAcopio } from '@/models/InventarioAcopio';

export const useEnhancedInventoryManager = () => {
  const [inventario, setInventario] = useState<InventarioAcopio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar inventario usando el sistema unificado
  const loadInventario = async () => {
    setIsLoading(true);
    
    const supabaseQuery = async () => {
      return await supabase
        .from('inventory_acopio')
        .select('*')
        .order('tipo_material', { ascending: true });
    };

    try {
      const supabaseInventario = await readData<any>(
        'fincas', // Usando fincas como entityType hasta que se configure inventory específicamente
        supabaseQuery,
        'inventario_acopio'
      );

      const formattedInventario: InventarioAcopio[] = supabaseInventario.map(item => ({
        id: item.id,
        tipo_material: item.tipo_material,
        cantidad_disponible: parseFloat(item.cantidad_disponible) || 0,
        costo_promedio_m3: parseFloat(item.costo_promedio_m3) || 0
      }));

      setInventario(formattedInventario);
      console.log(`✅ Inventario cargado: ${formattedInventario.length} items`);
      
    } catch (error) {
      console.error('❌ Error cargando inventario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar item al inventario
  const addInventarioItem = async (itemData: Omit<InventarioAcopio, 'id'>) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('inventory_acopio')
        .insert({
          tipo_material: itemData.tipo_material,
          cantidad_disponible: itemData.cantidad_disponible,
          costo_promedio_m3: itemData.costo_promedio_m3
        });
    };

    const localStorageUpdater = () => {
      const itemWithId = { 
        ...itemData, 
        id: Date.now().toString()
      };
      const updatedInventario = [itemWithId, ...inventario];
      setInventario(updatedInventario);
      localStorage.setItem('inventario_acopio', JSON.stringify(updatedInventario));
    };

    const success = await writeData(
      'fincas', // Usando fincas como entityType hasta que se configure inventory específicamente
      itemData,
      'create',
      supabaseOperation,
      'inventario_acopio',
      localStorageUpdater
    );

    if (success) {
      await loadInventario(); // Recargar para obtener el ID correcto de Supabase
    }

    return success;
  };

  // Actualizar item del inventario
  const updateInventarioItem = async (id: string, updatedItem: Partial<InventarioAcopio>) => {
    const supabaseOperation = async () => {
      const updateData: any = {};
      
      if (updatedItem.tipo_material) updateData.tipo_material = updatedItem.tipo_material;
      if (updatedItem.cantidad_disponible !== undefined) updateData.cantidad_disponible = updatedItem.cantidad_disponible;
      if (updatedItem.costo_promedio_m3 !== undefined) updateData.costo_promedio_m3 = updatedItem.costo_promedio_m3;

      return await supabase
        .from('inventory_acopio')
        .update(updateData)
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedInventario = inventario.map(item =>
        item.id === id ? { ...item, ...updatedItem } : item
      );
      setInventario(updatedInventario);
      localStorage.setItem('inventario_acopio', JSON.stringify(updatedInventario));
    };

    return await writeData(
      'fincas', // Usando fincas como entityType hasta que se configure inventory específicamente
      { id, ...updatedItem },
      'update',
      supabaseOperation,
      'inventario_acopio',
      localStorageUpdater
    );
  };

  // Eliminar item del inventario
  const deleteInventarioItem = async (id: string) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('inventory_acopio')
        .delete()
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedInventario = inventario.filter(item => item.id !== id);
      setInventario(updatedInventario);
      localStorage.setItem('inventario_acopio', JSON.stringify(updatedInventario));
    };

    return await writeData(
      'fincas', // Usando fincas como entityType hasta que se configure inventory específicamente
      { id },
      'delete',
      supabaseOperation,
      'inventario_acopio',
      localStorageUpdater
    );
  };

  // Obtener item por material
  const getItemByMaterial = (tipoMaterial: string): InventarioAcopio | undefined => {
    return inventario.find(item => item.tipo_material === tipoMaterial);
  };

  return {
    inventario,
    isLoading,
    loadInventario,
    addInventarioItem,
    updateInventarioItem,
    deleteInventarioItem,
    getItemByMaterial
  };
};
