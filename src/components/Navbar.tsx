
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Shield, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  if (isLoading) {
    return (
      <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="h-6 w-32 bg-primary-foreground/20 rounded animate-pulse" />
          <div className="h-8 w-8 bg-primary-foreground/20 rounded-full animate-pulse" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-primary text-primary-foreground py-4 px-6 shadow-md border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link 
          to="/" 
          className="text-xl font-bold hover:text-primary-foreground/90 transition-colors story-link"
        >
          Maquipaes SAS
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm">
                Hola, <span className="font-medium">{user.name}</span>
              </span>
              <div className="text-xs px-2 py-1 bg-primary-foreground/20 rounded-full">
                {user.role}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="hover:bg-primary-foreground/10"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-0 h-9 w-9 hover:bg-primary-foreground/10">
                  <Avatar className="h-9 w-9 border-2 border-primary-foreground/20">
                    <AvatarFallback className="bg-accent text-accent-foreground font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-background/95 backdrop-blur-sm">
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                  <div className="text-xs font-medium text-accent mt-1 px-2 py-0.5 bg-accent/10 rounded">
                    {user.role}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    to="/profile" 
                    className={`flex items-center gap-2 cursor-pointer ${
                      isActivePath('/profile') ? 'bg-accent/50' : ''
                    }`}
                  >
                    <User size={16} />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                {user.role === 'Administrador' && (
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/admin" 
                      className={`flex items-center gap-2 cursor-pointer ${
                        isActivePath('/admin') ? 'bg-accent/50' : ''
                      }`}
                    >
                      <Shield size={16} />
                      <span>Panel Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Overlay */}
            {isOpen && (
              <div className="md:hidden fixed inset-0 bg-black/50 z-50" onClick={() => setIsOpen(false)}>
                <div className="absolute top-16 right-4 bg-background rounded-lg shadow-lg p-4 min-w-48 animate-fade-in">
                  <div className="text-sm mb-3">
                    <div className="font-medium text-foreground">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.email}</div>
                    <div className="text-xs font-medium text-accent mt-1">{user.role}</div>
                  </div>
                  <div className="space-y-2">
                    <Link 
                      to="/profile" 
                      className="block px-2 py-1 text-sm hover:bg-accent/10 rounded"
                      onClick={() => setIsOpen(false)}
                    >
                      Perfil
                    </Link>
                    {user.role === 'Administrador' && (
                      <Link 
                        to="/admin" 
                        className="block px-2 py-1 text-sm hover:bg-accent/10 rounded"
                        onClick={() => setIsOpen(false)}
                      >
                        Panel Admin
                      </Link>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-2 py-1 text-sm text-destructive hover:bg-destructive/10 rounded"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-2">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/login')}
              className="hover:bg-primary-foreground/10 hover-scale"
            >
              Iniciar Sesión
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/register')}
              className="hover-scale"
            >
              Registrarse
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
