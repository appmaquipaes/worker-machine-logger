
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface PasswordSectionProps {
  password: string;
  confirmPassword: string;
  passwordError: string;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({
  password,
  confirmPassword,
  passwordError,
  onPasswordChange,
  onConfirmPasswordChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
        Contraseña
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
            Contraseña
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
            Confirmar Contraseña
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            required
            className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      {passwordError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-medium text-red-700">{passwordError}</p>
        </div>
      )}
    </div>
  );
};

export default PasswordSection;
