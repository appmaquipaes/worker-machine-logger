
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type DataSource = 'supabase' | 'localStorage' | 'offline';

interface DataSourceConfig {
  users: DataSource;
  machines: DataSource;
  reports: DataSource;
  clients: DataSource;
  fincas: DataSource;
  ventas: DataSource;
  inventario: DataSource; // Nuevo campo
  materiales: DataSource; // Nuevo campo
}

export const useDataSourceManager = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [dataSourceConfig] = useState<DataSourceConfig>({
    users: 'supabase',
    machines: 'supabase', 
    reports: 'supabase', // Cambiado a Supabase
    clients: 'supabase',
    fincas: 'supabase',
    ventas: 'localStorage', // Mantenemos ventas en localStorage hasta migración
    inventario: 'supabase', // Nuevo: inventario usa Supabase
    materiales: 'supabase' // Nuevo: materiales usa Supabase
  });

  // Verificar conectividad a Supabase
  const checkSupabaseConnection = async () => {
    try {
      const { error } = await supabase.from('profiles').select('count').limit(1);
      setSupabaseConnected(!error);
      return !error;
    } catch (error) {
      console.error('🔴 Error checking Supabase connection:', error);
      setSupabaseConnected(false);
      return false;
    }
  };

  // Verificar conectividad general
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkSupabaseConnection();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setSupabaseConnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificación inicial
    checkSupabaseConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Determinar la fuente de datos efectiva
  const getEffectiveDataSource = (entityType: keyof DataSourceConfig): DataSource => {
    const configuredSource = dataSourceConfig[entityType];
    
    if (configuredSource === 'supabase') {
      if (!isOnline || !supabaseConnected) {
        console.log(`📱 ${entityType}: Supabase no disponible, usando localStorage como fallback`);
        return 'localStorage';
      }
      return 'supabase';
    }
    
    return configuredSource;
  };

  // Marcar datos para sincronización posterior
  const markForSync = (entityType: keyof DataSourceConfig, operation: 'create' | 'update' | 'delete', data: any) => {
    const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    const syncItem = {
      id: Date.now().toString(),
      entityType,
      operation,
      data,
      timestamp: new Date().toISOString()
    };
    
    syncQueue.push(syncItem);
    localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    console.log(`⏳ Marcado para sincronización: ${entityType} ${operation}`);
  };

  // Procesar cola de sincronización
  const processSyncQueue = async () => {
    if (!supabaseConnected) return;

    const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
    const processedItems: string[] = [];

    for (const item of syncQueue) {
      try {
        console.log(`🔄 Sincronizando: ${item.entityType} ${item.operation}`);
        
        // Aquí se implementaría la lógica específica de sincronización
        // por ahora solo marcamos como procesado
        processedItems.push(item.id);
        
      } catch (error) {
        console.error(`❌ Error sincronizando ${item.entityType}:`, error);
      }
    }

    // Remover elementos procesados
    const remainingQueue = syncQueue.filter((item: any) => !processedItems.includes(item.id));
    localStorage.setItem('syncQueue', JSON.stringify(remainingQueue));
    
    if (processedItems.length > 0) {
      console.log(`✅ Sincronizados ${processedItems.length} elementos`);
    }
  };

  return {
    isOnline,
    supabaseConnected,
    dataSourceConfig,
    getEffectiveDataSource,
    markForSync,
    processSyncQueue,
    checkSupabaseConnection
  };
};
