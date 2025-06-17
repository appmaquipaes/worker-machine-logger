
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface VentasPageHeaderProps {
  onNewVentaClick: () => void;
}

const VentasPageHeader: React.FC<VentasPageHeaderProps> = ({ onNewVentaClick }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2 gap-2 md:gap-0">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Gestión de Ventas</h1>
          <p className="text-muted-foreground text-sm">Registra y gestiona todas las ventas de material y transporte</p>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            onClick={onNewVentaClick}
            className="flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.03] duration-150"
            variant="default"
            size="sm"
          >
            <Plus size={18} />
            Nueva Venta
          </Button>
          <Button 
            variant="back"
            onClick={() => navigate('/admin')}
            className="shadow-sm"
            size="sm"
          >
            <ArrowLeft size={18} />
            Volver
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VentasPageHeader;
