
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
    <Card className="corporate-card animate-scale-in shadow-xl">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b">
        <div>
          <CardTitle className="flex items-center gap-2 text-responsive-md font-bold">
            <MapPin className="h-6 w-6 text-blue-700" />
            Fincas y Puntos de Entrega
          </CardTitle>
          <p className="text-sm text-corporate-muted mt-1">Cliente:&nbsp;
            <span className="font-semibold text-corporate">{clienteNombre}</span>
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewFincaDialog} className="btn-primary-large btn-press flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Nueva Finca
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-background/90 backdrop-blur animate-fade-in">
            <DialogHeader>
              <DialogTitle>
                {editingFinca ? 'Editar Finca' : 'Agregar Nueva Finca'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              <div>
                <Label htmlFor="nombre-finca">Nombre de la Finca *</Label>
                <Input
                  id="nombre-finca"
                  value={nombreFinca}
                  onChange={(e) => setNombreFinca(e.target.value)}
                  placeholder="Ej: Finca La Esperanza"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="ciudad">Ciudad/Municipio *</Label>
                <Input
                  id="ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  placeholder="Ej: Medellín"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección Exacta *</Label>
                <Input
                  id="direccion"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  placeholder="Dirección completa de la finca"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contacto-nombre">Persona de Contacto *</Label>
                <Input
                  id="contacto-nombre"
                  value={contactoNombre}
                  onChange={(e) => setContactoNombre(e.target.value)}
                  placeholder="Nombre del contacto"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contacto-telefono">Teléfono de Contacto *</Label>
                <Input
                  id="contacto-telefono"
                  value={contactoTelefono}
                  onChange={(e) => setContactoTelefono(e.target.value)}
                  placeholder="Teléfono del contacto"
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="notas">Notas Adicionales</Label>
                <Textarea
                  id="notas"
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Notas adicionales sobre la finca"
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit} className="btn-primary-large btn-press">
                {editingFinca ? 'Actualizar' : 'Guardar'} Finca
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0 pb-1">
        {fincas.length > 0 ? (
          <div className="rounded-md border overflow-hidden bg-white/90 backdrop-blur-sm animate-fade-in mt-2">
            <Table className="text-corporate">
              <TableHeader className="bg-slate-50/80">
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
                  <TableRow key={finca.id} className="hover:bg-blue-50/50 transition-colors">
                    <TableCell className="font-medium">{finca.nombre_finca}</TableCell>
                    <TableCell>{finca.ciudad}</TableCell>
                    <TableCell>{finca.contacto_nombre}</TableCell>
                    <TableCell>{finca.contacto_telefono}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="btn-outline-large btn-press w-9 h-9 p-0"
                          onClick={() => handleEdit(finca)}
                          title="Editar finca"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="btn-outline-large btn-press w-9 h-9 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción eliminará permanentemente la finca <b>{finca.nombre_finca}</b>.
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
          </div>
        ) : (
          <div className="text-center py-10 sm:py-16 animate-fade-in text-muted-foreground">
            <MapPin className="mx-auto h-10 w-10 mb-3 text-blue-300" />
            <h3 className="text-lg font-medium text-corporate">No hay fincas registradas</h3>
            <p className="mt-2 text-corporate-muted">Agrega una nueva finca para este cliente</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FincasManagement;

