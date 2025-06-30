
import React, { createContext, useContext, useEffect } from 'react';
import { useDataSourceManager } from '@/hooks/useDataSourceManager';

type DataSourceContextType = {
  isOnline: boolean;
  supabaseConnected: boolean;
  getEffectiveDataSource: (entityType: 'users' | 'machines' | 'reports' | 'clients' | 'fincas' | 'ventas') => 'supabase' | 'localStorage' | 'offline';
  markForSync: (entityType: string, operation: 'create' | 'update' | 'delete', data: any) => void;
  processSyncQueue: () => Promise<void>;
};

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

export const useDataSource = () => {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource debe ser utilizado dentro de un DataSourceProvider');
  }
  return context;
};

export const DataSourceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    isOnline,
    supabaseConnected,
    getEffectiveDataSource,
    markForSync,
    processSyncQueue
  } = useDataSourceManager();

  // Procesar cola de sincronización cuando se restablezca la conexión
  useEffect(() => {
    if (supabaseConnected) {
      processSyncQueue();
    }
  }, [supabaseConnected]);

  const value = {
    isOnline,
    supabaseConnected,
    getEffectiveDataSource,
    markForSync,
    processSyncQueue,
  };

  return (
    <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>
  );
};
