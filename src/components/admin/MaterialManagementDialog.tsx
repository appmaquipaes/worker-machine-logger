
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Material {
  id: string;
  nombre: string;
  categoria: string;
  precioVenta: number;
  unidadMedida: string;
  descripcion: string;
  fechaRegistro: string;
}

interface MaterialManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialsUpdated: () => void;
}

const MaterialManagementDialog: React.FC<MaterialManagementDialogProps> = ({
  open,
  onOpenChange,
  onMaterialsUpdated
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    precioVenta: 0,
    unidadMedida: '',
    descripcion: ''
  });

  useEffect(() => {
    if (open) {
      loadMaterials();
    }
  }, [open]);

  const loadMaterials = () => {
    const storedMaterials = JSON.parse(localStorage.getItem('materiales') || '[]');
    setMaterials(storedMaterials);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.categoria) {
      toast.error('Nombre y categoría son obligatorios');
      return;
    }

    if (editingMaterial) {
      // Editar material existente
      const updatedMaterials = materials.map(material => 
        material.id === editingMaterial.id 
          ? { ...material, ...formData }
          : material
      );
      setMaterials(updatedMaterials);
      localStorage.setItem('materiales', JSON.stringify(updatedMaterials));
      toast.success('Material actualizado exitosamente');
    } else {
      // Crear nuevo material
      const newMaterial: Material = {
        id: Date.now().toString(),
        ...formData,
        fechaRegistro: new Date().toISOString()
      };
      const updatedMaterials = [...materials, newMaterial];
      setMaterials(updatedMaterials);
      localStorage.setItem('materiales', JSON.stringify(updatedMaterials));
      toast.success('Material creado exitosamente');
    }

    resetForm();
    onMaterialsUpdated();
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    setFormData({
      nombre: material.nombre,
      categoria: material.categoria,
      precioVenta: material.precioVenta,
      unidadMedida: material.unidadMedida,
      descripcion: material.descripcion
    });
  };

  const handleDelete = (materialId: string) => {
    const updatedMaterials = materials.filter(material => material.id !== materialId);
    setMaterials(updatedMaterials);
    localStorage.setItem('materiales', JSON.stringify(updatedMaterials));
    toast.success('Material eliminado exitosamente');
    onMaterialsUpdated();
  };

  const resetForm = () => {
    setEditingMaterial(null);
    setFormData({
      nombre: '',
      categoria: '',
      precioVenta: 0,
      unidadMedida: '',
      descripcion: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Gestión de Materiales Volquetas
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingMaterial ? 'Editar Material' : 'Nuevo Material'}
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
                    placeholder="Nombre del material"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría *</Label>
                  <Input
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    placeholder="Categoría del material"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precioVenta">Precio de Venta</Label>
                    <Input
                      id="precioVenta"
                      type="number"
                      step="0.01"
                      value={formData.precioVenta}
                      onChange={(e) => setFormData({ ...formData, precioVenta: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unidadMedida">Unidad de Medida</Label>
                    <Input
                      id="unidadMedida"
                      value={formData.unidadMedida}
                      onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
                      placeholder="m³, kg, viaje"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Input
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción del material"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingMaterial ? 'Actualizar' : 'Crear'} Material
                  </Button>
                  {editingMaterial && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Materiales */}
          <Card>
            <CardHeader>
              <CardTitle>Materiales Registrados ({materials.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {materials.length > 0 ? (
                  materials.map((material) => (
                    <div
                      key={material.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold">{material.nombre}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>📦 {material.categoria}</p>
                          <p>💰 ${material.precioVenta} por {material.unidadMedida}</p>
                          {material.descripcion && <p>📝 {material.descripcion}</p>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(material)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(material.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay materiales registrados
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

export default MaterialManagementDialog;
