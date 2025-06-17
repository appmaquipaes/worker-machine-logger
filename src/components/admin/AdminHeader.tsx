
import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ userName, userRole, onLogout }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-3xl mb-12 shadow-2xl">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      <div className="relative px-8 py-12">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-2">
            <Settings className="w-4 h-4 text-amber-300" />
            <span className="text-amber-100 text-sm font-medium">Panel de Control</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
              <span className="text-white font-medium">
                {userName} ({userRole})
              </span>
            </div>
            <Button 
              variant="ghost" 
              onClick={onLogout}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105"
            >
              <LogOut className="w-5 h-5 mr-2" />
              <span className="font-medium">Cerrar Sesión</span>
            </Button>
          </div>
        </div>

        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
            <Settings className="w-10 h-10 text-amber-300" />
          </div>
          
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Panel de <span className="text-amber-300">Administración</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Controla todos los aspectos del sistema desde un solo lugar. 
              Gestiona usuarios, equipos, inventario y más con herramientas intuitivas.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white/90 text-sm">👥 Gestión de Personal</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white/90 text-sm">🚛 Control de Flota</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white/90 text-sm">📊 Análisis de Datos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
