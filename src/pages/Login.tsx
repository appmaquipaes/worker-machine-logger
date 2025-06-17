
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas. Por favor, intenta nuevamente.');
    }
    
    setIsSubmitting(false);
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isEmailValid = email.includes('@') && email.includes('.');
  const isPasswordValid = password.length >= 6;

  return (
    <div className="container max-w-md mx-auto py-10 animate-fade-in">
      <div className="mb-6 flex justify-start">
        <Button
          variant="back"
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
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4 animate-fade-in">
              <AlertDescription>{error}</AlertDescription>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`pl-10 transition-colors ${
                    touched.email && !isEmailValid 
                      ? 'border-destructive focus:border-destructive' 
                      : touched.email && isEmailValid 
                      ? 'border-green-500' 
                      : ''
                  }`}
                  required
                />
              </div>
              {touched.email && !isEmailValid && (
                <p className="text-sm text-destructive animate-fade-in">
                  Ingresa un correo electrónico válido
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`pl-10 transition-colors ${
                    touched.password && !isPasswordValid 
                      ? 'border-destructive focus:border-destructive' 
                      : touched.password && isPasswordValid 
                      ? 'border-green-500' 
                      : ''
                  }`}
                  required
                />
              </div>
              {touched.password && !isPasswordValid && (
                <p className="text-sm text-destructive animate-fade-in">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full hover-scale" 
              disabled={isSubmitting || !isEmailValid || !isPasswordValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando...
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
