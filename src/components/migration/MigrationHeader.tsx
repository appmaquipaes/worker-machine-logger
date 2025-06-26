
import React from 'react';
import { Database } from 'lucide-react';

interface MigrationHeaderProps {
  currentProfile: any;
}

export const MigrationHeader: React.FC<MigrationHeaderProps> = ({ currentProfile }) => {
  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <Database className="h-16 w-16 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold">Panel de Migración a Supabase</h1>
      <p className="text-gray-600 max-w-2xl mx-auto">
        Bienvenido al nuevo sistema con Supabase. Aquí puedes migrar tus datos existentes 
        desde localStorage a la base de datos de Supabase para mayor seguridad y persistencia.
      </p>
      {currentProfile && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-800">
            Conectado como: <strong>{currentProfile.name || currentProfile.email}</strong> 
            {currentProfile.role && ` (${currentProfile.role})`}
          </p>
        </div>
      )}
    </div>
  );
};
