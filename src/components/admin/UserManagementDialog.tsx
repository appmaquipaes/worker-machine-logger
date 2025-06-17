
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import { Usuario, loadUsers, saveUsers } from '@/models/Usuarios';
import UserForm from './user-management/UserForm';
import UserList from './user-management/UserList';

interface UserManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsersUpdated: () => void;
}

const UserManagementDialog: React.FC<UserManagementDialogProps> = ({
  open,
  onOpenChange,
  onUsersUpdated
}) => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Operador' as 'Administrador' | 'Operador' | 'Supervisor',
    password: '',
    isActive: true
  });

  useEffect(() => {
    if (open) {
      loadUsersData();
    }
  }, [open]);

  const loadUsersData = () => {
    const loadedUsers = loadUsers();
    setUsers(loadedUsers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Por favor completa todos los campos obligatorios');
      return;
    }

    if (editingUser) {
      // Editar usuario existente
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      );
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      toast.success('Usuario actualizado exitosamente');
    } else {
      // Crear nuevo usuario
      const newUser: Usuario = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date()
      };
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      saveUsers(updatedUsers);
      toast.success('Usuario creado exitosamente');
    }

    resetForm();
    onUsersUpdated();
  };

  const handleEdit = (user: Usuario) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: user.password,
      isActive: user.isActive
    });
  };

  const handleDelete = (userId: string) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
    toast.success('Usuario eliminado exitosamente');
    onUsersUpdated();
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Operador',
      password: '',
      isActive: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-6 w-6" />
            Gestión de Usuarios
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserForm
            editingUser={editingUser}
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementDialog;
