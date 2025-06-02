import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, UserPlus, ArrowLeft, Settings } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador';
  assignedMachines?: string[];
};

const UserManagement: React.FC = () => {
  const { user, updateUserMachines } = useAuth();
  const { machines } = useMachine();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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

  // Cargar usuarios del localStorage
  useEffect(() => {
    const loadUsers = () => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      // Eliminar la contraseña antes de guardar en el estado
      const usersWithoutPassword = storedUsers.map(
        ({ password, ...userWithoutPassword }: any) => userWithoutPassword
      );
      setUsers(usersWithoutPassword);
    };
    
    loadUsers();
  }, []);

  const handleRemoveUser = (id: string) => {
    // No permitir eliminar al usuario actual
    if (id === user?.id) {
      toast.error('No puedes eliminar tu propia cuenta');
      return;
    }
    
    // Obtener usuarios actuales
    const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = currentUsers.filter((u: any) => u.id !== id);
    
    // Actualizar localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Actualizar estado
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
      // Actualizar el estado local
      setUsers(prev => prev.map(u => 
        u.id === editingUser.id 
          ? { ...u, assignedMachines: selectedMachines }
          : u
      ));
      setIsEditDialogOpen(false);
      setEditingUser(null);
    }
  };

  const getMachineNames = (machineIds: string[] = []) => {
    return machineIds
      .map(id => machines.find(m => m.id === id)?.name)
      .filter(Boolean)
      .join(', ') || 'Ninguna';
  };

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
          <Button 
            variant="back" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Administra los usuarios del sistema y sus máquinas asignadas
        </p>
      </div>

      <div className="mb-6">
        <Button onClick={() => navigate('/register')}>
          <UserPlus className="mr-2 h-4 w-4" />
          Registrar Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Usuarios</CardTitle>
          <CardDescription>
            Usuarios registrados en el sistema con sus máquinas asignadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <div className="rounded-md border overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Máquinas Asignadas</TableHead>
                    <TableHead className="w-32">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          u.role === 'Administrador' 
                            ? 'bg-primary text-primary-foreground' 
                            : u.role === 'Operador'
                            ? 'bg-blue-500 text-white'
                            : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {u.role}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <div className="truncate" title={getMachineNames(u.assignedMachines)}>
                          {u.role === 'Operador' ? getMachineNames(u.assignedMachines) : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {u.role === 'Operador' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditMachines(u)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                disabled={u.id === user.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente al usuario {u.name}.
                                  Los reportes asociados a este usuario seguirán existiendo.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveUser(u.id)}
                                  className="bg-destructive text-destructive-foreground"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No hay usuarios registrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para editar máquinas asignadas */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Máquinas Asignadas</DialogTitle>
            <DialogDescription>
              Selecciona las máquinas para el operador {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-60 overflow-y-auto">
            {machines.length > 0 ? (
              <div className="space-y-3">
                {machines.map((machine) => (
                  <div key={machine.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`edit-${machine.id}`}
                      checked={selectedMachines.includes(machine.id)}
                      onCheckedChange={() => handleMachineToggle(machine.id)}
                    />
                    <Label htmlFor={`edit-${machine.id}`} className="flex-1 cursor-pointer">
                      <span className="font-medium">{machine.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({machine.type}) {machine.plate && `- ${machine.plate}`}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay máquinas disponibles para asignar
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveMachines}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
