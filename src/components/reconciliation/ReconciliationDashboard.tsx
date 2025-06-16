
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw, Clock, AlertCircle, Info } from 'lucide-react';
import { useDataReconciliation } from '@/hooks/useDataReconciliation';
import { cn } from '@/lib/utils';

const ReconciliationDashboard: React.FC = () => {
  const { 
    reconciliationResults, 
    isReconciling, 
    runReconciliation,
    getDiscrepanciesBySeverity 
  } = useDataReconciliation();

  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estado General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {reconciliationResults.totalDiscrepancies === 0 ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-red-500" />
              )}
              <span className="text-2xl font-bold">
                {reconciliationResults.totalDiscrepancies === 0 ? 'OK' : reconciliationResults.totalDiscrepancies}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {reconciliationResults.totalDiscrepancies === 0 
                ? 'Sin discrepancias'
                : `${reconciliationResults.totalDiscrepancies} discrepancia(s)`
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inventario</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getSeverityIcon(reconciliationResults.inventoryDiscrepancies.length > 0 ? 'high' : 'low')}
              <span className="text-2xl font-bold">
                {reconciliationResults.inventoryDiscrepancies.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Problemas de inventario
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getSeverityIcon(reconciliationResults.salesDiscrepancies.length > 0 ? 'medium' : 'low')}
              <span className="text-2xl font-bold">
                {reconciliationResults.salesDiscrepancies.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Inconsistencias en ventas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getSeverityIcon(reconciliationResults.reportDiscrepancies.length > 0 ? 'medium' : 'low')}
              <span className="text-2xl font-bold">
                {reconciliationResults.reportDiscrepancies.length}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Problemas en reportes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Reconciliación de Datos</CardTitle>
              <CardDescription>
                Verifica la consistencia entre reportes, inventario y ventas
              </CardDescription>
            </div>
            <Button 
              onClick={runReconciliation}
              disabled={isReconciling}
              className="flex items-center gap-2"
            >
              <RefreshCw className={cn("h-4 w-4", isReconciling && "animate-spin")} />
              {isReconciling ? 'Verificando...' : 'Ejecutar Verificación'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Última verificación: {reconciliationResults.lastReconciliation.toLocaleString()}
          </div>
        </CardContent>
      </Card>

      {/* Listado de Discrepancias */}
      {reconciliationResults.totalDiscrepancies > 0 && (
        <div className="space-y-4">
          {['high', 'medium', 'low'].map(severity => {
            const discrepancies = getDiscrepanciesBySeverity(severity as any);
            if (discrepancies.length === 0) return null;

            return (
              <Card key={severity}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getSeverityIcon(severity as any)}
                    Prioridad {severity === 'high' ? 'Alta' : severity === 'medium' ? 'Media' : 'Baja'}
                    <Badge variant="outline">{discrepancies.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {discrepancies.map(discrepancy => (
                      <div 
                        key={discrepancy.id}
                        className={cn(
                          "p-3 rounded-lg border",
                          getSeverityColor(discrepancy.severity)
                        )}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm">{discrepancy.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {discrepancy.type === 'inventory' ? 'Inventario' :
                             discrepancy.type === 'sales' ? 'Ventas' : 'Reportes'}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          <strong>Acción sugerida:</strong> {discrepancy.suggestedAction}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Elementos afectados:</strong> {discrepancy.affectedItems.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReconciliationDashboard;
