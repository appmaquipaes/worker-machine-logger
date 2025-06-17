
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, EyeOff } from 'lucide-react';
import { Usuario } from '@/models/Usuarios';

interface UserFormProps {
  editingUser: Usuario | null;
  formData: {
    name: string;
    email: string;
    role: 'Administrador' | 'Operador' | 'Supervisor';
    password: string;
    isActive: boolean;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({
  editingUser,
  formData,
  setFormData,
  onSubmit,
  onCancel
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ingresa el nombre completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="usuario@empresa.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Rol *</Label>
            <Select value={formData.role} onValueChange={(value: any) => setFormData({...formData, role: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Operador">Operador</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Administrador">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="password">Contraseña *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Ingresa una contraseña segura"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="rounded"
            />
            <Label htmlFor="isActive">Usuario activo</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              {editingUser ? 'Actualizar' : 'Crear'} Usuario
            </Button>
            {editingUser && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserForm;
