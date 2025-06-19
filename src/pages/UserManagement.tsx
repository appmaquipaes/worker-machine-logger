import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ArrowLeft, Plus, User, Edit, Trash2, Settings } from 'lucide-react';
import { StoredUser } from '@/types/auth';
import { getStoredUsers, setStoredUsers } from '@/utils/authStorage';
import { useMachine } from '@/context/MachineContext';
import MachineAssignment from '@/components/register/MachineAssignment';

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { machines } = useMachine();
  const [users, setUsers] = useState<StoredUser[]>([]);
  const [editingUser, setEditingUser] = useState<StoredUser | null>(null);
  const [showMachineDialog, setShowMachineDialog] = useState(false);
  const [selectedUserForMachines, setSelectedUserForMachines] = useState<StoredUser | null>(null);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'Administrador') {
      navigate('/dashboard');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  const loadUsers = () => {
    const storedUsers = getStoredUsers();
    setUsers(storedUsers.filter(u => u.id !== user?.id));
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = getStoredUsers().filter(u => u.id !== userId);
    setStoredUsers(updatedUsers);
    loadUsers();
    toast.success('Usuario eliminado exitosamente');
  };

  const handleEditMachines = (userToEdit: StoredUser) => {
    setSelectedUserForMachines(userToEdit);
    setSelectedMachines(userToEdit.assignedMachines || []);
    setShowMachineDialog(true);
  };

  const handleSaveMachineAssignment = () => {
    if (!selectedUserForMachines) return;
    
    const allUsers = getStoredUsers();
    const updatedUsers = allUsers.map(u => 
      u.id === selectedUserForMachines.id 
        ? { ...u, assignedMachines: selectedMachines }
        : u
    );
    
    setStoredUsers(updatedUsers);
    loadUsers();
    setShowMachineDialog(false);
    setSelectedUserForMachines(null);
    setSelectedMachines([]);
    toast.success('Máquinas asignadas actualizadas');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador': return 'bg-red-100 text-red-800';
      case 'Operador': return 'bg-blue-100 text-blue-800';
      case 'Trabajador': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || user.role !== 'Administrador') {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Usuarios
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 h-12 px-6 font-semibold bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 shadow-sm hover:scale-105 hover:shadow-md"
          >
            <ArrowLeft size={18} />
            Volver al Panel Admin
          </Button>
        </div>
      </div>

      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-800">Usuarios del Sistema</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Administra los usuarios y sus roles dentro del sistema.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Plus className="mr-2 h-5 w-5" />
                  Agregar Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader className="text-center">
                  <DialogTitle className="text-2xl font-bold text-slate-800">Agregar Nuevo Usuario</DialogTitle>
                  <DialogDescription className="text-base text-slate-600">
                    Crea una nueva cuenta de usuario para el sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                  <p className="text-sm text-gray-600">Formulario de registro disponible próximamente.</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((userItem) => (
              <Card key={userItem.id} className="shadow-md hover:shadow-lg transition-shadow duration-300 border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{userItem.name}</CardTitle>
                  <Settings className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500">
                    <p>
                      <User className="mr-2 inline-block h-4 w-4" />
                      {userItem.email}
                    </p>
                    <Badge className={`mt-2 ${getRoleColor(userItem.role)}`}>{userItem.role}</Badge>
                  </div>
                </CardContent>
                <div className="flex justify-end gap-2 p-4">
                  {userItem.role === 'Operador' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditMachines(userItem)}
                      className="text-xs"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Máquinas
                    </Button>
                  )}
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDeleteUser(userItem.id)}
                    className="text-xs"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showMachineDialog} onOpenChange={(open) => setShowMachineDialog(open)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Asignar Máquinas a Operador</DialogTitle>
            <DialogDescription>
              Selecciona las máquinas que serán asignadas al operador.
            </DialogDescription>
          </DialogHeader>
          {selectedUserForMachines && (
            <MachineAssignment
              initialMachines={selectedUserForMachines.assignedMachines || []}
              machines={machines}
              onMachinesChange={(machines) => setSelectedMachines(machines)}
            />
          )}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setShowMachineDialog(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveMachineAssignment}>
              Guardar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
