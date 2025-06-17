
import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy loading de diálogos para mejor performance
const UserManagementDialog = lazy(() => import('./UserManagementDialog'));
const ClientManagementDialog = lazy(() => import('./ClientManagementDialog'));
const MachineManagementDialog = lazy(() => import('./MachineManagementDialog'));
const ProviderManagementDialog = lazy(() => import('./ProviderManagementDialog'));
const InventoryManagementDialog = lazy(() => import('./InventoryManagementDialog'));
const MaterialManagementDialog = lazy(() => import('./MaterialManagementDialog'));

interface LazyAdminDialogsProps {
  // User Management
  isUserDialogOpen: boolean;
  setIsUserDialogOpen: (open: boolean) => void;
  
  // Client Management
  isClientDialogOpen: boolean;
  setIsClientDialogOpen: (open: boolean) => void;
  
  // Machine Management
  isMachineDialogOpen: boolean;
  setIsMachineDialogOpen: (open: boolean) => void;
  
  // Provider Management
  isProviderDialogOpen: boolean;
  setIsProviderDialogOpen: (open: boolean) => void;
  
  // Inventory Management
  isInventoryDialogOpen: boolean;
  setIsInventoryDialogOpen: (open: boolean) => void;
  
  // Material Management
  isMaterialDialogOpen: boolean;
  setIsMaterialDialogOpen: (open: boolean) => void;
  
  // Callback para actualizar datos
  onDataUpdated: () => void;
}

const LazyAdminDialogs: React.FC<LazyAdminDialogsProps> = ({
  isUserDialogOpen,
  setIsUserDialogOpen,
  isClientDialogOpen,
  setIsClientDialogOpen,
  isMachineDialogOpen,
  setIsMachineDialogOpen,
  isProviderDialogOpen,
  setIsProviderDialogOpen,
  isInventoryDialogOpen,
  setIsInventoryDialogOpen,
  isMaterialDialogOpen,
  setIsMaterialDialogOpen,
  onDataUpdated
}) => {
  return (
    <>
      {isUserDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <UserManagementDialog
            open={isUserDialogOpen}
            onOpenChange={setIsUserDialogOpen}
            onUsersUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isClientDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <ClientManagementDialog
            open={isClientDialogOpen}
            onOpenChange={setIsClientDialogOpen}
            onClientsUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isMachineDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <MachineManagementDialog
            open={isMachineDialogOpen}
            onOpenChange={setIsMachineDialogOpen}
            onMachinesUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isProviderDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <ProviderManagementDialog
            open={isProviderDialogOpen}
            onOpenChange={setIsProviderDialogOpen}
            onProvidersUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isInventoryDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <InventoryManagementDialog
            open={isInventoryDialogOpen}
            onOpenChange={setIsInventoryDialogOpen}
            onInventoryUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isMaterialDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <MaterialManagementDialog
            open={isMaterialDialogOpen}
            onOpenChange={setIsMaterialDialogOpen}
            onMaterialsUpdated={onDataUpdated}
          />
        </Suspense>
      )}
    </>
  );
};

export default LazyAdminDialogs;
