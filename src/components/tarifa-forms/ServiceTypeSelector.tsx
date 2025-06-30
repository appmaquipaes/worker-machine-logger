
import React from 'react';
import { Label } from '@/components/ui/label';
import { Truck, Settings, MapPin } from 'lucide-react';

interface ServiceTypeSelectorProps {
  selectedType: 'transporte' | 'alquiler_maquina' | 'recepcion_escombrera';
  onTypeChange: (type: 'transporte' | 'alquiler_maquina' | 'recepcion_escombrera') => void;
}

const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  selectedType,
  onTypeChange
}) => {
  const getServiceIcon = (tipo: string) => {
    switch (tipo) {
      case 'transporte': return <Truck className="h-5 w-5" />;
      case 'alquiler_maquina': return <Settings className="h-5 w-5" />;
      case 'recepcion_escombrera': return <MapPin className="h-5 w-5" />;
      default: return null;
    }
  };

  const getServiceLabel = (tipo: string) => {
    switch (tipo) {
      case 'transporte': return 'Servicio de Transporte';
      case 'alquiler_maquina': return 'Alquiler de Maquinaria';
      case 'recepcion_escombrera': return 'Recepción Escombrera';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="tipo-servicio" className="text-lg font-bold text-slate-700">
        Tipo de Servicio *
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['transporte', 'alquiler_maquina', 'recepcion_escombrera'] as const).map((tipo) => (
          <button
            key={tipo}
            type="button"
            onClick={() => onTypeChange(tipo)}
            className={`p-6 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
              selectedType === tipo
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className={`p-3 rounded-lg ${
              selectedType === tipo ? 'bg-blue-100' : 'bg-slate-100'
            }`}>
              {getServiceIcon(tipo)}
            </div>
            <div className="text-left">
              <p className={`font-bold text-base ${
                selectedType === tipo ? 'text-blue-700' : 'text-slate-700'
              }`}>
                {getServiceLabel(tipo)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceTypeSelector;
