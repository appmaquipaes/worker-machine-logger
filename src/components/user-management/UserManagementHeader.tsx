
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Users } from 'lucide-react';

const UserManagementHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default UserManagementHeader;
