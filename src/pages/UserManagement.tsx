import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { supabase } from '@/integrations/supabase/client';
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
  const { user, updateUserMachines } = useAuth();
  const { machines } = useMachine();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
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
    const loadUsers = async () => {
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Error loading users from Supabase:', error);
          // Fallback to localStorage
          const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const usersWithoutPassword = storedUsers.map(
            ({ password, ...userWithoutPassword }: any) => ({
              ...userWithoutPassword,
              assignedMachines: userWithoutPassword.assignedMachines || []
            })
          );
          setUsers(usersWithoutPassword);
        } else {
          const mappedUsers = profiles?.map(profile => ({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            assignedMachines: profile.assigned_machines || [],
            comisionPorHora: profile.comision_por_hora,
            comisionPorViaje: profile.comision_por_viaje
          })) || [];
          setUsers(mappedUsers);
        }
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    
    loadUsers();
  }, []);

  const handleRemoveUser = async (id: string) => {
    if (id === user?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }
    
    try {
      // Try to delete from Supabase first
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting from Supabase:', error);
        // Fallback to localStorage
        const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = currentUsers.filter((u: any) => u.id !== id);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
      
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success('Usuario eliminado correctamente');
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
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, assignedMachines: selectedMachines }
          : u
      ));
      setIsEditDialogOpen(false);
      setEditingUser(null);
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
      const { error } = await supabase
        .from('profiles')
        .update({ comision_por_hora: commission })
        .eq('id', userId);
      
      if (error) {
        // Fallback to localStorage
        const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = currentUsers.map((u: any) => 
          u.id === userId 
            ? { ...u, comisionPorHora: commission }
            : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
      
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, comisionPorHora: commission }
          : u
      ));
    } catch (error) {
      console.error('Error saving commission:', error);
    }
  };

  const handleSaveTripCommission = async (userId: string, commission: number) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ comision_por_viaje: commission })
        .eq('id', userId);
      
      if (error) {
        // Fallback to localStorage
        const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = currentUsers.map((u: any) => 
          u.id === userId 
            ? { ...u, comisionPorViaje: commission }
            : u
        );
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
      
      setUsers(prev => prev.map(u => 
        u.id === userId 
          ? { ...u, comisionPorViaje: commission }
          : u
      ));
    } catch (error) {
      console.error('Error saving trip commission:', error);
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
