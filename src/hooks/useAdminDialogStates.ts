
import { useState, useCallback } from 'react';

export const useAdminDialogStates = () => {
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isMachineDialogOpen, setIsMachineDialogOpen] = useState(false);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);

  const handleOpenUserDialog = useCallback(() => setIsUserDialogOpen(true), []);
  const handleOpenClientDialog = useCallback(() => setIsClientDialogOpen(true), []);
  const handleOpenMachineDialog = useCallback(() => setIsMachineDialogOpen(true), []);
  const handleOpenProviderDialog = useCallback(() => setIsProviderDialogOpen(true), []);
  const handleOpenInventoryDialog = useCallback(() => setIsInventoryDialogOpen(true), []);
  const handleOpenMaterialDialog = useCallback(() => setIsMaterialDialogOpen(true), []);

  return {
    dialogStates: {
      isUserDialogOpen,
      isClientDialogOpen,
      isMachineDialogOpen,
      isProviderDialogOpen,
      isInventoryDialogOpen,
      isMaterialDialogOpen
    },
    dialogSetters: {
      setIsUserDialogOpen,
      setIsClientDialogOpen,
      setIsMachineDialogOpen,
      setIsProviderDialogOpen,
      setIsInventoryDialogOpen,
      setIsMaterialDialogOpen
    },
    dialogHandlers: {
      handleOpenUserDialog,
      handleOpenClientDialog,
      handleOpenMachineDialog,
      handleOpenProviderDialog,
      handleOpenInventoryDialog,
      handleOpenMaterialDialog
    }
  };
};
