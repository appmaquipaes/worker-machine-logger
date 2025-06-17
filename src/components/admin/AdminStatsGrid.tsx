
import React, { useCallback } from 'react';
import { Users, Truck, Settings, Store, FileText } from 'lucide-react';
import OptimizedAdminStatsCard from './OptimizedAdminStatsCard';

interface AdminStatsGridProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalClients: number;
    totalMachines: number;
    activeMachines: number;
    totalProviders: number;
    totalInventoryItems: number;
    totalMaterials: number;
    lowStockItems: number;
  };
  loading: boolean;
  onOpenUserDialog: () => void;
  onOpenClientDialog: () => void;
  onOpenMachineDialog: () => void;
  onOpenProviderDialog: () => void;
  onOpenInventoryDialog: () => void;
  onOpenMaterialDialog: () => void;
}

const AdminStatsGrid: React.FC<AdminStatsGridProps> = ({
  stats,
  loading,
  onOpenUserDialog,
  onOpenClientDialog,
  onOpenMachineDialog,
  onOpenProviderDialog,
  onOpenInventoryDialog,
  onOpenMaterialDialog
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <OptimizedAdminStatsCard
        title="Usuarios"
        count={stats.totalUsers}
        description={`${stats.activeUsers} activos de ${stats.totalUsers} total`}
        icon={Users}
        buttonText="Administrar Usuarios"
        onButtonClick={onOpenUserDialog}
        trend={{ value: 12, isPositive: true }}
        isLoading={loading}
      />

      <OptimizedAdminStatsCard
        title="Clientes"
        count={stats.totalClients}
        description="Gestiona los clientes de la empresa"
        icon={Truck}
        buttonText="Administrar Clientes"
        onButtonClick={onOpenClientDialog}
        trend={{ value: 8, isPositive: true }}
        isLoading={loading}
      />

      <OptimizedAdminStatsCard
        title="Máquinas"
        count={stats.totalMachines}
        description={`${stats.activeMachines} activas de ${stats.totalMachines} total`}
        icon={Settings}
        buttonText="Administrar Máquinas"
        onButtonClick={onOpenMachineDialog}
        trend={{ value: 3, isPositive: false }}
        isLoading={loading}
      />

      <OptimizedAdminStatsCard
        title="Proveedores"
        count={stats.totalProviders}
        description="Gestiona los proveedores de la empresa"
        icon={Store}
        buttonText="Administrar Proveedores"
        onButtonClick={onOpenProviderDialog}
        isLoading={loading}
      />

      <OptimizedAdminStatsCard
        title="Inventario Acopio"
        count={stats.totalInventoryItems}
        description={`${stats.lowStockItems} con stock bajo`}
        icon={FileText}
        buttonText="Administrar Inventario"
        onButtonClick={onOpenInventoryDialog}
        trend={{ value: 15, isPositive: true }}
        isLoading={loading}
      />

      <OptimizedAdminStatsCard
        title="Materiales Volquetas"
        count={stats.totalMaterials}
        description="Gestiona los materiales de las volquetas"
        icon={FileText}
        buttonText="Administrar Materiales"
        onButtonClick={onOpenMaterialDialog}
        isLoading={loading}
      />
    </div>
  );
};

export default AdminStatsGrid;
