
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMachine } from '@/context/MachineContext';
import { useAuth } from '@/context/AuthContext';
import { toast } from "sonner";

export const useMachineSelection = () => {
  const { machines, selectMachine } = useMachine();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSelectMachine = (machine: typeof machines[0]) => {
    console.log('Selecting machine:', machine);
    selectMachine(machine);
    
    const machineTypeMessage = machine.type === 'Camión' || machine.type === 'Volqueta' || machine.type === 'Camabaja' || machine.type === 'Semirremolque' || machine.type === 'Tractomula'
      ? `Vehículo ${machine.name} seleccionado`
      : `Máquina ${machine.name} seleccionada`;
    
    toast.success(machineTypeMessage);
    
    // Navegar directamente al formulario de reporte
    navigate('/report-form');
  };

  const getFilteredMachines = () => {
    if (!user) return [];
    
    if (user.role === 'Operador') {
      if (!user.assignedMachines || user.assignedMachines.length === 0) {
        return [];
      }
      return machines.filter(machine => user.assignedMachines!.includes(machine.id));
    }
    return machines;
  };

  return {
    user,
    machines,
    filteredMachines: getFilteredMachines(),
    handleSelectMachine
  };
};
