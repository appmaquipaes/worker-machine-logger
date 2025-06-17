
import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadUsers } from '@/models/Usuarios';
import { loadClientes } from '@/models/Clientes';
import { loadMaquinas } from '@/models/Maquinas';
import { loadProveedores } from '@/models/Proveedores';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';
import { loadMateriales } from '@/models/Materiales';
import { toast } from 'sonner';

interface AdminDataState {
  users: any[];
  clients: any[];
  machines: any[];
  providers: any[];
  inventory: any[];
  materials: any[];
}

interface AdminDataStats {
  totalUsers: number;
  activeUsers: number;
  totalClients: number;
  totalMachines: number;
  activeMachines: number;
  totalProviders: number;
  totalInventoryItems: number;
  totalMaterials: number;
  lowStockItems: number;
}

export const useAdminData = () => {
  const [data, setData] = useState<AdminDataState>({
    users: [],
    clients: [],
    machines: [],
    providers: [],
    inventory: [],
    materials: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funciones de carga individuales para mejor granularidad
  const loadUserData = useCallback(async () => {
    try {
      const users = await loadUsers();
      setData(prev => ({ ...prev, users }));
    } catch (error) {
      console.error('Error loading users:', error);
      throw new Error('Error al cargar usuarios');
    }
  }, []);

  const loadClientData = useCallback(async () => {
    try {
      const clients = await loadClientes();
      setData(prev => ({ ...prev, clients }));
    } catch (error) {
      console.error('Error loading clients:', error);
      throw new Error('Error al cargar clientes');
    }
  }, []);

  const loadMachineData = useCallback(async () => {
    try {
      const machines = await loadMaquinas();
      setData(prev => ({ ...prev, machines }));
    } catch (error) {
      console.error('Error loading machines:', error);
      throw new Error('Error al cargar máquinas');
    }
  }, []);

  const loadProviderData = useCallback(async () => {
    try {
      const providers = await loadProveedores();
      setData(prev => ({ ...prev, providers }));
    } catch (error) {
      console.error('Error loading providers:', error);
      throw new Error('Error al cargar proveedores');
    }
  }, []);

  const loadInventoryData = useCallback(async () => {
    try {
      const inventory = await loadInventarioAcopio();
      setData(prev => ({ ...prev, inventory }));
    } catch (error) {
      console.error('Error loading inventory:', error);
      throw new Error('Error al cargar inventario');
    }
  }, []);

  const loadMaterialData = useCallback(async () => {
    try {
      const materials = await loadMateriales();
      setData(prev => ({ ...prev, materials }));
    } catch (error) {
      console.error('Error loading materials:', error);
      throw new Error('Error al cargar materiales');
    }
  }, []);

  // Carga inicial de todos los datos
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo con mejor manejo de errores
      await Promise.allSettled([
        loadUserData(),
        loadClientData(),
        loadMachineData(),
        loadProviderData(),
        loadInventoryData(),
        loadMaterialData()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      const errorMessage = 'Error al cargar datos. Por favor, intenta nuevamente.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [loadUserData, loadClientData, loadMachineData, loadProviderData, loadInventoryData, loadMaterialData]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Estadísticas optimizadas con memoización
  const stats = useMemo<AdminDataStats>(() => ({
    totalUsers: data.users.length,
    activeUsers: data.users.filter((user: any) => user.isActive).length,
    totalClients: data.clients.length,
    totalMachines: data.machines.length,
    activeMachines: data.machines.filter((machine: any) => machine.status === 'Activa').length,
    totalProviders: data.providers.length,
    totalInventoryItems: data.inventory.length,
    totalMaterials: data.materials.length,
    lowStockItems: data.inventory.filter((item: any) => item.cantidad < (item.stockMinimo || 0)).length
  }), [data]);

  // Funciones de actualización específicas
  const refreshSpecificData = useCallback(async (dataType: keyof AdminDataState) => {
    try {
      setLoading(true);
      switch (dataType) {
        case 'users':
          await loadUserData();
          break;
        case 'clients':
          await loadClientData();
          break;
        case 'machines':
          await loadMachineData();
          break;
        case 'providers':
          await loadProviderData();
          break;
        case 'inventory':
          await loadInventoryData();
          break;
        case 'materials':
          await loadMaterialData();
          break;
      }
    } catch (error) {
      console.error(`Error refreshing ${dataType}:`, error);
      toast.error(`Error al actualizar ${dataType}`);
    } finally {
      setLoading(false);
    }
  }, [loadUserData, loadClientData, loadMachineData, loadProviderData, loadInventoryData, loadMaterialData]);

  return {
    ...data,
    stats,
    loading,
    error,
    refreshData: loadAllData,
    refreshSpecificData
  };
};
