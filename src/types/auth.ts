
// Definir el tipo de datos de usuario
export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor';
  assignedMachines?: string[]; // IDs de las máquinas asignadas para operadores y conductores
  comisionPorHora?: number; // Para operadores
  comisionPorViaje?: number; // Para conductores
};

// Definir el tipo de contexto
export type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'Trabajador' | 'Administrador' | 'Operador' | 'Conductor', assignedMachines?: string[]) => Promise<boolean>;
  logout: () => Promise<{ error: any }>;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateUserMachines: (userId: string, machineIds: string[]) => Promise<boolean>;
};

// Tipo para las solicitudes de restablecimiento de contraseña
export type ResetRequest = {
  code: string;
  expiresAt: number;
};

// Tipo para el usuario almacenado (incluye contraseña)
export type StoredUser = User & {
  password: string;
};
