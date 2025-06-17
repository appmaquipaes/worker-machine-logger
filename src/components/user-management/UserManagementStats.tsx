
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Settings, DollarSign } from 'lucide-react';

interface UserManagementStatsProps {
  totalUsers: number;
  totalOperators: number;
  totalAdmins: number;
}

const UserManagementStats: React.FC<UserManagementStatsProps> = ({
  totalUsers,
  totalOperators,
  totalAdmins
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Total Usuarios</p>
              <p className="text-3xl font-bold text-blue-900">{totalUsers}</p>
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
              <p className="text-3xl font-bold text-green-900">{totalOperators}</p>
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
              <p className="text-3xl font-bold text-yellow-900">{totalAdmins}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementStats;
