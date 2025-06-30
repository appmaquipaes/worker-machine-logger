
import React, { createContext, useContext, useEffect } from 'react';
import { useEnhancedClientManager } from '@/hooks/useEnhancedClientManager';
import { useEnhancedFincaManager } from '@/hooks/useEnhancedFincaManager';
import { Cliente } from '@/models/Clientes';
import { Finca } from '@/models/Fincas';

type ClientFincaContextType = {
  // Clientes
  clientes: Cliente[];
  isLoadingClientes: boolean;
  addCliente: (clienteData: Omit<Cliente, 'id' | 'fecha_registro'>) => Promise<boolean>;
  updateCliente: (id: string, updatedCliente: Partial<Cliente>) => Promise<boolean>;
  deleteCliente: (id: string) => Promise<boolean>;
  
  // Fincas
  fincas: Finca[];
  isLoadingFincas: boolean;
  addFinca: (fincaData: Omit<Finca, 'id' | 'fecha_registro'>) => Promise<boolean>;
  updateFinca: (id: string, updatedFinca: Partial<Finca>) => Promise<boolean>;
  deleteFinca: (id: string) => Promise<boolean>;
  getFincasByCliente: (clienteId: string) => Finca[];
  
  // Utilidades
  getClienteByName: (nombre: string) => Cliente | undefined;
};

const ClientFincaContext = createContext<ClientFincaContextType | undefined>(undefined);

export const useClientFinca = () => {
  const context = useContext(ClientFincaContext);
  if (!context) {
    throw new Error('useClientFinca debe ser utilizado dentro de un ClientFincaProvider');
  }
  return context;
};

export const ClientFincaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    clientes,
    isLoading: isLoadingClientes,
    loadClientes,
    addCliente: enhancedAddCliente,
    updateCliente: enhancedUpdateCliente,
    deleteCliente: enhancedDeleteCliente
  } = useEnhancedClientManager();

  const {
    fincas,
    isLoading: isLoadingFincas,
    loadFincas,
    addFinca: enhancedAddFinca,
    updateFinca: enhancedUpdateFinca,
    deleteFinca: enhancedDeleteFinca,
    getFincasByCliente
  } = useEnhancedFincaManager();

  useEffect(() => {
    loadClientes();
    loadFincas();
  }, []);

  const addCliente = async (clienteData: Omit<Cliente, 'id' | 'fecha_registro'>) => {
    return await enhancedAddCliente(clienteData);
  };

  const updateCliente = async (id: string, updatedCliente: Partial<Cliente>) => {
    return await enhancedUpdateCliente(id, updatedCliente);
  };

  const deleteCliente = async (id: string) => {
    return await enhancedDeleteCliente(id);
  };

  const addFinca = async (fincaData: Omit<Finca, 'id' | 'fecha_registro'>) => {
    return await enhancedAddFinca(fincaData);
  };

  const updateFinca = async (id: string, updatedFinca: Partial<Finca>) => {
    return await enhancedUpdateFinca(id, updatedFinca);
  };

  const deleteFinca = async (id: string) => {
    return await enhancedDeleteFinca(id);
  };

  const getClienteByName = (nombre: string): Cliente | undefined => {
    return clientes.find(cliente => 
      (cliente.nombre_cliente === nombre || cliente.nombre === nombre) && cliente.activo
    );
  };

  const value = {
    // Clientes
    clientes,
    isLoadingClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    
    // Fincas
    fincas,
    isLoadingFincas,
    addFinca,
    updateFinca,
    deleteFinca,
    getFincasByCliente,
    
    // Utilidades
    getClienteByName
  };

  return (
    <ClientFincaContext.Provider value={value}>
      {children}
    </ClientFincaContext.Provider>
  );
};
