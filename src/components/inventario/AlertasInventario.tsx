
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, X, Package } from 'lucide-react';
import { AlertaInventario } from '@/hooks/useInventarioAlertas';

interface AlertasInventarioProps {
  alertas: AlertaInventario[];
  onDesactivarAlerta: (alertaId: string) => void;
}

const AlertasInventario: React.FC<AlertasInventarioProps> = ({
  alertas,
  onDesactivarAlerta
}) => {
  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'sin_stock': return 'bg-red-100 text-red-800 border-red-200';
      case 'stock_critico': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'stock_bajo': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'sin_stock': return 'Sin Stock';
      case 'stock_critico': return 'Stock Crítico';
      case 'stock_bajo': return 'Stock Bajo';
      default: return tipo;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'sin_stock': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'stock_critico': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'stock_bajo': return <Package className="h-4 w-4 text-yellow-600" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (alertas.length === 0) {
    return (
      <Card className="shadow-lg border-green-200 bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-200 rounded-full">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">¡Todo en orden!</p>
              <p className="text-sm text-green-600">No hay alertas de inventario activas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-orange-200">
      <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
        <CardTitle className="text-xl font-bold text-orange-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Alertas de Inventario ({alertas.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {alertas.map((alerta) => (
          <Alert key={alerta.id} className={`${getTipoColor(alerta.tipo)} border`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {getTipoIcon(alerta.tipo)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{alerta.material}</span>
                    <Badge className={`${getTipoColor(alerta.tipo)} border-0 text-xs`}>
                      {getTipoLabel(alerta.tipo)}
                    </Badge>
                  </div>
                  <AlertDescription className="text-sm">
                    <div>
                      <span className="font-medium">Cantidad actual:</span> {alerta.cantidadActual} m³
                    </div>
                    <div>
                      <span className="font-medium">Umbral mínimo:</span> {alerta.umbralMinimo} m³
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Detectado: {alerta.fechaDeteccion.toLocaleDateString()} a las {alerta.fechaDeteccion.toLocaleTimeString()}
                    </div>
                  </AlertDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDesactivarAlerta(alerta.id)}
                className="h-8 w-8 p-0 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};

export default AlertasInventario;
