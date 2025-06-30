
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Route, Edit, Trash2 } from 'lucide-react';
import { useRutasTransporte } from '@/hooks/useRutasTransporte';
import { toast } from 'sonner';

const GestionRutas = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { rutas, agregarRuta, editarRuta, eliminarRuta } = useRutasTransporte();
  
  const [formData, setFormData] = useState({
    origen: '',
    destino: '',
    distancia: '',
    tiempoEstimado: '',
    peajes: '',
    observaciones: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.origen || !formData.destino || !formData.distancia) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    const success = await agregarRuta({
      origen: formData.origen,
      destino: formData.destino,
      distancia: parseFloat(formData.distancia),
      tiempoEstimado: parseInt(formData.tiempoEstimado) || 0,
      peajes: parseFloat(formData.peajes) || 0,
      observaciones: formData.observaciones
    });

    if (success) {
      setFormData({
        origen: '',
        destino: '',
        distancia: '',
        tiempoEstimado: '',
        peajes: '',
        observaciones: ''
      });
      setIsFormOpen(false);
      toast.success('Ruta agregada exitosamente');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Rutas</h2>
        <Button onClick={() => setIsFormOpen(!isFormOpen)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nueva Ruta
        </Button>
      </div>

      {isFormOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Agregar Nueva Ruta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origen">Origen *</Label>
                <Input
                  value={formData.origen}
                  onChange={(e) => setFormData({...formData, origen: e.target.value})}
                  placeholder="Punto de origen"
                />
              </div>

              <div>
                <Label htmlFor="destino">Destino *</Label>
                <Input
                  value={formData.destino}
                  onChange={(e) => setFormData({...formData, destino: e.target.value})}
                  placeholder="Punto de destino"
                />
              </div>

              <div>
                <Label htmlFor="distancia">Distancia (km) *</Label>
                <Input
                  type="number"
                  value={formData.distancia}
                  onChange={(e) => setFormData({...formData, distancia: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="tiempoEstimado">Tiempo Estimado (min)</Label>
                <Input
                  type="number"
                  value={formData.tiempoEstimado}
                  onChange={(e) => setFormData({...formData, tiempoEstimado: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="peajes">Peajes ($)</Label>
                <Input
                  type="number"
                  value={formData.peajes}
                  onChange={(e) => setFormData({...formData, peajes: e.target.value})}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  value={formData.observaciones}
                  onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                  placeholder="Notas adicionales"
                />
              </div>

              <div className="md:col-span-2 flex gap-2">
                <Button type="submit">Agregar Ruta</Button>
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
          <CardTitle>Rutas Registradas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rutas.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Route className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay rutas registradas</p>
              </div>
            ) : (
              rutas.map((ruta) => (
                <div key={ruta.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {ruta.origen} → {ruta.destino}
                    </div>
                    <div className="text-sm text-gray-500">
                      {ruta.distancia} km • {ruta.tiempoEstimado} min
                      {ruta.peajes > 0 && ` • Peajes: $${ruta.peajes.toLocaleString()}`}
                    </div>
                    {ruta.observaciones && (
                      <div className="text-xs text-gray-400 mt-1">
                        {ruta.observaciones}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => eliminarRuta(ruta.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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

export default GestionRutas;
