
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Finca, 
  loadFincas, 
  saveFincas, 
  createFinca, 
  getFincasByCliente 
} from '@/models/Fincas';

interface FincasManagementProps {
  clienteId: string;
  clienteNombre: string;
}

const FincasManagement: React.FC<FincasManagementProps> = ({ 
  clienteId, 
  clienteNombre 
}) => {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFinca, setEditingFinca] = useState<Finca | null>(null);
  
  // Form states
  const [nombreFinca, setNombreFinca] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [contactoNombre, setContactoNombre] = useState('');
  const [contactoTelefono, setContactoTelefono] = useState('');
  const [notas, setNotas] = useState('');

  useEffect(() => {
    loadFincasData();
  }, [clienteId]);

  const loadFincasData = () => {
    const fincasData = getFincasByCliente(clienteId);
    setFincas(fincasData);
  };

  const resetForm = () => {
    setNombreFinca('');
    setDireccion('');
    setCiudad('');
    setContactoNombre('');
    setContactoTelefono('');
    setNotas('');
    setEditingFinca(null);
  };

  const handleSubmit = () => {
    if (!nombreFinca || !direccion || !ciudad || !contactoNombre || !contactoTelefono) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }

    try {
      const todasLasFincas = loadFincas();
      
      if (editingFinca) {
        // Actualizar finca existente
        const fincasActualizadas = todasLasFincas.map(finca => 
          finca.id === editingFinca.id ? {
            ...finca,
            nombre_finca: nombreFinca,
            direccion,
            ciudad,
            contacto_nombre: contactoNombre,
            contacto_telefono: contactoTelefono,
            notas
          } : finca
        );
        saveFincas(fincasActualizadas);
        toast.success('Finca actualizada exitosamente');
      } else {
        // Crear nueva finca
        const nuevaFinca = createFinca(
          clienteId,
          nombreFinca,
          direccion,
          ciudad,
          contactoNombre,
          contactoTelefono,
          notas
        );
        todasLasFincas.push(nuevaFinca);
        saveFincas(todasLasFincas);
        toast.success('Finca agregada exitosamente');
      }

      loadFincasData();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar finca:', error);
      toast.error('Error al guardar la finca');
    }
  };

  const handleEdit = (finca: Finca) => {
    setEditingFinca(finca);
    setNombreFinca(finca.nombre_finca);
    setDireccion(finca.direccion);
    setCiudad(finca.ciudad);
    setContactoNombre(finca.contacto_nombre);
    setContactoTelefono(finca.contacto_telefono);
    setNotas(finca.notas || '');
    setDialogOpen(true);
  };

  const handleDelete = (fincaId: string) => {
    try {
      const todasLasFincas = loadFincas();
      const fincasActualizadas = todasLasFincas.filter(finca => finca.id !== fincaId);
      saveFincas(fincasActualizadas);
      loadFincasData();
      toast.success('Finca eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar finca:', error);
      toast.error('Error al eliminar la finca');
    }
  };

  const openNewFincaDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Fincas y Puntos de Entrega
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Cliente: {clienteNombre}
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNewFincaDialog} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nueva Finca
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingFinca ? 'Editar Finca' : 'Agregar Nueva Finca'}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre-finca">Nombre de la Finca *</Label>
                  <Input
                    id="nombre-finca"
                    value={nombreFinca}
                    onChange={(e) => setNombreFinca(e.target.value)}
                    placeholder="Ej: Finca La Esperanza"
                  />
                </div>

                <div>
                  <Label htmlFor="ciudad">Ciudad/Municipio *</Label>
                  <Input
                    id="ciudad"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    placeholder="Ej: Medellín"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="direccion">Dirección Exacta *</Label>
                  <Input
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    placeholder="Dirección completa de la finca"
                  />
                </div>

                <div>
                  <Label htmlFor="contacto-nombre">Persona de Contacto *</Label>
                  <Input
                    id="contacto-nombre"
                    value={contactoNombre}
                    onChange={(e) => setContactoNombre(e.target.value)}
                    placeholder="Nombre del contacto"
                  />
                </div>

                <div>
                  <Label htmlFor="contacto-telefono">Teléfono de Contacto *</Label>
                  <Input
                    id="contacto-telefono"
                    value={contactoTelefono}
                    onChange={(e) => setContactoTelefono(e.target.value)}
                    placeholder="Teléfono del contacto"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notas">Notas Adicionales</Label>
                  <Textarea
                    id="notas"
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                    placeholder="Notas adicionales sobre la finca"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>
                  {editingFinca ? 'Actualizar' : 'Guardar'} Finca
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {fincas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre de la Finca</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fincas.map((finca) => (
                <TableRow key={finca.id}>
                  <TableCell className="font-medium">{finca.nombre_finca}</TableCell>
                  <TableCell>{finca.ciudad}</TableCell>
                  <TableCell>{finca.contacto_nombre}</TableCell>
                  <TableCell>{finca.contacto_telefono}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(finca)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción eliminará permanentemente la finca "{finca.nombre_finca}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(finca.id)}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No hay fincas registradas</h3>
            <p className="mt-2">Agrega una nueva finca para este cliente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FincasManagement;
