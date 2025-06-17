
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSecureForm } from '@/hooks/useSecureForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Mail, Lock, AlertTriangle, Shield } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

const Login: React.FC = () => {
  const [error, setError] = useState('');
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const {
    email,
    password,
    isSubmitting,
    isBlocked,
    attemptCount,
    validateEmailField,
    validatePasswordField,
    checkRateLimit,
    incrementAttempts,
    getBlockTimeRemaining,
    setSubmitting,
    clearForm,
    resetSecurity,
    isFormValid
  } = useSecureForm();

  // Contador de tiempo restante cuando está bloqueado
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isBlocked) {
      interval = setInterval(() => {
        const remaining = getBlockTimeRemaining();
        setBlockTimeRemaining(remaining);
        
        if (remaining <= 0) {
          resetSecurity();
          setError('');
          enhancedToast.info('Puedes intentar iniciar sesión nuevamente');
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBlocked, getBlockTimeRemaining, resetSecurity]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Verificar rate limiting
    if (!checkRateLimit()) {
      if (isBlocked) {
        const minutes = Math.ceil(blockTimeRemaining / 60);
        setError(`Demasiados intentos fallidos. Intenta nuevamente en ${minutes} minutos.`);
        enhancedToast.warning('Cuenta temporalmente bloqueada', {
          description: `Espera ${minutes} minutos antes de intentar nuevamente`
        });
      }
      return;
    }

    // Validar campos
    const emailValid = validateEmailField(email.value);
    const passwordValid = validatePasswordField(password.value);
    
    if (!emailValid || !passwordValid) {
      setError('Por favor, corrige los errores en el formulario');
      return;
    }

    setSubmitting(true);
    
    try {
      const success = await login(email.value, password.value);
      
      if (success) {
        enhancedToast.success('Inicio de sesión exitoso');
        clearForm();
        resetSecurity();
        navigate('/dashboard');
      } else {
        incrementAttempts();
        setError('Credenciales incorrectas. Por favor, intenta nuevamente.');
        
        const remainingAttempts = 5 - (attemptCount + 1);
        if (remainingAttempts > 0) {
          enhancedToast.error('Credenciales incorrectas', {
            description: `Te quedan ${remainingAttempts} intentos`
          });
        }
      }
    } catch (err) {
      console.error('Error durante el login:', err);
      setError('Error interno del sistema. Por favor, intenta más tarde.');
      enhancedToast.error('Error del sistema');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateEmailField(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validatePasswordField(e.target.value);
  };

  const handleEmailBlur = () => {
    if (email.value) {
      validateEmailField(email.value);
    }
  };

  const handlePasswordBlur = () => {
    if (password.value) {
      validatePasswordField(password.value);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container max-w-md mx-auto py-10 animate-fade-in">
      <div className="mb-6 flex justify-start">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="hover-scale"
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Button>
      </div>
      
      <Card className="shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
          
          {attemptCount > 0 && !isBlocked && (
            <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 p-2 rounded-md">
              <AlertTriangle size={16} />
              <span>Intentos fallidos: {attemptCount}/5</span>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
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
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="ejemplo@maquipaes.com"
                  value={email.value}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
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
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline story-link"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password.value}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
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
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-primary hover:underline story-link">
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
