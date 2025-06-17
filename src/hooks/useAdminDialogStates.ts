
import { useState, useCallback } from 'react';

export const useAdminDialogStates = () => {
  // Estados para todos los diálogos de administración
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);
  const [isMachineDialogOpen, setIsMachineDialogOpen] = useState(false);
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [isInventoryDialogOpen, setIsInventoryDialogOpen] = useState(false);
  const [isMaterialDialogOpen, setIsMaterialDialogOpen] = useState(false);

  // Handlers optimizados para abrir diálogos
  const handleOpenUserDialog = useCallback(() => {
    setIsUserDialogOpen(true);
  }, []);

  const handleOpenClientDialog = useCallback(() => {
    setIsClientDialogOpen(true);
  }, []);

  const handleOpenMachineDialog = useCallback(() => {
    setIsMachineDialogOpen(true);
  }, []);

  const handleOpenProviderDialog = useCallback(() => {
    setIsProviderDialogOpen(true);
  }, []);

  const handleOpenInventoryDialog = useCallback(() => {
    setIsInventoryDialogOpen(true);
  }, []);

  const handleOpenMaterialDialog = useCallback(() => {
    setIsMaterialDialogOpen(true);
  }, []);

  // Agrupar estados y setters para facilitar el paso de props
  const dialogStates = {
    isUserDialogOpen,
    isClientDialogOpen,
    isMachineDialogOpen,
    isProviderDialogOpen,
    isInventoryDialogOpen,
    isMaterialDialogOpen,
  };

  const dialogSetters = {
    setIsUserDialogOpen,
    setIsClientDialogOpen,
    setIsMachineDialogOpen,
    setIsProviderDialogOpen,
    setIsInventoryDialogOpen,
    setIsMaterialDialogOpen,
  };

  const dialogHandlers = {
    handleOpenUserDialog,
    handleOpenClientDialog,
    handleOpenMachineDialog,
    handleOpenProviderDialog,
    handleOpenInventoryDialog,
    handleOpenMaterialDialog,
  };

  return {
    dialogStates,
    dialogSetters,
    dialogHandlers,
  };
};
