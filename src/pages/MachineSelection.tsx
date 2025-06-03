import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachine } from '@/context/MachineContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Truck, Wrench, Building, Loader2 } from 'lucide-react';
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
    
    // Mensaje personalizado según el tipo de máquina
    if (machine.type === 'Camión' || machine.type === 'Volqueta' || machine.type === 'Camabaja' || machine.type === 'Semirremolque' || machine.type === 'Tractomula') {
      toast.success(`Vehículo ${machine.name} seleccionado`);
    } else {
      toast.success(`Máquina ${machine.name} seleccionada`);
    }
    
    // Navegar al formulario de reporte con el ID de la máquina
    navigate(`/machines/${machine.id}/report`);
  };

  if (!user) return null;

  // Filtrar máquinas según el rol del usuario
  const getFilteredMachines = () => {
    if (user.role === 'Operador') {
      // Para operadores, solo mostrar máquinas asignadas
      if (!user.assignedMachines || user.assignedMachines.length === 0) {
        return [];
      }
      return machines.filter(machine => user.assignedMachines!.includes(machine.id));
    }
    // Para administradores y trabajadores, mostrar todas las máquinas
    return machines;
  };

  const filteredMachines = getFilteredMachines();

  // Función para determinar el icono según el tipo de máquina
  const getMachineIcon = (type: string) => {
    switch (type) {
      case 'Camión':
      case 'Volqueta':
      case 'Camabaja':
      case 'Semirremolque':
      case 'Tractomula':
        return <Truck size={36} />;
      case 'Excavadora':
      case 'Bulldozer':
      case 'Motoniveladora':
      case 'Paladraga':
        return <Building size={36} />;
      case 'Cargador':
      case 'Compactador':
        return <Loader2 size={36} />;
      default:
        return <Wrench size={36} />;
    }
  };

  // Función para obtener la imagen según el tipo de máquina
  const getMachineImage = (type: string) => {
    switch (type.toLowerCase()) {
      case 'camión':
      case 'volqueta':
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
      case 'camabaja':
      case 'semirremolque':
      case 'tractomula':
        return "/truck.png";
      default:
        return "/machine.png";
    }
  };

  // Agrupar máquinas por tipo para mejor organización
  const groupedMachines = filteredMachines.reduce((groups, machine) => {
    const key = machine.type;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(machine);
    return groups;
  }, {} as Record<string, typeof machines>);

  const machineOrder = [
    'Volqueta', 'Camión', 'Camabaja', 'Semirremolque', 'Tractomula',
    'Excavadora', 'Bulldozer', 'Cargador', 'Motoniveladora', 'Compactador', 'Paladraga'
  ];

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

      {filteredMachines.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">
            {user.role === 'Operador' 
              ? "No tienes máquinas asignadas" 
              : "No hay máquinas disponibles"
            }
          </p>
          <p className="text-muted-foreground">
            {user.role === 'Operador' 
              ? "Contacta al administrador para que te asigne máquinas"
              : "Contacta al administrador para agregar máquinas al sistema"
            }
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {machineOrder.map((type) => {
            const machinesOfType = groupedMachines[type];
            if (!machinesOfType || machinesOfType.length === 0) return null;

            return (
              <div key={type}>
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  {type}s
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {machinesOfType.map((machine) => (
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
                                  // Si la imagen falla, ocultar y mostrar icono
                                  e.currentTarget.style.display = 'none';
                                  const iconContainer = e.currentTarget.parentElement;
                                  if (iconContainer && !iconContainer.querySelector('.fallback-icon')) {
                                    const iconDiv = document.createElement('div');
                                    iconDiv.className = 'fallback-icon flex items-center justify-center w-full h-full';
                                    iconDiv.appendChild(
                                      (() => {
                                        const span = document.createElement('span');
                                        span.innerHTML = getMachineIcon(machine.type).props.children || machine.type[0];
                                        return span;
                                      })()
                                    );
                                    iconContainer.appendChild(iconDiv);
                                  }
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
                            <p className="text-sm mt-1 font-medium">Placa: {machine.plate}</p>
                          )}
                          <div className="mt-2">
                            <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                              machine.status === 'available' 
                                ? 'bg-green-100 text-green-800' 
                                : machine.status === 'in-use'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {machine.status === 'available' ? 'Disponible' : 
                               machine.status === 'in-use' ? 'En uso' : 'Mantenimiento'}
                            </span>
                          </div>
                        </div>
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MachineSelection;
