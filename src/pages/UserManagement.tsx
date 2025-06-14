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
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, UserPlus, ArrowLeft, Settings, DollarSign, Users, Eye } from 'lucide-react';
import UserCommissionDialog from '@/components/UserCommissionDialog';

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

  const getMachineNames = (machineIds: string[] = []) => {
    return machineIds
      .map(id => machines.find(m => m.id === id)?.name)
      .filter(Boolean)
      .join(', ') || 'Ninguna';
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Administrador':
        return 'default';
      case 'Operador':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                Gestión de Usuarios
              </h1>
              <p className="text-sm text-muted-foreground">
                Administra usuarios, máquinas asignadas y comisiones
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={() => navigate('/register')}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Nuevo Usuario
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Panel Admin
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Settings className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Operadores</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'Operador').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Administradores</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === 'Administrador').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Listado de Usuarios
          </CardTitle>
          <CardDescription>
            Usuarios registrados con sus configuraciones y permisos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Usuario</TableHead>
                    <TableHead className="font-semibold">Rol</TableHead>
                    <TableHead className="font-semibold">Máquinas</TableHead>
                    <TableHead className="font-semibold">Comisión/Hr</TableHead>
                    <TableHead className="font-semibold text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className="hover:bg-muted/30">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{u.name}</p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(u.role)}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="max-w-48">
                        {u.role === 'Operador' ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {u.assignedMachines?.length || 0} asignada(s)
                            </p>
                            {(u.assignedMachines?.length || 0) > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewMachines(u)}
                                className="h-6 px-2 text-xs"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Ver detalles
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {u.role === 'Operador' ? (
                          <div className="font-medium text-green-600">
                            ${(u.comisionPorHora || 0).toLocaleString()}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          {u.role === 'Operador' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditMachines(u)}
                                className="h-8 w-8 p-0"
                                title="Configurar máquinas"
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCommission(u)}
                                className="h-8 w-8 p-0"
                                title="Configurar comisión"
                              >
                                <DollarSign className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={u.id === user.id}
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                                title="Eliminar usuario"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción eliminará permanentemente al usuario <strong>{u.name}</strong>.
                                  Los reportes asociados seguirán existiendo, pero no se podrán asociar a este usuario.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleRemoveUser(u.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Eliminar Usuario
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
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No hay usuarios registrados
              </h3>
              <p className="text-muted-foreground mb-4">
                Comienza registrando el primer usuario del sistema
              </p>
              <Button onClick={() => navigate('/register')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Registrar Usuario
              </Button>
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

      {/* View Machines Dialog */}
      <Dialog open={isViewMachinesOpen} onOpenChange={setIsViewMachinesOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Máquinas Asignadas</DialogTitle>
            <DialogDescription>
              Máquinas asignadas al operador {viewMachinesUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {viewMachinesUser?.assignedMachines?.length ? (
              viewMachinesUser.assignedMachines.map((machineId) => {
                const machine = machines.find(m => m.id === machineId);
                return machine ? (
                  <div key={machineId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{machine.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {machine.type} {machine.plate && `- ${machine.plate}`}
                      </p>
                    </div>
                  </div>
                ) : null;
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hay máquinas asignadas
              </p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewMachinesOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
