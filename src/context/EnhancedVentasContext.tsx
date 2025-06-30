
import React, { createContext, useContext, useEffect } from 'react';
import { useEnhancedVentasManager } from '@/hooks/useEnhancedVentasManager';
import { Venta } from '@/types/venta';

type VentasContextType = {
  ventas: Venta[];
  isLoading: boolean;
  addVenta: (ventaData: Omit<Venta, 'id'>) => Promise<boolean>;
  updateVenta: (id: string, updatedVenta: Partial<Venta>) => Promise<boolean>;
  deleteVenta: (id: string) => Promise<boolean>;
  reloadVentas: () => Promise<void>;
};

const EnhancedVentasContext = createContext<VentasContextType | undefined>(undefined);

export const useEnhancedVentas = () => {
  const context = useContext(EnhancedVentasContext);
  if (!context) {
    throw new Error('useEnhancedVentas debe ser utilizado dentro de un EnhancedVentasProvider');
  }
  return context;
};

export const EnhancedVentasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    ventas,
    isLoading,
    loadVentas,
    addVenta: enhancedAddVenta,
    updateVenta: enhancedUpdateVenta,
    deleteVenta: enhancedDeleteVenta
  } = useEnhancedVentasManager();

  useEffect(() => {
    loadVentas();
  }, []);

  const addVenta = async (ventaData: Omit<Venta, 'id'>) => {
    const success = await enhancedAddVenta(ventaData);
    if (success) {
      await loadVentas(); // Recargar para sincronizar
    }
    return success;
  };

  const updateVenta = async (id: string, updatedVenta: Partial<Venta>) => {
    return await enhancedUpdateVenta(id, updatedVenta);
  };

  const deleteVenta = async (id: string) => {
    return await enhancedDeleteVenta(id);
  };

  const reloadVentas = async () => {
    await loadVentas();
  };

  const value = {
    ventas,
    isLoading,
    addVenta,
    updateVenta,
    deleteVenta,
    reloadVentas
  };

  return (
    <EnhancedVentasContext.Provider value={value}>
      {children}
    </EnhancedVentasContext.Provider>
  );
};
