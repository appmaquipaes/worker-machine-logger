
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSupabaseAuthContext } from '@/context/SupabaseAuthProvider';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

const CreateUserForm: React.FC = () => {
  const [email, setEmail] = useState('marketingdigital859@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Marketing Digital User');
  const [role, setRole] = useState<'Trabajador' | 'Administrador' | 'Operador' | 'Conductor'>('Administrador');
  const [isCreating, setIsCreating] = useState(false);
  
  const { signUp } = useSupabaseAuthContext();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !name) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    setIsCreating(true);
    console.log('🔄 ADMIN: Creando usuario:', { email, name, role });

    try {
      const { data, error } = await signUp(email, password, {
        name,
        role,
        assigned_machines: []
      });

      if (error) {
        console.error('❌ ADMIN: Error creando usuario:', error);
        toast.error(`Error: ${error.message}`);
      } else {
        console.log('✅ ADMIN: Usuario creado exitosamente:', data);
        toast.success(`Usuario ${email} creado exitosamente`);
        
        // Limpiar formulario
        setEmail('');
        setPassword('');
        setName('');
        setRole('Trabajador');
      }
    } catch (error: any) {
      console.error('❌ ADMIN: Error general:', error);
      toast.error('Error al crear el usuario');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Crear Usuario Administrador
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@gmail.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña temporal"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del usuario"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">Rol</Label>
            <Select value={role} onValueChange={(value) => setRole(value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trabajador">Trabajador</SelectItem>
                <SelectItem value="Operador">Operador</SelectItem>
                <SelectItem value="Conductor">Conductor</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creando Usuario...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Crear Usuario
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateUserForm;
