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
import FincaForm from "./fincas/FincaForm";
import FincasTable from "./fincas/FincasTable";
import FincasEmptyState from "./fincas/FincasEmptyState";

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
          <p className="text-sm text-corporate-muted mt-1">
            Cliente:&nbsp;
            <span className="font-semibold text-corporate">
              {clienteNombre}
            </span>
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
            <FincaForm
              nombreFinca={nombreFinca}
              setNombreFinca={setNombreFinca}
              direccion={direccion}
              setDireccion={setDireccion}
              ciudad={ciudad}
              setCiudad={setCiudad}
              contactoNombre={contactoNombre}
              setContactoNombre={setContactoNombre}
              contactoTelefono={contactoTelefono}
              setContactoTelefono={setContactoTelefono}
              notas={notas}
              setNotas={setNotas}
              editingFinca={editingFinca}
              onSubmit={handleSubmit}
              onCancel={()=>setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-0 pb-1">
        {fincas.length > 0 ? (
          <FincasTable fincas={fincas} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <FincasEmptyState />
        )}
      </CardContent>
    </Card>
  );
};

export default FincasManagement;
