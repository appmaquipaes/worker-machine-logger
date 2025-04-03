
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Definir el tipo de datos de usuario
type User = {
  id: string;
  name: string;
  email: string;
  role: 'Trabajador' | 'Administrador';
};

// Definir el tipo de contexto
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'Trabajador' | 'Administrador') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
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
    role: 'Trabajador' | 'Administrador'
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
