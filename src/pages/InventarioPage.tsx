
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { loadInventarioAcopio, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { toast } from "sonner";
import { ArrowLeft, Download, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';

const InventarioPage: React.FC = () => {
  const navigate = useNavigate();
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
      costo_promedio_m3: 0,
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

  const exportarReporteStock = () => {
    if (inventario.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = inventario.map(item => ({
      'Tipo de Material': item.tipo_material,
      'Cantidad Disponible (m³)': item.cantidad_disponible,
      'Costo Promedio por m³': item.costo_promedio_m3 ? `$${item.costo_promedio_m3.toLocaleString()}` : '$0',
      'Valor Total Inventario': item.costo_promedio_m3 ? `$${(item.cantidad_disponible * item.costo_promedio_m3).toLocaleString()}` : '$0',
      'Estado': item.cantidad_disponible > 0 ? 'Disponible' : 'Sin Stock',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reporte Stock');
    
    const fileName = `reporte_stock_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte de stock exportado correctamente');
  };

  const generarReporteStock = () => {
    const totalMateriales = inventario.length;
    const materialesConStock = inventario.filter(item => item.cantidad_disponible > 0).length;
    const materialesSinStock = totalMateriales - materialesConStock;
    const valorTotalInventario = inventario.reduce((total, item) => 
      total + (item.cantidad_disponible * (item.costo_promedio_m3 || 0)), 0
    );

    return {
      totalMateriales,
      materialesConStock,
      materialesSinStock,
      valorTotalInventario
    };
  };

  const stats = generarReporteStock();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Inventario de Acopio</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Gestiona el inventario de materiales en acopio
        </p>
      </div>

      {/* Estadísticas del inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.totalMateriales}</div>
            <div className="text-sm text-muted-foreground">Total Materiales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.materialesConStock}</div>
            <div className="text-sm text-muted-foreground">Con Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.materialesSinStock}</div>
            <div className="text-sm text-muted-foreground">Sin Stock</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">${stats.valorTotalInventario.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Valor Total</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Agregar Material</CardTitle>
            <Button onClick={exportarReporteStock} variant="outline" className="flex items-center gap-2">
              <Download size={16} />
              Exportar Reporte
            </Button>
          </div>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inventario Actual</CardTitle>
        </CardHeader>
        <CardContent>
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
                  <TableHead>Costo Promedio</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventario.map(item => (
                  <TableRow key={item.id}>
                    <TableCell>{item.tipo_material}</TableCell>
                    <TableCell>
                      <span className={item.cantidad_disponible <= 0 ? 'text-red-600 font-bold' : ''}>
                        {item.cantidad_disponible.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>${(item.costo_promedio_m3 || 0).toLocaleString()}</TableCell>
                    <TableCell>${((item.cantidad_disponible * (item.costo_promedio_m3 || 0))).toLocaleString()}</TableCell>
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
