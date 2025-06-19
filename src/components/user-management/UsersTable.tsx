
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, UserPlus } from 'lucide-react';
import UserTableRow from './UserTableRow';

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

interface UsersTableProps {
  users: User[];
  currentUser: User;
  machines: Machine[];
  onEditMachines: (user: User) => void;
  onEditCommission: (user: User) => void;
  onEditTripCommission: (user: User) => void;
  onViewMachines: (user: User) => void;
  onRemoveUser: (userId: string) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({
  users,
  currentUser,
  machines,
  onEditMachines,
  onEditCommission,
  onEditTripCommission,
  onViewMachines,
  onRemoveUser
}) => {
  const navigate = useNavigate();

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
                  <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide">Comisión</TableHead>
                  <TableHead className="font-bold text-slate-700 text-sm uppercase tracking-wide text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <UserTableRow
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    machines={machines}
                    onEditMachines={onEditMachines}
                    onEditCommission={onEditCommission}
                    onEditTripCommission={onEditTripCommission}
                    onViewMachines={onViewMachines}
                    onRemoveUser={onRemoveUser}
                  />
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

export default UsersTable;
