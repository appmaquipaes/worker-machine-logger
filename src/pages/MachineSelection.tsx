
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachine } from '@/context/MachineContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Truck, Wrench } from 'lucide-react';
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

  // Función para determinar el icono según el tipo de máquina
  const getMachineIcon = (type: string) => {
    switch (type) {
      case 'Camión':
        return <Truck size={36} />;
      default:
        return <Wrench size={36} />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Selección de Máquinas</h1>
        <p className="text-xl mt-4 mb-8">
          Toca la máquina con la que vas a trabajar hoy
        </p>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-lg mb-8"
        >
          <ArrowLeft size={24} />
          Volver al inicio
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => (
          <Card key={machine.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Button
              onClick={() => handleSelectMachine(machine)}
              className="w-full h-auto p-8 flex flex-col items-center gap-4 text-lg font-medium"
              variant="ghost"
            >
              <div className="bg-primary/20 w-20 h-20 rounded-full flex items-center justify-center mb-2">
                {getMachineIcon(machine.type)}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold">{machine.name}</h3>
                <p className="text-muted-foreground">{machine.type}</p>
                {machine.plate && (
                  <p className="text-sm mt-1">Placa: {machine.plate}</p>
                )}
              </div>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MachineSelection;
