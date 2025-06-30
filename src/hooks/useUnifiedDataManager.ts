
import { useDataSourceManager } from './useDataSourceManager';
import { supabase } from '@/integrations/supabase/client';

export const useUnifiedDataManager = () => {
  const { getEffectiveDataSource, markForSync, supabaseConnected } = useDataSourceManager();

  // Operación genérica de lectura
  const readData = async <T>(
    entityType: 'users' | 'machines' | 'reports' | 'clients' | 'fincas' | 'ventas',
    supabaseQuery?: () => Promise<{ data: T[] | null; error: any }>,
    localStorageKey?: string
  ): Promise<T[]> => {
    const effectiveSource = getEffectiveDataSource(entityType);
    
    if (effectiveSource === 'supabase' && supabaseQuery) {
      try {
        const { data, error } = await supabaseQuery();
        if (!error && data) {
          // Sincronizar con localStorage como cache
          if (localStorageKey) {
            localStorage.setItem(localStorageKey, JSON.stringify(data));
          }
          return data;
        }
      } catch (error) {
        console.error(`❌ Error reading from Supabase for ${entityType}:`, error);
      }
    }
    
    // Fallback a localStorage
    if (localStorageKey) {
      const stored = localStorage.getItem(localStorageKey);
      return stored ? JSON.parse(stored) : [];
    }
    
    return [];
  };

  // Operación genérica de escritura
  const writeData = async <T>(
    entityType: 'users' | 'machines' | 'reports' | 'clients' | 'fincas' | 'ventas',
    data: T,
    operation: 'create' | 'update' | 'delete',
    supabaseOperation?: () => Promise<{ error: any }>,
    localStorageKey?: string,
    localStorageUpdater?: (data: T) => void
  ): Promise<boolean> => {
    const effectiveSource = getEffectiveDataSource(entityType);
    
    if (effectiveSource === 'supabase' && supabaseOperation) {
      try {
        const { error } = await supabaseOperation();
        if (!error) {
          // Actualizar localStorage como cache
          if (localStorageUpdater) {
            localStorageUpdater(data);
          }
          console.log(`✅ ${operation} successful in Supabase for ${entityType}`);
          return true;
        } else {
          console.error(`❌ Supabase ${operation} failed for ${entityType}:`, error);
        }
      } catch (error) {
        console.error(`❌ Error in Supabase ${operation} for ${entityType}:`, error);
      }
      
      // Si Supabase falla, marcar para sincronización
      markForSync(entityType, operation, data);
    }
    
    // Escribir en localStorage (como fallback o fuente principal)
    if (localStorageUpdater) {
      localStorageUpdater(data);
      console.log(`✅ ${operation} successful in localStorage for ${entityType}`);
      return true;
    }
    
    return false;
  };

  return {
    readData,
    writeData,
    supabaseConnected
  };
};
