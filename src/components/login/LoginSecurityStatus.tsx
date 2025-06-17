
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield } from 'lucide-react';

interface LoginSecurityStatusProps {
  attemptCount: number;
  isBlocked: boolean;
  blockTimeRemaining: number;
  error: string;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export const LoginSecurityStatus: React.FC<LoginSecurityStatusProps> = ({
  attemptCount,
  isBlocked,
  blockTimeRemaining,
  error
}) => {
  return (
    <>
      {attemptCount > 0 && !isBlocked && (
        <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md">
          <AlertTriangle size={16} />
          <span>Intentos fallidos: {attemptCount}/5</span>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4 animate-fade-in">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isBlocked && (
        <Alert className="mb-4 border-red-200 bg-red-50 animate-fade-in">
          <Shield className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Cuenta bloqueada temporalmente. Tiempo restante: {formatTime(blockTimeRemaining)}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};
