
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Provider {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  tipoServicio: string;
  fechaRegistro: string;
}

interface ProviderManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProvidersUpdated: () => void;
}

const ProviderManagementDialog: React.FC<ProviderManagementDialogProps> = ({
  open,
  onOpenChange,
  onProvidersUpdated
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    tipoServicio: ''
  });

  useEffect(() => {
    if (open) {
      loadProviders();
    }
  }, [open]);

  const loadProviders = () => {
    const storedProviders = JSON.parse(localStorage.getItem('proveedores') || '[]');
    setProviders(storedProviders);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre) {
      toast.error('El nombre del proveedor es obligatorio');
      return;
    }

    if (editingProvider) {
      // Editar proveedor existente
      const updatedProviders = providers.map(provider => 
        provider.id === editingProvider.id 
          ? { ...provider, ...formData }
          : provider
      );
      setProviders(updatedProviders);
      localStorage.setItem('proveedores', JSON.stringify(updatedProviders));
      toast.success('Proveedor actualizado exitosamente');
    } else {
      // Crear nuevo proveedor
      const newProvider: Provider = {
        id: Date.now().toString(),
        ...formData,
        fechaRegistro: new Date().toISOString()
      };
      const updatedProviders = [...providers, newProvider];
      setProviders(updatedProviders);
      localStorage.setItem('proveedores', JSON.stringify(updatedProviders));
      toast.success('Proveedor creado exitosamente');
    }

    resetForm();
    onProvidersUpdated();
  };

  const handleEdit = (provider: Provider) => {
    setEditingProvider(provider);
    setFormData({
      nombre: provider.nombre,
      telefono: provider.telefono,
      email: provider.email,
      direccion: provider.direccion,
      tipoServicio: provider.tipoServicio
    });
  };

  const handleDelete = (providerId: string) => {
    const updatedProviders = providers.filter(provider => provider.id !== providerId);
    setProviders(updatedProviders);
    localStorage.setItem('proveedores', JSON.stringify(updatedProviders));
    toast.success('Proveedor eliminado exitosamente');
    onProvidersUpdated();
  };

  const resetForm = () => {
    setEditingProvider(null);
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      tipoServicio: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-6 w-6" />
            Gestión de Proveedores
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingProvider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Nombre del proveedor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Teléfono del proveedor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email del proveedor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección del proveedor"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipoServicio">Tipo de Servicio</Label>
                  <Input
                    id="tipoServicio"
                    value={formData.tipoServicio}
                    onChange={(e) => setFormData({ ...formData, tipoServicio: e.target.value })}
                    placeholder="Tipo de servicio que ofrece"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingProvider ? 'Actualizar' : 'Crear'} Proveedor
                  </Button>
                  {editingProvider && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Proveedores */}
          <Card>
            <CardHeader>
              <CardTitle>Proveedores Registrados ({providers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {providers.length > 0 ? (
                  providers.map((provider) => (
                    <div
                      key={provider.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{provider.nombre}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {provider.tipoServicio && <p>🏷️ {provider.tipoServicio}</p>}
                          {provider.telefono && <p>📞 {provider.telefono}</p>}
                          {provider.email && <p>📧 {provider.email}</p>}
                          {provider.direccion && <p>📍 {provider.direccion}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(provider)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(provider.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay proveedores registrados
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProviderManagementDialog;
