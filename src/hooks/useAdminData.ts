
import { useState, useEffect, useCallback, useMemo } from 'react';
import { loadUsers } from '@/models/Usuarios';
import { loadClientes } from '@/models/Clientes';
import { loadMaquinas } from '@/models/Maquinas';
import { loadProveedores } from '@/models/Proveedores';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';
import { loadMateriales } from '@/models/Materiales';
import { toast } from 'sonner';

export const useAdminData = () => {
  const [data, setData] = useState({
    users: [],
    clients: [],
    machines: [],
    providers: [],
    inventory: [],
    materials: []
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo para mejor rendimiento
      const [
        usersData,
        clientsData,
        machinesData,
        providersData,
        inventoryData,
        materialsData
      ] = await Promise.all([
        loadUsers(),
        loadClientes(),
        loadMaquinas(),
        loadProveedores(),
        loadInventarioAcopio(),
        loadMateriales()
      ]);

      setData({
        users: usersData,
        clients: clientsData,
        machines: machinesData,
        providers: providersData,
        inventory: inventoryData,
        materials: materialsData
      });
    } catch (error) {
      console.error('Error al cargar datos:', error);
      const errorMessage = 'Error al cargar datos. Por favor, intenta nuevamente.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoizar estadísticas calculadas
  const stats = useMemo(() => ({
    totalUsers: data.users.length,
    activeUsers: data.users.filter((user: any) => user.isActive).length,
    totalClients: data.clients.length,
    totalMachines: data.machines.length,
    activeMachines: data.machines.filter((machine: any) => machine.status === 'Activa').length,
    totalProviders: data.providers.length,
    totalInventoryItems: data.inventory.length,
    totalMaterials: data.materials.length,
    lowStockItems: data.inventory.filter((item: any) => item.cantidad < item.stockMinimo || 0).length
  }), [data]);

  return {
    ...data,
    stats,
    loading,
    error,
    refreshData: loadData
  };
};
