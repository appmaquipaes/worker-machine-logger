
export interface User {
  id: string;
  username: string;
  password: string;
  role: string;
}

export const loadUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

export const createInitialAdminUser = (): void => {
  const users = loadUsers();
  if (users.length === 0) {
    const adminUser: User = {
      id: '1',
      username: 'admin',
      password: 'admin123',
      role: 'Administrador'
    };
    saveUsers([adminUser]);
    console.log('Usuario administrador inicial creado');
  }
};
