
import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load de los diálogos para mejor rendimiento
const UserManagementDialog = lazy(() => import('@/components/admin/UserManagementDialog'));
const ClientManagementDialog = lazy(() => import('@/components/admin/ClientManagementDialog'));
const MachineManagementDialog = lazy(() => import('@/components/admin/MachineManagementDialog'));
const ProviderManagementDialog = lazy(() => import('@/components/admin/ProviderManagementDialog'));
const InventoryManagementDialog = lazy(() => import('@/components/admin/InventoryManagementDialog'));
const MaterialManagementDialog = lazy(() => import('@/components/admin/MaterialManagementDialog'));

interface LazyAdminDialogsProps {
  isUserDialogOpen: boolean;
  isClientDialogOpen: boolean;
  isMachineDialogOpen: boolean;
  isProviderDialogOpen: boolean;
  isInventoryDialogOpen: boolean;
  isMaterialDialogOpen: boolean;
  setIsUserDialogOpen: (open: boolean) => void;
  setIsClientDialogOpen: (open: boolean) => void;
  setIsMachineDialogOpen: (open: boolean) => void;
  setIsProviderDialogOpen: (open: boolean) => void;
  setIsInventoryDialogOpen: (open: boolean) => void;
  setIsMaterialDialogOpen: (open: boolean) => void;
  onDataUpdated: () => void;
}

const DialogSkeleton = () => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
      <Skeleton className="h-6 w-48 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    </div>
  </div>
);

const LazyAdminDialogs: React.FC<LazyAdminDialogsProps> = ({
  isUserDialogOpen,
  isClientDialogOpen,
  isMachineDialogOpen,
  isProviderDialogOpen,
  isInventoryDialogOpen,
  isMaterialDialogOpen,
  setIsUserDialogOpen,
  setIsClientDialogOpen,
  setIsMachineDialogOpen,
  setIsProviderDialogOpen,
  setIsInventoryDialogOpen,
  setIsMaterialDialogOpen,
  onDataUpdated
}) => {
  return (
    <>
      {isUserDialogOpen && (
        <Suspense fallback={<DialogSkeleton />}>
          <UserManagementDialog 
            open={isUserDialogOpen} 
            onOpenChange={setIsUserDialogOpen} 
            onUsersUpdated={onDataUpdated} 
          />
        </Suspense>
      )}

      {isClientDialogOpen && (
        <Suspense fallback={<DialogSkeleton />}>
          <ClientManagementDialog 
            open={isClientDialogOpen} 
            onOpenChange={setIsClientDialogOpen} 
            onClientsUpdated={onDataUpdated} 
          />
        </Suspense>
      )}

      {isMachineDialogOpen && (
        <Suspense fallback={<DialogSkeleton />}>
          <MachineManagementDialog 
            open={isMachineDialogOpen} 
            onOpenChange={setIsMachineDialogOpen} 
            onMachinesUpdated={onDataUpdated} 
          />
        </Suspense>
      )}

      {isProviderDialogOpen && (
        <Suspense fallback={<DialogSkeleton />}>
          <ProviderManagementDialog 
            open={isProviderDialogOpen} 
            onOpenChange={setIsProviderDialogOpen} 
            onProvidersUpdated={onDataUpdated} 
          />
        </Suspense>
      )}

      {isInventoryDialogOpen && (
        <Suspense fallback={<DialogSkeleton />}>
          <InventoryManagementDialog 
            open={isInventoryDialogOpen} 
            onOpenChange={setIsInventoryDialogOpen} 
            onInventoryUpdated={onDataUpdated} 
          />
        </Suspense>
      )}

      {isMaterialDialogOpen && (
        <Suspense fallback={<DialogSkeleton />}>
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
