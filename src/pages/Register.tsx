
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from "sonner";
import { UserPlus } from 'lucide-react';

// Import new components
import RegisterHeader from '@/components/register/RegisterHeader';
import PersonalInfoSection from '@/components/register/PersonalInfoSection';
import PasswordSection from '@/components/register/PasswordSection';
import RoleSelection from '@/components/register/RoleSelection';
import MachineAssignment from '@/components/register/MachineAssignment';

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

  const handleRoleChange = (newRole: 'Trabajador' | 'Administrador' | 'Operador') => {
    setRole(newRole);
    if (newRole !== 'Operador') {
      setSelectedMachines([]);
    }
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
      if (user && user.role === 'Administrador') {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setRole('Trabajador');
        setSelectedMachines([]);
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container max-w-3xl mx-auto py-8 px-4">
        <RegisterHeader user={user} />
        
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
              <PersonalInfoSection
                name={name}
                email={email}
                onNameChange={setName}
                onEmailChange={setEmail}
              />

              <PasswordSection
                password={password}
                confirmPassword={confirmPassword}
                passwordError={passwordError}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
              />
              
              {user && user.role === 'Administrador' && (
                <RoleSelection
                  role={role}
                  onRoleChange={handleRoleChange}
                />
              )}

              {role === 'Operador' && user && user.role === 'Administrador' && (
                <MachineAssignment
                  machines={machines}
                  selectedMachines={selectedMachines}
                  onMachineToggle={handleMachineToggle}
                />
              )}
              
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
