
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine, Machine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';
import MachineForm from '@/components/MachineForm';
import MachineTable from '@/components/MachineTable';

const MachineManagement: React.FC = () => {
  const { user } = useAuth();
  const { machines, deleteMachine, addMachine } = useMachine();
  const navigate = useNavigate();

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

  const handleAddMachine = (newMachine: Omit<Machine, 'id'>) => {
    addMachine(newMachine);
  };

  const handleDeleteMachine = (id: string) => {
    deleteMachine(id);
  };

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Gestión de Máquinas</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Añade o elimina máquinas del sistema
        </p>
      </div>

      <MachineForm onAddMachine={handleAddMachine} />
      <MachineTable machines={machines} onDeleteMachine={handleDeleteMachine} />
    </div>
  );
};

export default MachineManagement;
