
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useEnhancedUserManager } from '@/hooks/useEnhancedUserManager';
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor';
  assignedMachines?: string[];
  comisionPorHora?: number;
  comisionPorViaje?: number;
};

export const useUserManagementLogic = () => {
  const { user } = useAuth();
  const { machines } = useMachine();
  const {
    users,
    isLoading,
    loadUsers,
    updateUserMachines,
    updateUserCommission,
    updateUserTripCommission,
    deleteUser
  } = useEnhancedUserManager();
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [commissionUser, setCommissionUser] = useState<User | null>(null);
  const [isCommissionDialogOpen, setIsCommissionDialogOpen] = useState(false);
  const [tripCommissionUser, setTripCommissionUser] = useState<User | null>(null);
  const [isTripCommissionDialogOpen, setIsTripCommissionDialogOpen] = useState(false);
  const [viewMachinesUser, setViewMachinesUser] = useState<User | null>(null);
  const [isViewMachinesOpen, setIsViewMachinesOpen] = useState(false);

  const handleRemoveUser = async (id: string) => {
    if (id === user?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }
    
    try {
      const success = await deleteUser(id);
      if (success) {
        toast.success('Usuario eliminado correctamente');
      } else {
        toast.error('Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const handleEditMachines = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setSelectedMachines(userToEdit.assignedMachines || []);
    setIsEditDialogOpen(true);
  };

  const handleMachineToggle = (machineId: string) => {
    setSelectedMachines(prev => 
      prev.includes(machineId) 
        ? prev.filter(id => id !== machineId)
        : [...prev, machineId]
    );
  };

  const handleSaveMachines = async () => {
    if (!editingUser) return;
    
    const success = await updateUserMachines(editingUser.id, selectedMachines);
    if (success) {
      setIsEditDialogOpen(false);
      setEditingUser(null);
      toast.success('Máquinas asignadas actualizadas');
    } else {
      toast.error('Error al actualizar máquinas asignadas');
    }
  };

  const handleEditCommission = (userToEdit: User) => {
    setCommissionUser(userToEdit);
    setIsCommissionDialogOpen(true);
  };

  const handleEditTripCommission = (userToEdit: User) => {
    setTripCommissionUser(userToEdit);
    setIsTripCommissionDialogOpen(true);
  };

  const handleSaveCommission = async (userId: string, commission: number) => {
    try {
      const success = await updateUserCommission(userId, commission);
      if (success) {
        toast.success('Comisión por hora actualizada');
      } else {
        toast.error('Error al actualizar comisión');
      }
    } catch (error) {
      console.error('Error saving commission:', error);
      toast.error('Error al actualizar comisión');
    }
  };

  const handleSaveTripCommission = async (userId: string, commission: number) => {
    try {
      const success = await updateUserTripCommission(userId, commission);
      if (success) {
        toast.success('Comisión por viaje actualizada');
      } else {
        toast.error('Error al actualizar comisión por viaje');
      }
    } catch (error) {
      console.error('Error saving trip commission:', error);
      toast.error('Error al actualizar comisión por viaje');
    }
  };

  const handleViewMachines = (userToView: User) => {
    setViewMachinesUser(userToView);
    setIsViewMachinesOpen(true);
  };

  return {
    // State
    users,
    isLoading,
    machines,
    editingUser,
    selectedMachines,
    isEditDialogOpen,
    commissionUser,
    isCommissionDialogOpen,
    tripCommissionUser,
    isTripCommissionDialogOpen,
    viewMachinesUser,
    isViewMachinesOpen,
    
    // Actions
    loadUsers,
    handleRemoveUser,
    handleEditMachines,
    handleMachineToggle,
    handleSaveMachines,
    handleEditCommission,
    handleEditTripCommission,
    handleSaveCommission,
    handleSaveTripCommission,
    handleViewMachines,
    
    // Setters
    setIsEditDialogOpen,
    setEditingUser,
    setIsCommissionDialogOpen,
    setCommissionUser,
    setIsTripCommissionDialogOpen,
    setTripCommissionUser,
    setIsViewMachinesOpen,
    setViewMachinesUser
  };
};
