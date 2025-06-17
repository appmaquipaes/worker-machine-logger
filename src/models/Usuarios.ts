
export interface Usuario {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'Administrador' | 'Operador' | 'Supervisor';
  isActive: boolean;
  createdAt: Date;
  assignedMachines?: string[];
  comisionPorHora?: number;
}

export const loadUsers = (): Usuario[] => {
  try {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
};

export const saveUsers = (users: Usuario[]): void => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};
