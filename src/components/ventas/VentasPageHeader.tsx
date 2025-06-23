
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, ShoppingCart } from 'lucide-react';

interface VentasPageHeaderProps {
  onNewVentaClick: () => void;
}

const VentasPageHeader: React.FC<VentasPageHeaderProps> = ({ onNewVentaClick }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8 bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-blue-100 rounded-2xl">
            <ShoppingCart className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Gestión de Ventas</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Registra y gestiona todas las ventas de material y transporte de forma sencilla
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={onNewVentaClick}
            className="h-14 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            <Plus className="h-6 w-6 mr-3" />
            Nueva Venta
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate('/admin')}
            className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-6 w-6 mr-3" />
            Volver al Panel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VentasPageHeader;
