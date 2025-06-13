
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
      console.log('useMachineSelection: No user found, redirecting to login');
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSelectMachine = (machine: typeof machines[0]) => {
    console.log('handleSelectMachine called with:', machine);
    console.log('Current user:', user);
    
    try {
      selectMachine(machine);
      console.log('Machine selected successfully');
      
      const machineTypeMessage = machine.type === 'Volqueta' || machine.type === 'Camabaja'
        ? `Vehículo ${machine.name} seleccionado`
        : `Máquina ${machine.name} seleccionada`;
      
      console.log('Showing toast:', machineTypeMessage);
      toast.success(machineTypeMessage);
      
      console.log('Attempting to navigate to /report-form');
      navigate('/report-form');
      console.log('Navigation command executed');
      
    } catch (error) {
      console.error('Error in handleSelectMachine:', error);
      toast.error('Error al seleccionar la máquina');
    }
  };

  const getFilteredMachines = () => {
    if (!user) {
      console.log('getFilteredMachines: No user, returning empty array');
      return [];
    }
    
    console.log('getFilteredMachines: User role:', user.role);
    
    if (user.role === 'Operador') {
      if (!user.assignedMachines || user.assignedMachines.length === 0) {
        console.log('getFilteredMachines: Operador has no assigned machines');
        return [];
      }
      const filtered = machines.filter(machine => user.assignedMachines!.includes(machine.id));
      console.log('getFilteredMachines: Filtered machines for operador:', filtered);
      return filtered;
    }
    
    console.log('getFilteredMachines: Returning all machines for admin:', machines);
    return machines;
  };

  return {
    user,
    machines,
    filteredMachines: getFilteredMachines(),
    handleSelectMachine
  };
};
