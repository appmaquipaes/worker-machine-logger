
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Settings, Truck, DollarSign } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor';
  assignedMachines?: string[];
  comisionPorHora?: number;
  comisionPorViaje?: number;
};

interface UserStatsCardsProps {
  users: User[];
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ users }) => {
  return (
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
  );
};

export default UserStatsCards;
