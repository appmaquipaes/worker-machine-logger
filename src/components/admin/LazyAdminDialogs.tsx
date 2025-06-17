
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
            isOpen={isUserDialogOpen}
            onClose={() => setIsUserDialogOpen(false)}
            onDataUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isClientDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <ClientManagementDialog
            isOpen={isClientDialogOpen}
            onClose={() => setIsClientDialogOpen(false)}
            onDataUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isMachineDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <MachineManagementDialog
            isOpen={isMachineDialogOpen}
            onClose={() => setIsMachineDialogOpen(false)}
            onDataUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isProviderDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <ProviderManagementDialog
            isOpen={isProviderDialogOpen}
            onClose={() => setIsProviderDialogOpen(false)}
            onDataUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isInventoryDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <InventoryManagementDialog
            isOpen={isInventoryDialogOpen}
            onClose={() => setIsInventoryDialogOpen(false)}
            onDataUpdated={onDataUpdated}
          />
        </Suspense>
      )}

      {isMaterialDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <MaterialManagementDialog
            isOpen={isMaterialDialogOpen}
            onClose={() => setIsMaterialDialogOpen(false)}
            onDataUpdated={onDataUpdated}
          />
        </Suspense>
      )}
    </>
  );
};

export default LazyAdminDialogs;
