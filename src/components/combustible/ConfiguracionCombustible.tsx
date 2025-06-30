
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Save } from 'lucide-react';
import { toast } from 'sonner';

const ConfiguracionCombustible = () => {
  const [config, setConfig] = useState({
    precioPorGalon: '12000',
    eficienciaEsperadaVolquetas: '8',
    eficienciaEsperadaCamiones: '6',
    consumoEsperadoExcavadora: '4',
    consumoEsperadoBulldozer: '5',
    consumoEsperadoCargador: '3',
    alertaSaldoBajo: '100000',
    alertaEficienciaBaja: 'true'
  });

  useEffect(() => {
    const configGuardada = localStorage.getItem('configCombustible');
    if (configGuardada) {
      setConfig({ ...config, ...JSON.parse(configGuardada) });
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('configCombustible', JSON.stringify(config));
    toast.success('Configuración guardada exitosamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configuración de Combustible</h2>
        <Button onClick={handleSave} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Guardar Configuración
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración general */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="precioPorGalon">Precio por Galón ($)</Label>
              <Input
                type="number"
                value={config.precioPorGalon}
                onChange={(e) => setConfig({...config, precioPorGalon: e.target.value})}
                placeholder="12000"
              />
            </div>

            <div>
              <Label htmlFor="alertaSaldoBajo">Alerta Saldo Bajo ($)</Label>
              <Input
                type="number"
                value={config.alertaSaldoBajo}
                onChange={(e) => setConfig({...config, alertaSaldoBajo: e.target.value})}
                placeholder="100000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Se enviará alerta cuando el saldo Texaco esté por debajo de este valor
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Eficiencia esperada volquetas/camiones */}
        <Card>
          <CardHeader>
            <CardTitle>Eficiencia Esperada - Transporte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="eficienciaEsperadaVolquetas">Volquetas (km/gal)</Label>
              <Input
                type="number"
                step="0.1"
                value={config.eficienciaEsperadaVolquetas}
                onChange={(e) => setConfig({...config, eficienciaEsperadaVolquetas: e.target.value})}
                placeholder="8"
              />
            </div>

            <div>
              <Label htmlFor="eficienciaEsperadaCamiones">Camiones (km/gal)</Label>
              <Input
                type="number"
                step="0.1"
                value={config.eficienciaEsperadaCamiones}
                onChange={(e) => setConfig({...config, eficienciaEsperadaCamiones: e.target.value})}
                placeholder="6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Consumo esperado maquinaria */}
        <Card>
          <CardHeader>
            <CardTitle>Consumo Esperado - Maquinaria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="consumoEsperadoExcavadora">Excavadoras (gal/h)</Label>
              <Input
                type="number"
                step="0.1"
                value={config.consumoEsperadoExcavadora}
                onChange={(e) => setConfig({...config, consumoEsperadoExcavadora: e.target.value})}
                placeholder="4"
              />
            </div>

            <div>
              <Label htmlFor="consumoEsperadoBulldozer">Bulldozers (gal/h)</Label>
              <Input
                type="number"
                step="0.1"
                value={config.consumoEsperadoBulldozer}
                onChange={(e) => setConfig({...config, consumoEsperadoBulldozer: e.target.value})}
                placeholder="5"
              />
            </div>

            <div>
              <Label htmlFor="consumoEsperadoCargador">Cargadores (gal/h)</Label>
              <Input
                type="number"
                step="0.1"
                value={config.consumoEsperadoCargador}
                onChange={(e) => setConfig({...config, consumoEsperadoCargador: e.target.value})}
                placeholder="3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Información del sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2">
              <p><strong>Saldo Texaco:</strong> Sistema de prepago con descuento automático</p>
              <p><strong>Eficiencia:</strong> Calculada automáticamente desde los reportes de viajes</p>
              <p><strong>Alertas:</strong> Notificaciones automáticas por baja eficiencia o saldo bajo</p>
              <p><strong>Integración:</strong> Datos sincronizados con reportes de transporte y maquinaria</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConfiguracionCombustible;
