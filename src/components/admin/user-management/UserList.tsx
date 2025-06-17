
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { Usuario } from '@/models/Usuarios';
import UserItem from './UserItem';

interface UserListProps {
  users: Usuario[];
  onEdit: (user: Usuario) => void;
  onDelete: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Usuarios Registrados ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay usuarios registrados</p>
            </div>
          ) : (
            users.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
