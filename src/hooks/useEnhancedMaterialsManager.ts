
import { useState, useEffect } from 'react';
import { useUnifiedDataManager } from './useUnifiedDataManager';
import { supabase } from '@/integrations/supabase/client';
import { Material } from '@/models/Materiales';

export const useEnhancedMaterialsManager = () => {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar materiales usando el sistema unificado
  const loadMateriales = async () => {
    setIsLoading(true);
    
    const supabaseQuery = async () => {
      return await supabase
        .from('materials')
        .select('*')
        .order('nombre_material', { ascending: true });
    };

    try {
      const supabaseMateriales = await readData<any>(
        'fincas', // Usando fincas como entityType hasta que se configure materials específicamente
        supabaseQuery,
        'materiales_volquetas'
      );

      const formattedMateriales: Material[] = supabaseMateriales.map(material => ({
        id: material.id,
        nombre_material: material.nombre_material,
        valor_por_m3: parseFloat(material.valor_por_m3) || 0,
        precio_venta_m3: material.precio_venta_m3 ? parseFloat(material.precio_venta_m3) : undefined,
        margen_ganancia: material.margen_ganancia ? parseFloat(material.margen_ganancia) : undefined
      }));

      setMateriales(formattedMateriales);
      console.log(`✅ Materiales cargados: ${formattedMateriales.length}`);
      
    } catch (error) {
      console.error('❌ Error cargando materiales:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar material usando el sistema unificado
  const addMaterial = async (materialData: Omit<Material, 'id'>) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('materials')
        .insert({
          nombre_material: materialData.nombre_material,
          valor_por_m3: materialData.valor_por_m3,
          precio_venta_m3: materialData.precio_venta_m3,
          margen_ganancia: materialData.margen_ganancia
        });
    };

    const localStorageUpdater = () => {
      const materialWithId = { 
        ...materialData, 
        id: Date.now().toString()
      };
      const updatedMateriales = [materialWithId, ...materiales];
      setMateriales(updatedMateriales);
      localStorage.setItem('materiales_volquetas', JSON.stringify(updatedMateriales));
    };

    const success = await writeData(
      'fincas', // Usando fincas como entityType hasta que se configure materials específicamente
      materialData,
      'create',
      supabaseOperation,
      'materiales_volquetas',
      localStorageUpdater
    );

    if (success) {
      await loadMateriales(); // Recargar para obtener el ID correcto de Supabase
    }

    return success;
  };

  // Actualizar material usando el sistema unificado
  const updateMaterial = async (id: string, updatedMaterial: Partial<Material>) => {
    const supabaseOperation = async () => {
      const updateData: any = {};
      
      if (updatedMaterial.nombre_material) updateData.nombre_material = updatedMaterial.nombre_material;
      if (updatedMaterial.valor_por_m3 !== undefined) updateData.valor_por_m3 = updatedMaterial.valor_por_m3;
      if (updatedMaterial.precio_venta_m3 !== undefined) updateData.precio_venta_m3 = updatedMaterial.precio_venta_m3;
      if (updatedMaterial.margen_ganancia !== undefined) updateData.margen_ganancia = updatedMaterial.margen_ganancia;

      return await supabase
        .from('materials')
        .update(updateData)
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedMateriales = materiales.map(material =>
        material.id === id ? { ...material, ...updatedMaterial } : material
      );
      setMateriales(updatedMateriales);
      localStorage.setItem('materiales_volquetas', JSON.stringify(updatedMateriales));
    };

    return await writeData(
      'fincas', // Usando fincas como entityType hasta que se configure materials específicamente
      { id, ...updatedMaterial },
      'update',
      supabaseOperation,
      'materiales_volquetas',
      localStorageUpdater
    );
  };

  // Eliminar material usando el sistema unificado
  const deleteMaterial = async (id: string) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('materials')
        .delete()
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedMateriales = materiales.filter(material => material.id !== id);
      setMateriales(updatedMateriales);
      localStorage.setItem('materiales_volquetas', JSON.stringify(updatedMateriales));
    };

    return await writeData(
      'fincas', // Usando fincas como entityType hasta que se configure materials específicamente
      { id },
      'delete',
      supabaseOperation,
      'materiales_volquetas',
      localStorageUpdater
    );
  };

  // Obtener material por nombre
  const getMaterialByName = (nombreMaterial: string): Material | undefined => {
    return materiales.find(material => material.nombre_material === nombreMaterial);
  };

  return {
    materiales,
    isLoading,
    loadMateriales,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    getMaterialByName
  };
};
