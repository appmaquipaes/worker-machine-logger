
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CreditCard, Fuel, History } from 'lucide-react';
import { toast } from 'sonner';
import { useSaldoTexaco } from '@/hooks/useSaldoTexaco';

const SaldoTexaco = () => {
  const [isRecargaOpen, setIsRecargaOpen] = useState(false);
  const [isTanqueadaOpen, setIsTanqueadaOpen] = useState(false);
  
  const { 
    saldo, 
    recargas, 
    tanqueadas, 
    agregarRecarga, 
    registrarTanqueada,
    isLoading 
  } = useSaldoTexaco();
  
  const [formRecarga, setFormRecarga] = useState({
    valor: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  const [formTanqueada, setFormTanqueada] = useState({
    vehiculo: '',
    kilometraje: '',
    galones: '',
    valorTotal: '',
    fecha: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  const handleRecarga = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRecarga.valor) {
      toast.error('Ingrese el valor de la recarga');
      return;
    }

    const success = await agregarRecarga({
      valor: parseFloat(formRecarga.valor),
      fecha: new Date(formRecarga.fecha),
      observaciones: formRecarga.observaciones
    });

    if (success) {
      setFormRecarga({
        valor: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: ''
      });
      setIsRecargaOpen(false);
      toast.success('Recarga registrada exitosamente');
    }
  };

  const handleTanqueada = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formTanqueada.vehiculo || !formTanqueada.valorTotal) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    const success = await registrarTanqueada({
      vehiculo: formTanqueada.vehiculo,
      kilometraje: parseInt(formTanqueada.kilometraje) || 0,
      galones: parseFloat(formTanqueada.galones) || 0,
      valorTotal: parseFloat(formTanqueada.valorTotal),
      fecha: new Date(formTanqueada.fecha),
      observaciones: formTanqueada.observaciones
    });

    if (success) {
      setFormTanqueada({
        vehiculo: '',
        kilometraje: '',
        galones: '',
        valorTotal: '',
        fecha: new Date().toISOString().split('T')[0],
        observaciones: ''
      });
      setIsTanqueadaOpen(false);
      toast.success('Tanqueada registrada exitosamente');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión Saldo Texaco</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsRecargaOpen(!isRecargaOpen)} className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Nueva Recarga
          </Button>
          <Button onClick={() => setIsTanqueadaOpen(!isTanqueadaOpen)} variant="outline" className="flex items-center gap-2">
            <Fuel className="h-4 w-4" />
            Registrar Tanqueada
          </Button>
        </div>
      </div>

      {/* Saldo actual */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-800">Saldo Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-800">
            ${saldo.toLocaleString()}
          </div>
          <p className="text-sm text-green-600 mt-1">
            Disponible para tanqueadas
          </p>
        </CardContent>
      </Card>

      {/* Formulario nueva recarga */}
      {isRecargaOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Recarga</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRecarga} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor">Valor Recarga *</Label>
                <Input
                  type="number"
                  value={formRecarga.valor}
                  onChange={(e) => setFormRecarga({...formRecarga, valor: e.target.value})}
                  placeholder="500000"
                />
              </div>

              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  type="date"
                  value={formRecarga.fecha}
                  onChange={(e) => setFormRecarga({...formRecarga, fecha: e.target.value})}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  value={formRecarga.observaciones}
                  onChange={(e) => setFormRecarga({...formRecarga, observaciones: e.target.value})}
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrar Recarga'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsRecargaOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Formulario nueva tanqueada */}
      {isTanqueadaOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar Tanqueada</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTanqueada} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehiculo">Vehículo *</Label>
                <Select value={formTanqueada.vehiculo} onValueChange={(value) => setFormTanqueada({...formTanqueada, vehiculo: value})}>
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
                <Label htmlFor="kilometraje">Kilometraje</Label>
                <Input
                  type="number"
                  value={formTanqueada.kilometraje}
                  onChange={(e) => setFormTanqueada({...formTanqueada, kilometraje: e.target.value})}
                  placeholder="120000"
                />
              </div>

              <div>
                <Label htmlFor="galones">Galones</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formTanqueada.galones}
                  onChange={(e) => setFormTanqueada({...formTanqueada, galones: e.target.value})}
                  placeholder="25.5"
                />
              </div>

              <div>
                <Label htmlFor="valorTotal">Valor Total *</Label>
                <Input
                  type="number"
                  value={formTanqueada.valorTotal}
                  onChange={(e) => setFormTanqueada({...formTanqueada, valorTotal: e.target.value})}
                  placeholder="300000"
                />
              </div>

              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  type="date"
                  value={formTanqueada.fecha}
                  onChange={(e) => setFormTanqueada({...formTanqueada, fecha: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  value={formTanqueada.observaciones}
                  onChange={(e) => setFormTanqueada({...formTanqueada, observaciones: e.target.value})}
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Registrar Tanqueada'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsTanqueadaOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Historial de transacciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Últimas Recargas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recargas.slice(0, 5).map((recarga, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium text-green-600">
                      +${recarga.valor.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {recarga.fecha.toLocaleDateString()}
                    </div>
                  </div>
                  {recarga.observaciones && (
                    <div className="text-xs text-gray-400 max-w-32 truncate">
                      {recarga.observaciones}
                    </div>
                  )}
                </div>
              ))}
              {recargas.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay recargas registradas</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fuel className="h-5 w-5" />
              Últimas Tanqueadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tanqueadas.slice(0, 5).map((tanqueada, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{tanqueada.vehiculo}</div>
                    <div className="text-sm text-gray-500">
                      {tanqueada.fecha.toLocaleDateString()} • {tanqueada.galones} gal
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-red-600">
                      -${tanqueada.valorTotal.toLocaleString()}
                    </div>
                    {tanqueada.kilometraje > 0 && (
                      <div className="text-xs text-gray-500">
                        {tanqueada.kilometraje.toLocaleString()} km
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {tanqueadas.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay tanqueadas registradas</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaldoTexaco;
