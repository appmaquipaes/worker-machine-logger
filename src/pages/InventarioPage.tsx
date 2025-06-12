import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Report } from '@/types/report';
import { loadInventarioAcopio, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { toast } from "sonner";

const InventarioPage: React.FC = () => {
  const [inventario, setInventario] = useState<any[]>([]);
  const [nuevoMaterial, setNuevoMaterial] = useState({
    tipo_material: '',
    cantidad_disponible: 0,
  });
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [materialEditado, setMaterialEditado] = useState({
    id: '',
    tipo_material: '',
    cantidad_disponible: 0,
  });
  const [orden, setOrden] = useState<'asc' | 'desc'>('asc');
  const [columnaOrdenada, setColumnaOrdenada] = useState<string>('tipo_material');

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = () => {
    const inventarioCargado = loadInventarioAcopio();
    setInventario(inventarioCargado);
  };

  const guardarInventario = (inventarioActualizado: any[]) => {
    saveInventarioAcopio(inventarioActualizado);
    setInventario(inventarioActualizado);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoMaterial(prev => ({ ...prev, [name]: value }));
  };

  const agregarMaterial = () => {
    if (!nuevoMaterial.tipo_material.trim() || nuevoMaterial.cantidad_disponible <= 0) {
      toast.error('Por favor, ingrese un tipo de material y una cantidad válida.');
      return;
    }

    const nuevoItem = {
      id: Date.now().toString(),
      tipo_material: nuevoMaterial.tipo_material,
      cantidad_disponible: parseFloat(nuevoMaterial.cantidad_disponible.toString()),
    };

    const inventarioActualizado = [...inventario, nuevoItem];
    guardarInventario(inventarioActualizado);
    setNuevoMaterial({ tipo_material: '', cantidad_disponible: 0 });
    toast.success('Material agregado al inventario.');
  };

  const handleEditarClick = (item: any) => {
    setEditandoId(item.id);
    setMaterialEditado({
      id: item.id,
      tipo_material: item.tipo_material,
      cantidad_disponible: item.cantidad_disponible,
    });
  };

  const handleEditarInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMaterialEditado(prev => ({ ...prev, [name]: value }));
  };

  const guardarEdicion = () => {
    if (!materialEditado.tipo_material.trim() || materialEditado.cantidad_disponible <= 0) {
      toast.error('Por favor, ingrese un tipo de material y una cantidad válida.');
      return;
    }

    const inventarioActualizado = inventario.map(item =>
      item.id === editandoId
        ? {
            ...item,
            tipo_material: materialEditado.tipo_material,
            cantidad_disponible: parseFloat(materialEditado.cantidad_disponible.toString()),
          }
        : item
    );

    guardarInventario(inventarioActualizado);
    setEditandoId(null);
    toast.success('Inventario actualizado.');
  };

  const handleEliminar = (id: string) => {
    const inventarioActualizado = inventario.filter(item => item.id !== id);
    guardarInventario(inventarioActualizado);
    toast.success('Material eliminado del inventario.');
  };

  const ordenarInventario = (columna: string) => {
    if (columnaOrdenada === columna) {
      setOrden(orden === 'asc' ? 'desc' : 'asc');
    } else {
      setColumnaOrdenada(columna);
      setOrden('asc');
    }

    const inventarioOrdenado = [...inventario].sort((a: any, b: any) => {
      const factorOrden = orden === 'asc' ? 1 : -1;

      if (columna === 'cantidad_disponible') {
        return factorOrden * (a[columna] - b[columna]);
      } else {
        return factorOrden * a[columna].localeCompare(b[columna]);
      }
    });

    setInventario(inventarioOrdenado);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Inventario de Acopio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="tipo_material">Tipo de Material</Label>
              <Input
                type="text"
                id="tipo_material"
                name="tipo_material"
                value={nuevoMaterial.tipo_material}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label htmlFor="cantidad_disponible">Cantidad Disponible (m³)</Label>
              <Input
                type="number"
                id="cantidad_disponible"
                name="cantidad_disponible"
                value={nuevoMaterial.cantidad_disponible.toString()}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <Button onClick={agregarMaterial}>Agregar Material</Button>

          <div className="mt-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => ordenarInventario('tipo_material')} className="cursor-pointer">
                    Tipo de Material
                    {columnaOrdenada === 'tipo_material' && (orden === 'asc' ? ' ▲' : ' ▼')}
                  </TableHead>
                  <TableHead onClick={() => ordenarInventario('cantidad_disponible')} className="cursor-pointer">
                    Cantidad Disponible (m³)
                    {columnaOrdenada === 'cantidad_disponible' && (orden === 'asc' ? ' ▲' : ' ▼')}
                  </TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventario.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.tipo_material}</TableCell>
                    <TableCell>{item.cantidad_disponible}</TableCell>
                    <TableCell className="text-right">
                      {editandoId === item.id ? (
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" onClick={guardarEdicion}>Guardar</Button>
                          <Button variant="ghost" onClick={() => setEditandoId(null)}>Cancelar</Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => handleEditarClick(item)}>Editar</Button>
                          <Button variant="destructive" onClick={() => handleEliminar(item.id)}>Eliminar</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {editandoId && (
            <Dialog open={!!editandoId} onOpenChange={() => setEditandoId(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Material</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="tipo_material_edit">Tipo de Material</Label>
                    <Input
                      type="text"
                      id="tipo_material_edit"
                      name="tipo_material"
                      value={materialEditado.tipo_material}
                      onChange={handleEditarInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cantidad_disponible_edit">Cantidad Disponible (m³)</Label>
                    <Input
                      type="number"
                      id="cantidad_disponible_edit"
                      name="cantidad_disponible"
                      value={materialEditado.cantidad_disponible.toString()}
                      onChange={handleEditarInputChange}
                    />
                  </div>
                </div>
                <Button onClick={guardarEdicion}>Guardar Cambios</Button>
              </DialogContent>
            </Dialog>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventarioPage;
