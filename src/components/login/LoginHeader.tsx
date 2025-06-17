
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const LoginHeader: React.FC = () => {
  return (
    <CardHeader className="space-y-1 text-center">
      <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
      <CardDescription>
        Ingresa tus credenciales para acceder al sistema
      </CardDescription>
    </CardHeader>
  );
};
