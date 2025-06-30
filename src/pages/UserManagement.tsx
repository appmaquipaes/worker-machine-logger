
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { useEnhancedUserManager } from '@/hooks/useEnhancedUserManager';
import { toast } from "sonner";
import UserManagementHeader from '@/components/user-management/UserManagementHeader';
import UserStatsCards from '@/components/user-management/UserStatsCards';
import UsersTable from '@/components/user-management/UsersTable';
import MachineAssignmentDialog from '@/components/user-management/MachineAssignmentDialog';
import ViewMachinesDialog from '@/components/user-management/ViewMachinesDialog';
import UserCommissionDialog from '@/components/UserCommissionDialog';
import UserTripCommissionDialog from '@/components/UserTripCommissionDialog';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor';
  assignedMachines?: string[];
  comisionPorHora?: number;
  comisionPorViaje?: number;
};

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const { machines } = useMachine();
  const navigate = useNavigate();
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
  
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadUsers();
  }, []);

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

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <UserManagementHeader />
      <UserStatsCards users={users} />
      <UsersTable
        users={users}
        currentUser={user}
        machines={machines}
        onEditMachines={handleEditMachines}
        onEditCommission={handleEditCommission}
        onEditTripCommission={handleEditTripCommission}
        onViewMachines={handleViewMachines}
        onRemoveUser={handleRemoveUser}
      />

      <MachineAssignmentDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={editingUser}
        machines={machines}
        selectedMachines={selectedMachines}
        onMachineToggle={handleMachineToggle}
        onSave={handleSaveMachines}
      />

      <ViewMachinesDialog
        isOpen={isViewMachinesOpen}
        onClose={() => setIsViewMachinesOpen(false)}
        user={viewMachinesUser}
        machines={machines}
      />

      {commissionUser && (
        <UserCommissionDialog
          isOpen={isCommissionDialogOpen}
          onClose={() => {
            setIsCommissionDialogOpen(false);
            setCommissionUser(null);
          }}
          user={commissionUser}
          onSave={handleSaveCommission}
        />
      )}

      {tripCommissionUser && (
        <UserTripCommissionDialog
          isOpen={isTripCommissionDialogOpen}
          onClose={() => {
            setIsTripCommissionDialogOpen(false);
            setTripCommissionUser(null);
          }}
          user={tripCommissionUser}
          onSave={handleSaveTripCommission}
        />
      )}
    </div>
  );
};

export default UserManagement;
