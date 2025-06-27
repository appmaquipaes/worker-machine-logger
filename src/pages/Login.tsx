
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import CreateUserForm from '@/components/admin/CreateUserForm';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="container max-w-md mx-auto py-10">
      <div className="mb-6 flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={18} />
          Volver al inicio
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowAdminPanel(!showAdminPanel)}
          className="text-xs"
        >
          {showAdminPanel ? 'Ocultar' : 'Panel Admin'}
        </Button>
      </div>
      
      {showAdminPanel && (
        <div className="mb-6">
          <CreateUserForm />
        </div>
      )}
      
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Iniciar Sesión</CardTitle>
          <CardDescription>
            Ingresa tus credenciales para acceder al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@maquipaes.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Regístrate
            </Link>
          </div>
          <div className="text-xs text-center text-muted-foreground">
            Usuario de prueba: marketingdigital859@gmail.com / password123
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
