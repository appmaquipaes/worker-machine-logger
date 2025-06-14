
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Users, Settings, Shield } from 'lucide-react';

interface RoleSelectionProps {
  role: 'Trabajador' | 'Administrador' | 'Operador';
  onRoleChange: (role: 'Trabajador' | 'Administrador' | 'Operador') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ role, onRoleChange }) => {
  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'Administrador':
        return <Shield className="h-5 w-5" />;
      case 'Operador':
        return <Settings className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getRoleDescription = (roleType: string) => {
    switch (roleType) {
      case 'Administrador':
        return "Control total del sistema";
      case 'Operador':
        return "Opera máquinas asignadas";
      default:
        return "Usuario básico del sistema";
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
        Rol del Usuario
      </h3>
      <RadioGroup
        value={role}
        onValueChange={(value) => onRoleChange(value as 'Trabajador' | 'Administrador' | 'Operador')}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {(['Trabajador', 'Operador', 'Administrador'] as const).map((roleOption) => (
          <div key={roleOption} className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <RadioGroupItem value={roleOption} id={roleOption.toLowerCase()} />
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                {getRoleIcon(roleOption)}
              </div>
              <div>
                <Label htmlFor={roleOption.toLowerCase()} className="font-semibold text-slate-800 cursor-pointer">
                  {roleOption}
                </Label>
                <p className="text-sm text-slate-600">{getRoleDescription(roleOption)}</p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RoleSelection;
