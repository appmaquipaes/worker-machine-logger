
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachine } from '@/context/MachineContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/sonner";

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {machines.map((machine) => (
          <Card key={machine.id} className="machine-card overflow-hidden">
            <div className="aspect-square relative overflow-hidden bg-muted flex items-center justify-center">
              <img
                src={machine.imageUrl}
                alt={machine.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                <h3 className="text-white font-medium text-lg">{machine.name}</h3>
              </div>
            </div>
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">Tipo: {machine.type}</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleSelectMachine(machine)} 
                className="w-full"
              >
                Seleccionar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MachineSelection;
