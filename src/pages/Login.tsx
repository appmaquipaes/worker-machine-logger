
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useSecureForm } from '@/hooks/useSecureForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { LoginHeader } from '@/components/login/LoginHeader';
import { LoginSecurityStatus } from '@/components/login/LoginSecurityStatus';
import { LoginForm } from '@/components/login/LoginForm';
import { LoginFooter } from '@/components/login/LoginFooter';

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
        <LoginHeader />
        
        <CardContent>
          <LoginSecurityStatus
            attemptCount={attemptCount}
            isBlocked={isBlocked}
            blockTimeRemaining={blockTimeRemaining}
            error={error}
          />
          
          <LoginForm
            email={email}
            password={password}
            isSubmitting={isSubmitting}
            isBlocked={isBlocked}
            isFormValid={isFormValid}
            blockTimeRemaining={blockTimeRemaining}
            onSubmit={handleSubmit}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onEmailBlur={handleEmailBlur}
            onPasswordBlur={handlePasswordBlur}
          />
        </CardContent>
        
        <LoginFooter />
      </Card>
    </div>
  );
};

export default Login;
