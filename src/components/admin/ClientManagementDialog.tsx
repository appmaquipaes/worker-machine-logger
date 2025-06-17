
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Client {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  fechaRegistro: string;
}

interface ClientManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientsUpdated: () => void;
}

const ClientManagementDialog: React.FC<ClientManagementDialogProps> = ({
  open,
  onOpenChange,
  onClientsUpdated
}) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: ''
  });

  useEffect(() => {
    if (open) {
      loadClients();
    }
  }, [open]);

  const loadClients = () => {
    const storedClients = JSON.parse(localStorage.getItem('clientes') || '[]');
    setClients(storedClients);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre) {
      toast.error('El nombre del cliente es obligatorio');
      return;
    }

    if (editingClient) {
      // Editar cliente existente
      const updatedClients = clients.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...formData }
          : client
      );
      setClients(updatedClients);
      localStorage.setItem('clientes', JSON.stringify(updatedClients));
      toast.success('Cliente actualizado exitosamente');
    } else {
      // Crear nuevo cliente
      const newClient: Client = {
        id: Date.now().toString(),
        ...formData,
        fechaRegistro: new Date().toISOString()
      };
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      localStorage.setItem('clientes', JSON.stringify(updatedClients));
      toast.success('Cliente creado exitosamente');
    }

    resetForm();
    onClientsUpdated();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nombre: client.nombre,
      telefono: client.telefono,
      email: client.email,
      direccion: client.direccion
    });
  };

  const handleDelete = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    localStorage.setItem('clientes', JSON.stringify(updatedClients));
    toast.success('Cliente eliminado exitosamente');
    onClientsUpdated();
  };

  const resetForm = () => {
    setEditingClient(null);
    setFormData({
      nombre: '',
      telefono: '',
      email: '',
      direccion: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-6 w-6" />
            Gestión de Clientes
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                    placeholder="Nombre del cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Teléfono del cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email del cliente"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    placeholder="Dirección del cliente"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingClient ? 'Actualizar' : 'Crear'} Cliente
                  </Button>
                  {editingClient && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle>Clientes Registrados ({clients.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{client.nombre}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {client.telefono && <p>📞 {client.telefono}</p>}
                          {client.email && <p>📧 {client.email}</p>}
                          {client.direccion && <p>📍 {client.direccion}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(client)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay clientes registrados
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

export default ClientManagementDialog;
