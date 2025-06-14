
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PersonalInfoSectionProps {
  name: string;
  email: string;
  onNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  name,
  email,
  onNameChange,
  onEmailChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
        Datos Personales
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
            Nombre Completo
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Correo Electrónico
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@maquipaes.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            required
            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoSection;
