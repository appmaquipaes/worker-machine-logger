
import React from 'react';
import { User } from '@/types/auth';

interface EmptyMachineStateProps {
  user: User;
}

const EmptyMachineState: React.FC<EmptyMachineStateProps> = ({ user }) => {
  return (
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
  );
};

export default EmptyMachineState;
