
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "sonner";
import { ArrowLeft } from 'lucide-react';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'Trabajador' | 'Administrador' | 'Operador'>('Trabajador');
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { register, user } = useAuth();
  const { machines } = useMachine();
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

  const handleMachineToggle = (machineId: string) => {
    setSelectedMachines(prev => 
      prev.includes(machineId) 
        ? prev.filter(id => id !== machineId)
        : [...prev, machineId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !validatePassword()) {
      return;
    }

    setIsSubmitting(true);
    const assignedMachines = role === 'Operador' ? selectedMachines : undefined;
    const success = await register(name, email, password, role, assignedMachines);
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
        setSelectedMachines([]);
      } else {
        // Es un nuevo usuario registrándose, redirigir al dashboard
        navigate('/dashboard');
      }
    }
  };

  // Título y descripción varían según si es un admin creando un usuario o un registro público
  const pageTitle = user && user.role === 'Administrador' ? "Crear Usuario" : "Registrarse";
  const pageDescription = user && user.role === 'Administrador' 
    ? "Registra un nuevo usuario trabajador, administrador u operador"
    : "Crea una cuenta para acceder al sistema";

  return (
    <div className="container max-w-2xl mx-auto py-10">
      <div className="mb-6 flex justify-start">
        <Button
          variant="back"
          onClick={() => navigate(user ? '/admin/users' : '/')}
        >
          <ArrowLeft size={18} />
          {user ? 'Volver a gestión de usuarios' : 'Volver al inicio'}
        </Button>
      </div>
      
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
                  onValueChange={(value) => {
                    setRole(value as 'Trabajador' | 'Administrador' | 'Operador');
                    if (value !== 'Operador') {
                      setSelectedMachines([]);
                    }
                  }}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Trabajador" id="trabajador" />
                    <Label htmlFor="trabajador">Trabajador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Operador" id="operador" />
                    <Label htmlFor="operador">Operador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Administrador" id="administrador" />
                    <Label htmlFor="administrador">Administrador</Label>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Mostrar selección de máquinas solo para operadores */}
            {role === 'Operador' && user && user.role === 'Administrador' && (
              <div className="space-y-2">
                <Label>Máquinas Asignadas</Label>
                <div className="border rounded-md p-4 max-h-60 overflow-y-auto">
                  {machines.length > 0 ? (
                    <div className="space-y-3">
                      {machines.map((machine) => (
                        <div key={machine.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={machine.id}
                            checked={selectedMachines.includes(machine.id)}
                            onCheckedChange={() => handleMachineToggle(machine.id)}
                          />
                          <Label htmlFor={machine.id} className="flex-1 cursor-pointer">
                            <span className="font-medium">{machine.name}</span>
                            <span className="text-sm text-muted-foreground ml-2">
                              ({machine.type}) {machine.plate && `- ${machine.plate}`}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No hay máquinas disponibles para asignar
                    </p>
                  )}
                </div>
                {selectedMachines.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {selectedMachines.length} máquina(s) seleccionada(s)
                  </p>
                )}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Registrando..." : user && user.role === 'Administrador' ? "Registrar Usuario" : "Crear Cuenta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          {!user && (
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
