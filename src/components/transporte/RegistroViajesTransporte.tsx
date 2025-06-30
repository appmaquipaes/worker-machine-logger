
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useViajesTransporte } from '@/hooks/useViajesTransporte';

const RegistroViajesTransporte = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { viajes, registrarViaje, isLoading } = useViajesTransporte();
  
  const [formData, setFormData] = useState({
    maquina: '',
    origen: '',
    destino: '',
    distancia: '',
    material: '',
    cantidadM3: '',
    numeroViajes: '',
    valorTransporte: '',
    valorMaterial: '',
    conductor: '',
    observaciones: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.maquina || !formData.origen || !formData.destino || !formData.numeroViajes) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    const success = await registrarViaje({
      maquina: formData.maquina,
      origen: formData.origen,
      destino: formData.destino,
      distancia: parseFloat(formData.distancia) || 0,
      material: formData.material,
      cantidadM3: parseFloat(formData.cantidadM3) || 0,
      numeroViajes: parseInt(formData.numeroViajes),
      valorTransporte: parseFloat(formData.valorTransporte) || 0,
      valorMaterial: parseFloat(formData.valorMaterial) || 0,
      conductor: formData.conductor,
      observaciones: formData.observaciones,
      fecha: new Date(formData.fecha)
    });

    if (success) {
      setFormData({
        maquina: '',
        origen: '',
        destino: '',
        distancia: '',
        material: '',
        cantidadM3: '',
        numeroViajes: '',
        valorTransporte: '',
        valorMaterial: '',
        conductor: '',
        observaciones: '',
        fecha: new Date().toISOString().split('T')[0]
      });
      setIsFormOpen(false);
      toast.success('Viaje registrado exitosamente');
    }
  };

  const determinarTipoVenta = (origen: string) => {
    return origen === 'Acopio Maquipaes' ? 'Solo transporte' : 'Material + transporte';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Registro de Viajes</h2>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuevo Viaje
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Nuevo Viaje</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maquina">Vehículo *</Label>
                <Select value={formData.maquina} onValueChange={(value) => setFormData({...formData, maquina: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Volqueta 1">Volqueta 1</SelectItem>
                    <SelectItem value="Volqueta 2">Volqueta 2</SelectItem>
                    <SelectItem value="Camión 1">Camión 1</SelectItem>
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
                <Label htmlFor="origen">Origen *</Label>
                <Select value={formData.origen} onValueChange={(value) => setFormData({...formData, origen: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar origen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Acopio Maquipaes">Acopio Maquipaes</SelectItem>
                    <SelectItem value="Cantera San José">Cantera San José</SelectItem>
                    <SelectItem value="Cantera El Roble">Cantera El Roble</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="destino">Destino *</Label>
                <Input
                  value={formData.destino}
                  onChange={(e) => setFormData({...formData, destino: e.target.value})}
                  placeholder="Cliente - Finca"
                />
              </div>

              <div>
                <Label htmlFor="distancia">Distancia (km)</Label>
                <Input
                  type="number"
                  value={formData.distancia}
                  onChange={(e) => setFormData({...formData, distancia: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="numeroViajes">Número de Viajes *</Label>
                <Input
                  type="number"
                  value={formData.numeroViajes}
                  onChange={(e) => setFormData({...formData, numeroViajes: e.target.value})}
                  placeholder="1"
                />
              </div>

              {formData.origen !== 'Acopio Maquipaes' && (
                <>
                  <div>
                    <Label htmlFor="material">Material</Label>
                    <Select value={formData.material} onValueChange={(value) => setFormData({...formData, material: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arena">Arena</SelectItem>
                        <SelectItem value="Recebo">Recebo</SelectItem>
                        <SelectItem value="Gravilla">Gravilla</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="cantidadM3">Cantidad (m³)</Label>
                    <Input
                      type="number"
                      value={formData.cantidadM3}
                      onChange={(e) => setFormData({...formData, cantidadM3: e.target.value})}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="valorMaterial">Valor Material</Label>
                    <Input
                      type="number"
                      value={formData.valorMaterial}
                      onChange={(e) => setFormData({...formData, valorMaterial: e.target.value})}
                      placeholder="0"
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="valorTransporte">Valor Transporte</Label>
                <Input
                  type="number"
                  value={formData.valorTransporte}
                  onChange={(e) => setFormData({...formData, valorTransporte: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="conductor">Conductor</Label>
                <Input
                  value={formData.conductor}
                  onChange={(e) => setFormData({...formData, conductor: e.target.value})}
                  placeholder="Nombre del conductor"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Información adicional..."
                />
              </div>

              {formData.origen && (
                <div className="md:col-span-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      <strong>Tipo de Venta:</strong> {determinarTipoVenta(formData.origen)}
                    </p>
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrar Viaje'}
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
          <CardTitle>Viajes Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viajes.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay viajes registrados</p>
              </div>
            ) : (
              viajes.slice(0, 10).map((viaje, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{viaje.maquina}</div>
                    <div className="text-sm text-gray-500">
                      {viaje.origen} → {viaje.destino}
                    </div>
                    <div className="text-xs text-gray-400">
                      {viaje.fecha.toLocaleDateString()} • {viaje.numeroViajes} viajes
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">
                      ${(viaje.valorTransporte + viaje.valorMaterial).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {viaje.tipoVenta}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegistroViajesTransporte;
