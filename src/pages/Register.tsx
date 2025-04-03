
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from "sonner";

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Trabajador' | 'Administrador'>('Trabajador');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { register, user } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !validatePassword()) {
      return;
    }

    setIsSubmitting(true);
    const success = await register(name, email, password, role);
    setIsSubmitting(false);
    
    if (success) {
      toast.success(`Usuario registrado exitosamente`);
      // Si ya hay un usuario autenticado, es un administrador creando otro usuario
      if (user && user.role === 'Administrador') {
        // Restablecer el formulario para crear otro usuario
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('Trabajador');
      } else {
        // Es un nuevo usuario registrándose, redirigir al dashboard
        navigate('/dashboard');
      }
    }
  };

  // Título y descripción varían según si es un admin creando un usuario o un registro público
  const pageTitle = user && user.role === 'Administrador' ? "Crear Usuario" : "Registrarse";
  const pageDescription = user && user.role === 'Administrador' 
    ? "Registra un nuevo usuario trabajador o administrador"
    : "Crea una cuenta para acceder al sistema";

  return (
    <div className="container max-w-md mx-auto py-10">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">{pageTitle}</CardTitle>
          <CardDescription>
            {pageDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                type="text"
                placeholder="Juan Pérez"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </div>
            
            {/* Mostrar selección de rol solo para administradores */}
            {user && user.role === 'Administrador' && (
              <div className="space-y-2">
                <Label>Rol</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as 'Trabajador' | 'Administrador')}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Trabajador" id="trabajador" />
                    <Label htmlFor="trabajador">Trabajador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Administrador" id="administrador" />
                    <Label htmlFor="administrador">Administrador</Label>
                  </div>
                </RadioGroup>
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : user && user.role === 'Administrador' ? "Registrar Usuario" : "Crear Cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {user && user.role === 'Administrador' ? (
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Volver al Dashboard
            </Button>
          ) : (
            <div className="w-full text-center">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Iniciar Sesión
              </Link>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
