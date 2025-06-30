import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Settings, Fuel, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useCombustibleMaquinariaIntegrado } from '@/hooks/useCombustibleMaquinariaIntegrado';

const CombustibleMaquinaria = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { 
    consumos, 
    consumosFromReports,
    registrarConsumo, 
    estadisticas,
    isLoading 
  } = useCombustibleMaquinariaIntegrado();
  
  const [formData, setFormData] = useState({
    maquina: '',
    horasTrabajadas: '',
    galones: '',
    valorTotal: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.maquina || !formData.horasTrabajadas || !formData.galones) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    const success = await registrarConsumo({
      maquina: formData.maquina,
      horasTrabajadas: parseFloat(formData.horasTrabajadas),
      galones: parseFloat(formData.galones),
      valorTotal: parseFloat(formData.valorTotal) || 0,
      fecha: new Date(formData.fecha),
      observaciones: formData.observaciones
    });

    if (success) {
      setFormData({
        maquina: '',
        horasTrabajadas: '',
        galones: '',
        valorTotal: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: ''
      });
      setIsFormOpen(false);
      toast.success('Consumo registrado exitosamente');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Control de Combustible - Maquinaria</h2>
          <p className="text-sm text-gray-600 mt-1">
            Incluye consumos registrados directamente y desde reportes de trabajadores
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Registrar Consumo
        </Button>
      </div>

      {/* Estadísticas de consumo mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Consumo del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.galonesDelMes} gal</div>
            <p className="text-xs text-muted-foreground">
              {estadisticas.horasDelMes} horas trabajadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Consumo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.consumoPromedio} gal/h</div>
            <p className="text-xs text-muted-foreground">
              Todas las máquinas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Costo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${estadisticas.costoDelMes.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Desde Reportes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{consumosFromReports.length}</div>
            <p className="text-xs text-muted-foreground">
              Registros automáticos
            </p>
          </CardContent>
        </Card>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Consumo de Combustible</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maquina">Máquina *</Label>
                <Select value={formData.maquina} onValueChange={(value) => setFormData({...formData, maquina: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar máquina" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excavadora CAT 320">Excavadora CAT 320</SelectItem>
                    <SelectItem value="Bulldozer D6T">Bulldozer D6T</SelectItem>
                    <SelectItem value="Cargador 950H">Cargador 950H</SelectItem>
                    <SelectItem value="Retroexcavadora 416F">Retroexcavadora 416F</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="horasTrabajadas">Horas Trabajadas *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.horasTrabajadas}
                  onChange={(e) => setFormData({...formData, horasTrabajadas: e.target.value})}
                  placeholder="8.5"
                />
              </div>

              <div>
                <Label htmlFor="galones">Galones Consumidos *</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.galones}
                  onChange={(e) => setFormData({...formData, galones: e.target.value})}
                  placeholder="35.2"
                />
              </div>

              <div>
                <Label htmlFor="valorTotal">Valor Total (Opcional)</Label>
                <Input
                  type="number"
                  value={formData.valorTotal}
                  onChange={(e) => setFormData({...formData, valorTotal: e.target.value})}
                  placeholder="420000"
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Trabajo en cantera..."
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrar Consumo'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Consumo por Máquina (Último Mes)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {estadisticas.consumoPorMaquina.map((maquina, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{maquina.nombre}</div>
                  <div className="text-sm text-gray-500">
                    {maquina.horas} horas • {maquina.galones} galones
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{maquina.consumoPorHora} gal/h</div>
                  <div className={`text-xs ${maquina.eficiencia === 'Eficiente' ? 'text-green-600' : maquina.eficiencia === 'Normal' ? 'text-yellow-600' : 'text-red-600'}`}>
                    {maquina.eficiencia}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Historial reciente mejorado */}
      <Card>
        <CardHeader>
          <CardTitle>Registros Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {consumos.slice(0, 10).map((consumo, index) => (
              <div key={consumo.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-medium">{consumo.maquina}</div>
                    {consumo.esDesdeReporte && (
                      <div className="flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        <FileText className="h-3 w-3" />
                        Desde reporte
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {consumo.fecha.toLocaleDateString()} • {consumo.horasTrabajadas}h
                    {consumo.kilometraje && (
                      <span className="ml-2">• {consumo.kilometraje} km</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{consumo.galones} gal</div>
                  <div className="text-xs text-gray-500">
                    {(consumo.galones / consumo.horasTrabajadas).toFixed(1)} gal/h
                  </div>
                </div>
              </div>
            ))}
            {consumos.length === 0 && (
              <p className="text-center text-gray-500 py-4">No hay consumos registrados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CombustibleMaquinaria;
