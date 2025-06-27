
import React from 'react';

export const MigrationNavbar: React.FC = () => {
  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          Maquipaes SAS - Panel de Migración
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">Herramienta de Migración</span>
          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
            ACCESO LIBRE ✓
          </div>
        </div>
      </div>
    </nav>
  );
};
