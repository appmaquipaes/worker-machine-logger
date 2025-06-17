
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  nombre: string;
  categoria: string;
  cantidad: number;
  unidadMedida: string;
  precioUnitario: number;
  stockMinimo: number;
  fechaRegistro: string;
}

interface InventoryManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInventoryUpdated: () => void;
}

const InventoryManagementDialog: React.FC<InventoryManagementDialogProps> = ({
  open,
  onOpenChange,
  onInventoryUpdated
}) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    cantidad: 0,
    unidadMedida: '',
    precioUnitario: 0,
    stockMinimo: 0
  });

  useEffect(() => {
    if (open) {
      loadInventory();
    }
  }, [open]);

  const loadInventory = () => {
    const storedInventory = JSON.parse(localStorage.getItem('inventario_acopio') || '[]');
    setInventory(storedInventory);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.categoria) {
      toast.error('Nombre y categoría son obligatorios');
      return;
    }

    if (editingItem) {
      // Editar item existente
      const updatedInventory = inventory.map(item => 
        item.id === editingItem.id 
          ? { ...item, ...formData }
          : item
      );
      setInventory(updatedInventory);
      localStorage.setItem('inventario_acopio', JSON.stringify(updatedInventory));
      toast.success('Item actualizado exitosamente');
    } else {
      // Crear nuevo item
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        ...formData,
        fechaRegistro: new Date().toISOString()
      };
      const updatedInventory = [...inventory, newItem];
      setInventory(updatedInventory);
      localStorage.setItem('inventario_acopio', JSON.stringify(updatedInventory));
      toast.success('Item creado exitosamente');
    }

    resetForm();
    onInventoryUpdated();
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      nombre: item.nombre,
      categoria: item.categoria,
      cantidad: item.cantidad,
      unidadMedida: item.unidadMedida,
      precioUnitario: item.precioUnitario,
      stockMinimo: item.stockMinimo
    });
  };

  const handleDelete = (itemId: string) => {
    const updatedInventory = inventory.filter(item => item.id !== itemId);
    setInventory(updatedInventory);
    localStorage.setItem('inventario_acopio', JSON.stringify(updatedInventory));
    toast.success('Item eliminado exitosamente');
    onInventoryUpdated();
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      nombre: '',
      categoria: '',
      cantidad: 0,
      unidadMedida: '',
      precioUnitario: 0,
      stockMinimo: 0
    });
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.cantidad <= item.stockMinimo) {
      return { status: 'low', color: 'destructive', text: 'Stock Bajo' };
    }
    if (item.cantidad <= item.stockMinimo * 1.5) {
      return { status: 'medium', color: 'secondary', text: 'Stock Medio' };
    }
    return { status: 'good', color: 'default', text: 'Stock Bueno' };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Gestión de Inventario Acopio
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Formulario */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                {editingItem ? 'Editar Item' : 'Nuevo Item'}
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
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      value={formData.cantidad}
                      onChange={(e) => setFormData({ ...formData, cantidad: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unidadMedida">Unidad</Label>
                    <Input
                      id="unidadMedida"
                      value={formData.unidadMedida}
                      onChange={(e) => setFormData({ ...formData, unidadMedida: e.target.value })}
                      placeholder="m³, kg, unidad"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="precioUnitario">Precio Unitario</Label>
                    <Input
                      id="precioUnitario"
                      type="number"
                      step="0.01"
                      value={formData.precioUnitario}
                      onChange={(e) => setFormData({ ...formData, precioUnitario: parseFloat(e.target.value) || 0 })}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stockMinimo">Stock Mínimo</Label>
                    <Input
                      id="stockMinimo"
                      type="number"
                      value={formData.stockMinimo}
                      onChange={(e) => setFormData({ ...formData, stockMinimo: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingItem ? 'Actualizar' : 'Crear'} Item
                  </Button>
                  {editingItem && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Inventario */}
          <Card>
            <CardHeader>
              <CardTitle>Inventario Registrado ({inventory.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {inventory.length > 0 ? (
                  inventory.map((item) => {
                    const stockStatus = getStockStatus(item);
                    return (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{item.nombre}</h4>
                            {stockStatus.status === 'low' && (
                              <AlertTriangle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>📦 {item.categoria}</p>
                            <p>📊 {item.cantidad} {item.unidadMedida}</p>
                            <p>💰 ${item.precioUnitario} por {item.unidadMedida}</p>
                          </div>
                          <Badge variant={stockStatus.color as any} className="mt-1">
                            {stockStatus.text}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay items en inventario
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

export default InventoryManagementDialog;
