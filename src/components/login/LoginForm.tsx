
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Loader2, Shield } from 'lucide-react';

interface LoginFormProps {
  email: {
    value: string;
    error: string;
    touched: boolean;
  };
  password: {
    value: string;
    error: string;
    touched: boolean;
  };
  isSubmitting: boolean;
  isBlocked: boolean;
  isFormValid: boolean;
  blockTimeRemaining: number;
  onSubmit: (e: React.FormEvent) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailBlur: () => void;
  onPasswordBlur: () => void;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  isSubmitting,
  isBlocked,
  isFormValid,
  blockTimeRemaining,
  onSubmit,
  onEmailChange,
  onPasswordChange,
  onEmailBlur,
  onPasswordBlur
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Correo Electrónico</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="ejemplo@maquipaes.com"
            value={email.value}
            onChange={onEmailChange}
            onBlur={onEmailBlur}
            className={`pl-10 transition-colors ${
              email.touched && email.error 
                ? 'border-destructive focus:border-destructive' 
                : email.touched && !email.error 
                ? 'border-green-500' 
                : ''
            }`}
            disabled={isBlocked}
            required
          />
        </div>
        {email.touched && email.error && (
          <p className="text-sm text-destructive animate-fade-in">
            {email.error}
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
          <a
            href="/forgot-password"
            className="text-sm text-primary hover:underline story-link"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password.value}
            onChange={onPasswordChange}
            onBlur={onPasswordBlur}
            className={`pl-10 transition-colors ${
              password.touched && password.error 
                ? 'border-destructive focus:border-destructive' 
                : password.touched && !password.error 
                ? 'border-green-500' 
                : ''
            }`}
            disabled={isBlocked}
            required
          />
        </div>
        {password.touched && password.error && (
          <p className="text-sm text-destructive animate-fade-in">
            {password.error}
          </p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full hover-scale" 
        disabled={isSubmitting || !isFormValid || isBlocked}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Iniciando...
          </>
        ) : isBlocked ? (
          <>
            <Shield className="mr-2 h-4 w-4" />
            Bloqueado ({formatTime(blockTimeRemaining)})
          </>
        ) : (
          "Iniciar Sesión"
        )}
      </Button>
    </form>
  );
};
