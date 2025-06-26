
import React, { createContext, useContext } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface SupabaseAuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | null>(null);

export const useSupabaseAuthContext = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuthContext must be used within SupabaseAuthProvider');
  }
  return context;
};

interface SupabaseAuthProviderProps {
  children: React.ReactNode;
}

export const SupabaseAuthProvider: React.FC<SupabaseAuthProviderProps> = ({ children }) => {
  const auth = useSupabaseAuth();

  return (
    <SupabaseAuthContext.Provider value={auth}>
      {children}
    </SupabaseAuthContext.Provider>
  );
};
