
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import { User } from '@/types/auth';

interface RegisterHeaderProps {
  user: User | null;
}

const RegisterHeader: React.FC<RegisterHeaderProps> = ({ user }) => {
  const navigate = useNavigate();

  const pageTitle = user && user.role === 'Administrador' ? "Crear Usuario" : "Registrarse";
  const pageDescription = user && user.role === 'Administrador' 
    ? "Registra un nuevo usuario trabajador, administrador u operador"
    : "Crea una cuenta para acceder al sistema";

  return (
    <div className="corporate-gradient rounded-2xl p-8 text-white shadow-xl mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                {pageTitle}
              </h1>
              <p className="text-blue-100 text-lg font-medium">
                {pageDescription}
              </p>
            </div>
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={() => navigate(user ? '/admin/users' : '/')}
          className="border-white/30 text-white hover:bg-white/10 font-semibold flex items-center gap-2 px-6 py-3"
        >
          <ArrowLeft className="h-5 w-5" />
          {user ? 'Volver a gestión' : 'Volver al inicio'}
        </Button>
      </div>
    </div>
  );
};

export default RegisterHeader;
