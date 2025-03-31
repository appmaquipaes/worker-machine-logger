
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachine } from '@/context/MachineContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

const MachineSelection: React.FC = () => {
  const { machines, selectMachine } = useMachine();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirigir si no hay un usuario autenticado
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSelectMachine = (machine: typeof machines[0]) => {
    selectMachine(machine);
    toast.success(`Máquina ${machine.name} seleccionada`);
    navigate('/reports');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Selección de Máquinas</h1>
        <p className="text-muted-foreground mt-2">
          Selecciona la máquina con la que trabajarás para enviar reportes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {machines.map((machine) => (
          <Button
            key={machine.id}
            onClick={() => handleSelectMachine(machine)}
            className="h-auto py-6 text-lg font-medium"
            variant="outline"
          >
            {machine.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default MachineSelection;
