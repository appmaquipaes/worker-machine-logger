
export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Operador' | 'Supervisor';
  password: string;
  assignedMachines?: string[];
  isActive: boolean;
  createdAt: Date;
}

export const loadUsers = (): Usuario[] => {
  const usersString = localStorage.getItem('users');
  if (!usersString) return [];

  try {
    return JSON.parse(usersString).map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }));
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

export const saveUsers = (users: Usuario[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};
