
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachine } from '@/context/MachineContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Truck, Wrench } from 'lucide-react';
import { toast } from "sonner";
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
    navigate('/report'); // Redirect to the report form instead of reports page
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

  // Función para obtener la imagen según el tipo de máquina
  const getMachineImage = (type: string) => {
    switch (type.toLowerCase()) {
      case 'camión':
        return "/truck.png";
      case 'excavadora':
        return "/excavator.png";
      case 'bulldozer':
        return "/bulldozer.png";
      case 'compactador':
        return "/compactor.png";
      case 'cargador':
        return "/loader.png";
      case 'motoniveladora':
        return "/grader.png";
      case 'paladraga':
        return "/dragline.png";
      default:
        return "/machine.png";
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
              className="w-full h-auto p-6 flex flex-col items-center gap-4 text-lg font-medium"
              variant="ghost"
            >
              <div className="mb-3 w-32 h-32 flex items-center justify-center">
                {machine.imageUrl ? (
                  <Avatar className="w-full h-full rounded-md">
                    <AvatarImage src={machine.imageUrl} alt={machine.name} className="object-cover" />
                    <AvatarFallback className="bg-primary/20 w-full h-full flex items-center justify-center rounded-md">
                      {getMachineIcon(machine.type)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <AspectRatio ratio={1 / 1} className="bg-primary/20 w-full rounded-md flex items-center justify-center">
                    <img 
                      src={getMachineImage(machine.type)} 
                      alt={machine.type}
                      onError={(e) => {
                        // Si la imagen falla, mostrar el icono
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.appendChild(
                          document.createElement('div')
                        ).appendChild(
                          document.createTextNode(machine.type[0])
                        );
                      }}
                      className="object-contain p-2 max-h-28"
                    />
                  </AspectRatio>
                )}
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
