
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Wifi, WifiOff, Database, HardDrive } from 'lucide-react';
import { useDataSource } from '@/context/DataSourceContext';

const DataSourceStatus: React.FC = () => {
  const { isOnline, supabaseConnected, getEffectiveDataSource } = useDataSource();

  const modules = [
    { name: 'Usuarios', key: 'users' as const, description: 'Gestión de usuarios y perfiles' },
    { name: 'Máquinas', key: 'machines' as const, description: 'Equipos y maquinaria' },
    { name: 'Reportes', key: 'reports' as const, description: 'Informes de trabajo' },
    { name: 'Clientes', key: 'clients' as const, description: 'Base de datos de clientes' },
    { name: 'Fincas', key: 'fincas' as const, description: 'Propiedades y ubicaciones' },
    { name: 'Ventas', key: 'ventas' as const, description: 'Transacciones de venta' }
  ];

  // Modules that use localStorage primarily (for now)
  const localStorageModules = [
    { name: 'Inventario', key: 'inventario' as const, description: 'Stock y materiales' },
    { name: 'Materiales', key: 'materiales' as const, description: 'Catálogo de productos' }
  ];

  const getStatusColor = (dataSource: string) => {
    switch (dataSource) {
      case 'supabase':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'localStorage':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (dataSource: string) => {
    switch (dataSource) {
      case 'supabase':
        return <Database className="h-4 w-4" />;
      case 'localStorage':
        return <HardDrive className="h-4 w-4" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Estado del Sistema de Datos</CardTitle>
            <CardDescription>
              Información sobre la conectividad y fuentes de datos activas
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="h-5 w-5 text-green-600" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                {isOnline ? 'En línea' : 'Sin conexión'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {supabaseConnected ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className={`text-sm font-medium ${supabaseConnected ? 'text-green-600' : 'text-red-600'}`}>
                Supabase {supabaseConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => {
            const effectiveSource = getEffectiveDataSource(module.key);
            
            return (
              <div key={module.key} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{module.name}</h3>
                  {getStatusIcon(effectiveSource)}
                </div>
                <p className="text-xs text-gray-600">{module.description}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(effectiveSource)}`}
                >
                  {effectiveSource === 'supabase' && 'Supabase'}
                  {effectiveSource === 'localStorage' && 'Local'}
                  {effectiveSource === 'offline' && 'Sin conexión'}
                </Badge>
              </div>
            );
          })}
          
          {localStorageModules.map((module) => {
            // These modules always use localStorage for now
            const effectiveSource = 'localStorage';
            
            return (
              <div key={module.key} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm">{module.name}</h3>
                  {getStatusIcon(effectiveSource)}
                </div>
                <p className="text-xs text-gray-600">{module.description}</p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(effectiveSource)}`}
                >
                  Local
                </Badge>
              </div>
            );
          })}
        </div>

        {!supabaseConnected && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Modo Fallback Activo</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  El sistema está funcionando con datos locales. Los cambios se sincronizarán 
                  automáticamente cuando se restablezca la conexión con Supabase.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataSourceStatus;
