
import React from 'react';
import { Link } from 'react-router-dom';
import { CardFooter } from '@/components/ui/card';

export const LoginFooter: React.FC = () => {
  return (
    <CardFooter className="flex flex-col space-y-2">
      <div className="text-sm text-center">
        ¿No tienes una cuenta?{" "}
        <Link to="/register" className="text-primary hover:underline story-link">
          Regístrate
        </Link>
      </div>
    </CardFooter>
  );
};
