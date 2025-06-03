import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Definir el tipo de datos de usuario
type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador' | 'Operador';
  assignedMachines?: string[]; // IDs de las máquinas asignadas para operadores
};

// Definir el tipo de contexto
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'Trabajador' | 'Administrador' | 'Operador', assignedMachines?: string[]) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  resetPassword: (email: string) => Promise<boolean>;
  updatePassword: (email: string, resetCode: string, newPassword: string) => Promise<boolean>;
  updateUserMachines: (userId: string, machineIds: string[]) => Promise<boolean>;
};

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario del almacenamiento local al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulación de API - en un entorno real, esto sería una llamada a una API o servicio
      // Para esta demo, verificamos si el usuario existe en localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        toast.error("Credenciales incorrectas");
        return false;
      }
      
      // Omitir la contraseña del objeto de usuario antes de guardarlo en el estado
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      toast.success("Inicio de sesión exitoso");
      return true;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrar un nuevo usuario
  const register = async (
    name: string, 
    email: string, 
    password: string, 
    role: 'Trabajador' | 'Administrador' | 'Operador',
    assignedMachines: string[] = []
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulación de API - en un entorno real, esto sería una llamada a una API
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Verificar si ya existe un usuario con ese email
      if (users.some((u: any) => u.email === email)) {
        toast.error("El correo electrónico ya está registrado");
        return false;
      }
      
      // Crear un nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // En un entorno real, esto debería estar encriptado
        role,
        // Solo agregar assignedMachines si es operador y hay máquinas seleccionadas
        ...(role === 'Operador' && assignedMachines.length > 0 && { assignedMachines }),
      };
      
      // Guardar el usuario en la "base de datos" (localStorage)
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      // Si no hay un usuario autenticado o si el registro es público, iniciar sesión
      if (!user) {
        // Iniciar sesión automáticamente después del registro público
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      }
      
      toast.success("Registro exitoso");
      return true;
    } catch (error) {
      console.error("Error al registrar:", error);
      toast.error("Error al registrar usuario");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar las máquinas asignadas a un usuario
  const updateUserMachines = async (userId: string, machineIds: string[]): Promise<boolean> => {
    setIsLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === userId);
      
      if (userIndex === -1) {
        toast.error("Usuario no encontrado");
        return false;
      }
      
      users[userIndex].assignedMachines = machineIds;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Actualizar usuario actual si es el mismo
      if (user && user.id === userId) {
        const updatedUser = { ...user, assignedMachines: machineIds };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      
      toast.success("Máquinas asignadas actualizadas");
      return true;
    } catch (error) {
      console.error("Error al actualizar máquinas:", error);
      toast.error("Error al actualizar las máquinas asignadas");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para restablecer la contraseña (envío de código)
  const resetPassword = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulación de API - verificamos si el correo existe
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some((u: any) => u.email === email);
      
      if (!userExists) {
        toast.error("No existe una cuenta con ese correo electrónico");
        return false;
      }
      
      // Generar un código de restablecimiento de 6 dígitos
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Guardar el código en localStorage (en producción sería enviado por email)
      const resetRequests = JSON.parse(localStorage.getItem('resetRequests') || '{}');
      resetRequests[email] = {
        code: resetCode,
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutos
      };
      localStorage.setItem('resetRequests', JSON.stringify(resetRequests));
      
      // En un entorno real, aquí se enviaría un email con el código
      // Simulamos mostrando el código en un toast
      toast.success(`Código de restablecimiento: ${resetCode} (En producción se enviaría por email)`);
      return true;
    } catch (error) {
      console.error("Error al solicitar restablecimiento:", error);
      toast.error("Error al procesar la solicitud");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar la contraseña con un código de verificación
  const updatePassword = async (email: string, resetCode: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Verificar si existe una solicitud de restablecimiento válida
      const resetRequests = JSON.parse(localStorage.getItem('resetRequests') || '{}');
      const request = resetRequests[email];
      
      if (!request) {
        toast.error("No hay una solicitud de restablecimiento para este correo");
        return false;
      }
      
      // Verificar si el código es correcto y no ha expirado
      if (request.code !== resetCode || request.expiresAt < Date.now()) {
        toast.error("El código es incorrecto o ha expirado");
        return false;
      }
      
      // Actualizar la contraseña del usuario
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === email);
      
      if (userIndex === -1) {
        toast.error("Usuario no encontrado");
        return false;
      }
      
      users[userIndex].password = newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Eliminar la solicitud de restablecimiento
      delete resetRequests[email];
      localStorage.setItem('resetRequests', JSON.stringify(resetRequests));
      
      toast.success("Contraseña actualizada correctamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar contraseña:", error);
      toast.error("Error al actualizar la contraseña");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success("Sesión cerrada");
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    resetPassword,
    updatePassword,
    updateUserMachines
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
