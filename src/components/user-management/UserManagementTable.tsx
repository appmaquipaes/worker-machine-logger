
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, UserPlus, Settings, DollarSign, Eye, Users } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador';
  assignedMachines?: string[];
  comisionPorHora?: number;
};

interface UserManagementTableProps {
  users: User[];
  currentUserId: string;
  onEditMachines: (user: User) => void;
  onEditCommission: (user: User) => void;
  onViewMachines: (user: User) => void;
  onRemoveUser: (userId: string) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({
  users,
  currentUserId,
  onEditMachines,
  onEditCommission,
  onViewMachines,
  onRemoveUser
}) => {
  const navigate = useNavigate();

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Administrador':
        return 'bg-blue-600 text-white hover:bg-blue-700';
      case 'Operador':
        return 'bg-green-600 text-white hover:bg-green-700';
      default:
        return 'bg-slate-500 text-white hover:bg-slate-600';
    }
  };

  return (
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
                  <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide">Comisión/Hr</TableHead>
                  <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell className="py-4">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-800 text-base">{user.name}</p>
                        <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <Badge className={`${getRoleBadgeVariant(user.role)} font-semibold px-3 py-1 text-sm`}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="max-w-48 py-4">
                      {user.role === 'Operador' ? (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-slate-700">
                            {user.assignedMachines?.length || 0} asignada(s)
                          </p>
                          {(user.assignedMachines?.length || 0) > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewMachines(user)}
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
                      {user.role === 'Operador' ? (
                        <div className="font-bold text-green-700 text-base">
                          ${(user.comisionPorHora || 0).toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 font-medium">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2">
                        {user.role === 'Operador' && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditMachines(user)}
                              className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              title="Configurar máquinas"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditCommission(user)}
                              className="h-9 w-9 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
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
                              disabled={user.id === currentUserId}
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
                                Esta acción eliminará permanentemente al usuario <strong>{user.name}</strong>.
                                Los reportes asociados seguirán existiendo, pero no se podrán asociar a este usuario.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => onRemoveUser(user.id)}
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
  );
};

export default UserManagementTable;
