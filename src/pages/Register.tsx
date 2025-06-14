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
import { ArrowLeft, UserPlus, Users, Settings, Shield } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        {/* Header Section with Corporate Gradient */}
        <div className="corporate-gradient rounded-2xl p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                    {pageTitle}
                  </h1>
                  <p className="text-blue-100 text-lg font-medium">
                    {pageDescription}
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigate(user ? '/admin/users' : '/')}
              className="border-white/30 text-white hover:bg-white/10 font-semibold flex items-center gap-2 px-6 py-3"
            >
              <ArrowLeft className="h-5 w-5" />
              {user ? 'Volver a gestión' : 'Volver al inicio'}
            </Button>
          </div>
        </div>
        
        {/* Enhanced Form Card */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <UserPlus className="h-6 w-6 text-blue-600" />
              Información del Usuario
            </CardTitle>
            <CardDescription className="text-slate-600 font-medium">
              Completa todos los campos para crear la cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                  Datos Personales
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                      Nombre Completo
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Juan Pérez"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ejemplo@maquipaes.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Password Section */}
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
                      onChange={(e) => setPassword(e.target.value)}
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
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
              
              {/* Role Selection - Only for administrators */}
              {user && user.role === 'Administrador' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    Rol del Usuario
                  </h3>
                  <RadioGroup
                    value={role}
                    onValueChange={(value) => {
                      setRole(value as 'Trabajador' | 'Administrador' | 'Operador');
                      if (value !== 'Operador') {
                        setSelectedMachines([]);
                      }
                    }}
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
              )}

              {/* Machine Assignment - Only for operators */}
              {role === 'Operador' && user && user.role === 'Administrador' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    Máquinas Asignadas
                  </h3>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-h-80 overflow-y-auto">
                    {machines.length > 0 ? (
                      <div className="space-y-3">
                        {machines.map((machine) => (
                          <div key={machine.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors">
                            <Checkbox
                              id={machine.id}
                              checked={selectedMachines.includes(machine.id)}
                              onCheckedChange={() => handleMachineToggle(machine.id)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <Label htmlFor={machine.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Settings className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <span className="font-semibold text-slate-800">{machine.name}</span>
                                  <span className="text-sm text-slate-600 ml-2">
                                    ({machine.type}) {machine.plate && `- ${machine.plate}`}
                                  </span>
                                </div>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                          <Settings className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-slate-600 font-medium">
                          No hay máquinas disponibles para asignar
                        </p>
                      </div>
                    )}
                  </div>
                  {selectedMachines.length > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-blue-800">
                        {selectedMachines.length} máquina(s) seleccionada(s)
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02] text-lg min-h-[60px] flex items-center justify-center gap-3" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      "Registrando..."
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-5 w-5" />
                      {user && user.role === 'Administrador' ? "Registrar Usuario" : "Crear Cuenta"}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          {!user && (
            <CardFooter className="bg-slate-50 border-t">
              <div className="w-full text-center py-2">
                <span className="text-slate-600 font-medium">¿Ya tienes una cuenta? </span>
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                  Iniciar Sesión
                </Link>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Register;
