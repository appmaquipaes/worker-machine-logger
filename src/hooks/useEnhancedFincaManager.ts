
import { useState, useEffect } from 'react';
import { useUnifiedDataManager } from './useUnifiedDataManager';
import { supabase } from '@/integrations/supabase/client';
import { Finca } from '@/models/Fincas';

export const useEnhancedFincaManager = () => {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { readData, writeData } = useUnifiedDataManager();

  // Cargar fincas usando el sistema unificado
  const loadFincas = async () => {
    setIsLoading(true);
    
    const supabaseQuery = async () => {
      return await supabase
        .from('fincas')
        .select('*')
        .order('created_at', { ascending: false });
    };

    try {
      const supabaseFincas = await readData<any>(
        'fincas',
        supabaseQuery,
        'fincas'
      );

      const formattedFincas: Finca[] = supabaseFincas.map(finca => ({
        id: finca.id,
        cliente_id: finca.cliente_id,
        nombre_finca: finca.nombre_finca,
        direccion: finca.direccion,
        ciudad: finca.ciudad,
        contacto_nombre: finca.contacto_nombre,
        contacto_telefono: finca.contacto_telefono,
        notas: finca.notas,
        fecha_registro: new Date(finca.created_at)
      }));

      setFincas(formattedFincas);
      console.log(`✅ Fincas cargadas: ${formattedFincas.length}`);
      
    } catch (error) {
      console.error('❌ Error cargando fincas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Agregar finca usando el sistema unificado
  const addFinca = async (fincaData: Omit<Finca, 'id' | 'fecha_registro'>) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('fincas')
        .insert({
          cliente_id: fincaData.cliente_id,
          nombre_finca: fincaData.nombre_finca,
          direccion: fincaData.direccion,
          ciudad: fincaData.ciudad,
          contacto_nombre: fincaData.contacto_nombre,
          contacto_telefono: fincaData.contacto_telefono,
          notas: fincaData.notas
        });
    };

    const localStorageUpdater = () => {
      const fincaWithId = { 
        ...fincaData, 
        id: Date.now().toString(),
        fecha_registro: new Date()
      };
      const updatedFincas = [fincaWithId, ...fincas];
      setFincas(updatedFincas);
      localStorage.setItem('fincas', JSON.stringify(updatedFincas));
    };

    const success = await writeData(
      'fincas',
      fincaData,
      'create',
      supabaseOperation,
      'fincas',
      localStorageUpdater
    );

    if (success) {
      await loadFincas(); // Recargar para obtener el ID correcto de Supabase
    }

    return success;
  };

  // Actualizar finca usando el sistema unificado
  const updateFinca = async (id: string, updatedFinca: Partial<Finca>) => {
    const supabaseOperation = async () => {
      const updateData: any = {};
      
      if (updatedFinca.cliente_id) updateData.cliente_id = updatedFinca.cliente_id;
      if (updatedFinca.nombre_finca) updateData.nombre_finca = updatedFinca.nombre_finca;
      if (updatedFinca.direccion) updateData.direccion = updatedFinca.direccion;
      if (updatedFinca.ciudad) updateData.ciudad = updatedFinca.ciudad;
      if (updatedFinca.contacto_nombre) updateData.contacto_nombre = updatedFinca.contacto_nombre;
      if (updatedFinca.contacto_telefono) updateData.contacto_telefono = updatedFinca.contacto_telefono;
      if (updatedFinca.notas !== undefined) updateData.notas = updatedFinca.notas;

      return await supabase
        .from('fincas')
        .update(updateData)
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedFincas = fincas.map(finca =>
        finca.id === id ? { ...finca, ...updatedFinca } : finca
      );
      setFincas(updatedFincas);
      localStorage.setItem('fincas', JSON.stringify(updatedFincas));
    };

    return await writeData(
      'fincas',
      { id, ...updatedFinca },
      'update',
      supabaseOperation,
      'fincas',
      localStorageUpdater
    );
  };

  // Eliminar finca usando el sistema unificado
  const deleteFinca = async (id: string) => {
    const supabaseOperation = async () => {
      return await supabase
        .from('fincas')
        .delete()
        .eq('id', id);
    };

    const localStorageUpdater = () => {
      const updatedFincas = fincas.filter(finca => finca.id !== id);
      setFincas(updatedFincas);
      localStorage.setItem('fincas', JSON.stringify(updatedFincas));
    };

    return await writeData(
      'fincas',
      { id },
      'delete',
      supabaseOperation,
      'fincas',
      localStorageUpdater
    );
  };

  // Obtener fincas por cliente
  const getFincasByCliente = (clienteId: string): Finca[] => {
    return fincas.filter(finca => finca.cliente_id === clienteId);
  };

  return {
    fincas,
    isLoading,
    loadFincas,
    addFinca,
    updateFinca,
    deleteFinca,
    getFincasByCliente
  };
};
