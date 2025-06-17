
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { toast } from "sonner";
import UserCommissionDialog from '@/components/UserCommissionDialog';
import UserManagementHeader from '@/components/user-management/UserManagementHeader';
import UserManagementStats from '@/components/user-management/UserManagementStats';
import UserManagementTable from '@/components/user-management/UserManagementTable';
import UserMachineAssignmentDialog from '@/components/user-management/UserMachineAssignmentDialog';
import UserViewMachinesDialog from '@/components/user-management/UserViewMachinesDialog';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador';
  assignedMachines?: string[];
  comisionPorHora?: number;
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
  const [viewMachinesUser, setViewMachinesUser] = useState<User | null>(null);
  const [isViewMachinesOpen, setIsViewMachinesOpen] = useState(false);
  
  // Redirigir si no hay un usuario o no es administrador
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
    const loadUsers = () => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const usersWithoutPassword = storedUsers.map(
        ({ password, ...userWithoutPassword }: any) => userWithoutPassword
      );
      setUsers(usersWithoutPassword);
    };
    
    loadUsers();
  }, []);

  const handleRemoveUser = (id: string) => {
    if (id === user?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }
    
    const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = currentUsers.filter((u: any) => u.id !== id);
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    const usersWithoutPassword = updatedUsers.map(
      ({ password, ...userWithoutPassword }: any) => userWithoutPassword
    );
    setUsers(usersWithoutPassword);
    
    toast.success('Usuario eliminado correctamente');
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

  const handleSaveCommission = (userId: string, commission: number) => {
    // Actualizar en localStorage
    const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = currentUsers.map((u: any) => 
      u.id === userId 
        ? { ...u, comisionPorHora: commission }
        : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Actualizar estado local
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, comisionPorHora: commission }
        : u
    ));
  };

  const handleViewMachines = (userToView: User) => {
    setViewMachinesUser(userToView);
    setIsViewMachinesOpen(true);
  };

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <UserManagementHeader />

      <UserManagementStats
        totalUsers={users.length}
        totalOperators={users.filter(u => u.role === 'Operador').length}
        totalAdmins={users.filter(u => u.role === 'Administrador').length}
      />

      <UserManagementTable
        users={users}
        currentUserId={user.id}
        onEditMachines={handleEditMachines}
        onEditCommission={handleEditCommission}
        onViewMachines={handleViewMachines}
        onRemoveUser={handleRemoveUser}
      />

      <UserMachineAssignmentDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        editingUser={editingUser}
        machines={machines}
        selectedMachines={selectedMachines}
        onMachineToggle={handleMachineToggle}
        onSave={handleSaveMachines}
      />

      <UserViewMachinesDialog
        isOpen={isViewMachinesOpen}
        onClose={() => setIsViewMachinesOpen(false)}
        viewMachinesUser={viewMachinesUser}
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
    </div>
  );
};

export default UserManagement;
