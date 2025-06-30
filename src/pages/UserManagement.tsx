
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";
import { useUserManagementLogic } from '@/hooks/useUserManagementLogic';
import UserManagementHeader from '@/components/user-management/UserManagementHeader';
import UserStatsCards from '@/components/user-management/UserStatsCards';
import UsersTable from '@/components/user-management/UsersTable';
import MachineAssignmentDialog from '@/components/user-management/MachineAssignmentDialog';
import ViewMachinesDialog from '@/components/user-management/ViewMachinesDialog';
import UserCommissionDialog from '@/components/UserCommissionDialog';
import UserTripCommissionDialog from '@/components/UserTripCommissionDialog';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const {
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
    setIsEditDialogOpen,
    setEditingUser,
    setIsCommissionDialogOpen,
    setCommissionUser,
    setIsTripCommissionDialogOpen,
    setTripCommissionUser,
    setIsViewMachinesOpen,
    setViewMachinesUser
  } = useUserManagementLogic();
  
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
