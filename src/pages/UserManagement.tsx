
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, UserPlus, ArrowLeft, Settings, DollarSign, Users, Eye, Truck } from 'lucide-react';
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

  const handleEditTripCommission = (userToEdit: User) => {
    setTripCommissionUser(userToEdit);
    setIsTripCommissionDialogOpen(true);
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

  const handleSaveTripCommission = (userId: string, commission: number) => {
    // Actualizar en localStorage
    const currentUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = currentUsers.map((u: any) => 
      u.id === userId 
        ? { ...u, comisionPorViaje: commission }
        : u
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // Actualizar estado local
    setUsers(prev => prev.map(u => 
      u.id === userId 
        ? { ...u, comisionPorViaje: commission }
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
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'Operador':
        return 'bg-green-600 text-white hover:bg-green-700';
      case 'Conductor':
        return 'bg-purple-600 text-white hover:bg-purple-700';
      default:
        return 'bg-slate-500 text-white hover:bg-slate-600';
    }
  };

  const isVehicleDriver = (role: string) => {
    return role === 'Conductor';
  };

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header Section with Corporate Gradient */}
      <div className="corporate-gradient rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                  Gestión de Usuarios
                </h1>
                <p className="text-blue-100 text-lg font-medium">
                  Administra usuarios, máquinas asignadas y comisiones
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/register')}
              className="bg-white text-blue-700 hover:bg-blue-50 font-semibold flex items-center gap-2 px-6 py-3 shadow-lg"
            >
              <UserPlus className="h-5 w-5" />
              Nuevo Usuario
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="bg-white/10 border-white text-white hover:bg-white hover:text-blue-700 font-semibold flex items-center gap-2 px-6 py-3 shadow-lg backdrop-blur-sm"
            >
              <ArrowLeft className="h-5 w-5" />
              Panel Admin
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Usuarios</p>
                <p className="text-3xl font-bold text-blue-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-600 rounded-xl">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Operadores</p>
                <p className="text-3xl font-bold text-green-900">
                  {users.filter(u => u.role === 'Operador').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-600 rounded-xl">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Conductores</p>
                <p className="text-3xl font-bold text-purple-900">
                  {users.filter(u => u.role === 'Conductor').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-100 border-yellow-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-600 rounded-xl">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-yellow-700 uppercase tracking-wide">Administradores</p>
                <p className="text-3xl font-bold text-yellow-900">
                  {users.filter(u => u.role === 'Administrador').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Users Table */}
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-slate-50 rounded-t-lg border-b">
          <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
            <Users className="h-6 w-6 text-blue-600" />
            Listado de Usuarios
          </CardTitle>
          <CardDescription className="text-slate-600 font-medium">
            Usuarios registrados con sus configuraciones y permisos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide">Usuario</TableHead>
                    <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide">Rol</TableHead>
                    <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide">Máquinas</TableHead>
                    <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide">Comisión</TableHead>
                    <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id} className="hover:bg-blue-50/30 transition-colors">
                      <TableCell className="py-4">
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-800 text-base">{u.name}</p>
                          <p className="text-sm text-slate-500 font-medium">{u.email}</p>
                        </div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <Badge className={`${getRoleBadgeVariant(u.role)} font-semibold px-3 py-1 text-sm`}>
                          {u.role}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="max-w-48 py-4">
                        {(u.role === 'Operador' || u.role === 'Conductor') ? (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-slate-700">
                              {u.assignedMachines?.length || 0} asignada(s)
                            </p>
                            {(u.assignedMachines?.length || 0) > 0 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewMachines(u)}
                                className="h-7 px-3 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Ver detalles
                              </Button>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 font-medium">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-4">
                        {u.role === 'Operador' ? (
                          <div className="font-bold text-green-700 text-base">
                            ${(u.comisionPorHora || 0).toLocaleString()}/hr
                          </div>
                        ) : u.role === 'Conductor' ? (
                          <div className="font-bold text-purple-700 text-base">
                            ${(u.comisionPorViaje || 0).toLocaleString()}/viaje
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400 font-medium">-</span>
                        )}
                      </TableCell>
                      
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-2">
                          {(u.role === 'Operador' || u.role === 'Conductor') && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditMachines(u)}
                              className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              title="Configurar máquinas"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          )}
                          {u.role === 'Operador' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditCommission(u)}
                              className="h-9 w-9 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
                              title="Configurar comisión por hora"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                          )}
                          {u.role === 'Conductor' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTripCommission(u)}
                              className="h-9 w-9 p-0 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
                              title="Configurar comisión por viaje"
                            >
                              <Truck className="h-4 w-4" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                disabled={u.id === user.id}
                                className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
                                  className="bg-red-600 text-white hover:bg-red-700"
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
            <div className="text-center py-16">
              <div className="p-4 bg-slate-50 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Users className="h-10 w-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">
                No hay usuarios registrados
              </h3>
              <p className="text-slate-500 mb-6 font-medium">
                Comienza registrando el primer usuario del sistema
              </p>
              <Button 
                onClick={() => navigate('/register')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Registrar Usuario
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Dialog para editar máquinas asignadas */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl bg-white shadow-2xl border-0 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center space-y-4 pb-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-slate-800">
                Editar Máquinas Asignadas
              </DialogTitle>
              <DialogDescription className="text-base text-slate-600 font-medium">
                Selecciona las máquinas para {editingUser?.role.toLowerCase()} <span className="font-bold text-slate-800">{editingUser?.name}</span>
              </DialogDescription>
            </div>
          </DialogHeader>
          
          <div className="py-4">
            <div className="max-h-96 overflow-y-auto pr-2">
              {machines.length > 0 ? (
                <div className="space-y-3">
                  {machines.map((machine) => (
                    <div 
                      key={machine.id} 
                      className="flex items-center space-x-3 p-4 rounded-lg border border-slate-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    >
                      <Checkbox
                        id={`edit-${machine.id}`}
                        checked={selectedMachines.includes(machine.id)}
                        onCheckedChange={() => handleMachineToggle(machine.id)}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label htmlFor={`edit-${machine.id}`} className="flex-1 cursor-pointer">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-800 text-base">{machine.name}</span>
                          <div className="text-sm text-slate-500 font-medium">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              {machine.type}
                              {machine.plate && <span className="ml-2 px-2 py-0.5 bg-slate-100 rounded text-xs">Placa: {machine.plate}</span>}
                            </span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium">
                    No hay máquinas disponibles para asignar
                  </p>
                </div>
              )}
            </div>

            {selectedMachines.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-bold text-blue-800 mb-2">
                  Máquinas seleccionadas: {selectedMachines.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedMachines.map(machineId => {
                    const machine = machines.find(m => m.id === machineId);
                    return machine ? (
                      <span key={machineId} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                        {machine.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3 pt-6 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveMachines}
              className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
            >
              <Settings className="h-4 w-4 mr-2" />
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
              Máquinas asignadas al {viewMachinesUser?.role.toLowerCase()} {viewMachinesUser?.name}
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
