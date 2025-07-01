
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Settings, Truck } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor';
  assignedMachines?: string[];
};

interface UserStatsCardsProps {
  users: User[];
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ users }) => {
  const totalUsers = users.length;
  const admins = users.filter(u => u.role === 'Administrador').length;
  const operators = users.filter(u => u.role === 'Operador').length;
  const drivers = users.filter(u => u.role === 'Conductor').length;

  const stats = [
    {
      title: 'Total Usuarios',
      value: totalUsers,
      icon: <Users className="h-6 w-6 text-blue-600" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Administradores',
      value: admins,
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Operadores',
      value: operators,
      icon: <Settings className="h-6 w-6 text-orange-600" />,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Conductores',
      value: drivers,
      icon: <Truck className="h-6 w-6 text-purple-600" />,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-lg border-0 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{stat.value}</div>
            <p className="text-xs text-slate-500 mt-1">
              {stat.value === 1 ? 'usuario registrado' : 'usuarios registrados'}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserStatsCards;
