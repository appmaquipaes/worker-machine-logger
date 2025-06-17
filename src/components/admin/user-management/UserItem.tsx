
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit } from 'lucide-react';
import { Usuario } from '@/models/Usuarios';

interface UserItemProps {
  user: Usuario;
  onEdit: (user: Usuario) => void;
  onDelete: (userId: string) => void;
}

const UserItem: React.FC<UserItemProps> = ({ user, onEdit, onDelete }) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Administrador': return 'bg-red-100 text-red-800';
      case 'Supervisor': return 'bg-blue-100 text-blue-800';
      case 'Operador': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium">{user.name}</h4>
          <Badge className={getRoleBadgeColor(user.role)}>
            {user.role}
          </Badge>
          {!user.isActive && (
            <Badge variant="secondary">Inactivo</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(user)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(user.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default UserItem;
