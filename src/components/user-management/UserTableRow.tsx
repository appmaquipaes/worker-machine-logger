
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Settings, DollarSign, Eye, Truck } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor';
  assignedMachines?: string[];
  comisionPorHora?: number;
  comisionPorViaje?: number;
};

type Machine = {
  id: string;
  name: string;
  type: string;
  plate?: string;
};

interface UserTableRowProps {
  user: User;
  currentUser: User;
  machines: Machine[];
  onEditMachines: (user: User) => void;
  onEditCommission: (user: User) => void;
  onEditTripCommission: (user: User) => void;
  onViewMachines: (user: User) => void;
  onRemoveUser: (userId: string) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  user,
  currentUser,
  machines,
  onEditMachines,
  onEditCommission,
  onEditTripCommission,
  onViewMachines,
  onRemoveUser
}) => {
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

  return (
    <TableRow className="hover:bg-blue-50/30 transition-colors">
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
        {(user.role === 'Operador' || user.role === 'Conductor') ? (
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
            ${(user.comisionPorHora || 0).toLocaleString()}/hr
          </div>
        ) : user.role === 'Conductor' ? (
          <div className="font-bold text-purple-700 text-base">
            ${(user.comisionPorViaje || 0).toLocaleString()}/viaje
          </div>
        ) : (
          <span className="text-sm text-slate-400 font-medium">-</span>
        )}
      </TableCell>
      
      <TableCell className="py-4">
        <div className="flex items-center justify-center gap-2">
          {(user.role === 'Operador' || user.role === 'Conductor') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditMachines(user)}
              className="h-9 w-9 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
              title="Configurar máquinas"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
          {user.role === 'Operador' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditCommission(user)}
              className="h-9 w-9 p-0 text-green-600 hover:bg-green-50 hover:text-green-700"
              title="Configurar comisión por hora"
            >
              <DollarSign className="h-4 w-4" />
            </Button>
          )}
          {user.role === 'Conductor' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEditTripCommission(user)}
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
                disabled={user.id === currentUser.id}
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
  );
};

export default UserTableRow;
