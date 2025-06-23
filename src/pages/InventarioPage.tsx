import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { loadInventarioAcopio, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { toast } from "sonner";
import { ArrowLeft, Download, FileText, Edit, Trash2, Package, TrendingUp, AlertTriangle, Plus, BarChart3 } from 'lucide-react';
import * as XLSX from 'xlsx';
import DesgloseMaterialModal from '@/components/DesgloseMaterialModal';

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
  const [modalDesgloseOpen, setModalDesgloseOpen] = useState(false);

  // ... keep existing code (useEffect, helper functions)
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

  const handleDesgloseRealizado = (movimiento: { cantidadRecebo: number; subproductos: { [key: string]: number } }) => {
    if (!movimiento) return;

    const { cantidadRecebo, subproductos } = movimiento;

    const inventarioActual = [...inventario];
    const idxRecebo = inventarioActual.findIndex(i => i.tipo_material.toLowerCase().includes("recebo común"));
    if (idxRecebo === -1) return;

    inventarioActual[idxRecebo].cantidad_disponible -= cantidadRecebo;

    Object.entries(subproductos).forEach(([nombre, cantidad]) => {
      if (!cantidad || cantidad <= 0) return;
      const idxSub = inventarioActual.findIndex(i => i.tipo_material === nombre);
      if (idxSub === -1) {
        inventarioActual.push({
          id: Date.now().toString() + Math.random().toString().slice(2,7),
          tipo_material: nombre,
          cantidad_disponible: cantidad,
          costo_promedio_m3: 0,
        });
      } else {
        inventarioActual[idxSub].cantidad_disponible += cantidad;
      }
    });

    guardarInventario(inventarioActual);
    cargarInventario();
  };

  const stats = generarReporteStock();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 mb-8">
            <div className="space-y-3">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Inventario de Acopio
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Gestiona el inventario de materiales en acopio de forma sencilla y eficiente
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 rounded-xl"
            >
              <ArrowLeft className="h-6 w-6 mr-3" />
              Volver al Panel Admin
            </Button>
          </div>
        </div>

        {/* Estadísticas del inventario */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-lg font-bold mb-2">Total Materiales</p>
                  <p className="text-4xl font-bold text-blue-700">{stats.totalMateriales}</p>
                </div>
                <div className="p-4 bg-blue-200 rounded-2xl">
                  <Package className="h-10 w-10 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-lg font-bold mb-2">Con Stock</p>
                  <p className="text-4xl font-bold text-green-700">{stats.materialesConStock}</p>
                </div>
                <div className="p-4 bg-green-200 rounded-2xl">
                  <TrendingUp className="h-10 w-10 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-lg font-bold mb-2">Sin Stock</p>
                  <p className="text-4xl font-bold text-red-700">{stats.materialesSinStock}</p>
                </div>
                <div className="p-4 bg-red-200 rounded-2xl">
                  <AlertTriangle className="h-10 w-10 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-lg font-bold mb-2">Valor Total</p>
                  <p className="text-4xl font-bold text-purple-700">${stats.valorTotalInventario.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-purple-200 rounded-2xl">
                  <BarChart3 className="h-10 w-10 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botón de Desglose */}
        <div className="flex justify-end mb-8">
          <Button
            variant="default"
            onClick={() => setModalDesgloseOpen(true)}
            className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Package className="h-6 w-6 mr-3" />
            Desglosar/Transformar Material
          </Button>
        </div>

        {/* Agregar Material */}
        <Card className="mb-8 shadow-2xl border-2 border-slate-200 bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                  <Plus className="h-8 w-8 text-blue-600" />
                  Agregar Material al Inventario
                </CardTitle>
                <p className="text-lg text-slate-600 mt-2">Registra nuevos materiales en el sistema de inventario</p>
              </div>
              <Button 
                onClick={exportarReporteStock} 
                variant="outline" 
                className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <Download className="h-6 w-6 mr-3" />
                Exportar Reporte
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <Label htmlFor="tipo_material" className="text-lg font-bold text-slate-700">Tipo de Material</Label>
                <Input
                  type="text"
                  id="tipo_material"
                  name="tipo_material"
                  value={nuevoMaterial.tipo_material}
                  onChange={handleInputChange}
                  className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl"
                  placeholder="Ejemplo: Arena fina, Grava, Recebo común"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="cantidad_disponible" className="text-lg font-bold text-slate-700">Cantidad Disponible (m³)</Label>
                <Input
                  type="number"
                  id="cantidad_disponible"
                  name="cantidad_disponible"
                  value={nuevoMaterial.cantidad_disponible.toString()}
                  onChange={handleInputChange}
                  className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl"
                  placeholder="0"
                />
              </div>
            </div>
            <Button 
              onClick={agregarMaterial}
              className="h-14 px-8 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
            >
              <Plus className="h-6 w-6 mr-3" />
              Agregar Material
            </Button>
          </CardContent>
        </Card>

        {/* Inventario Actual */}
        <Card className="shadow-2xl border-2 border-slate-200 bg-white rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200 p-8">
            <CardTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <FileText className="h-8 w-8 text-slate-600" />
              Inventario Actual de Materiales
            </CardTitle>
            <p className="text-lg text-slate-600 mt-2">
              {inventario.length} materiales registrados en el sistema
            </p>
          </CardHeader>
          <CardContent className="p-8">
            {inventario.length > 0 ? (
              <div className="rounded-2xl border-2 border-slate-200 overflow-hidden shadow-lg">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead 
                        onClick={() => ordenarInventario('tipo_material')} 
                        className="cursor-pointer font-bold text-slate-700 h-16 text-lg hover:text-blue-600 transition-colors"
                      >
                        Tipo de Material
                        {columnaOrdenada === 'tipo_material' && (orden === 'asc' ? ' ▲' : ' ▼')}
                      </TableHead>
                      <TableHead 
                        onClick={() => ordenarInventario('cantidad_disponible')} 
                        className="cursor-pointer font-bold text-slate-700 h-16 text-lg hover:text-blue-600 transition-colors"
                      >
                        Cantidad Disponible (m³)
                        {columnaOrdenada === 'cantidad_disponible' && (orden === 'asc' ? ' ▲' : ' ▼')}
                      </TableHead>
                      <TableHead className="font-bold text-slate-700 h-16 text-lg">Costo Promedio</TableHead>
                      <TableHead className="font-bold text-slate-700 h-16 text-lg">Valor Total</TableHead>
                      <TableHead className="w-40 font-bold text-slate-700 h-16 text-lg">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventario.map((item, index) => (
                      <TableRow 
                        key={item.id}
                        className="hover:bg-blue-50/50 transition-colors duration-200"
                      >
                        <TableCell className="font-semibold text-slate-800 py-6 text-lg">{item.tipo_material}</TableCell>
                        <TableCell className="py-6">
                          <div className="flex items-center gap-3">
                            <span className={`text-lg font-bold ${item.cantidad_disponible <= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                              {item.cantidad_disponible.toLocaleString()}
                            </span>
                            {item.cantidad_disponible <= 0 && (
                              <Badge variant="destructive" className="text-sm px-3 py-1">
                                Sin Stock
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          <span className="text-lg font-semibold text-emerald-600">
                            ${(item.costo_promedio_m3 || 0).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-6">
                          <span className="text-lg font-bold text-purple-600">
                            ${((item.cantidad_disponible * (item.costo_promedio_m3 || 0))).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-6">
                          {editandoId === item.id ? (
                            <div className="flex gap-3">
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={guardarEdicion}
                                className="h-11 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Guardar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setEditandoId(null)}
                                className="h-11 px-4 text-sm"
                              >
                                Cancelar
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-3">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleEditarClick(item)}
                                className="h-11 w-11 p-0 border-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <Edit className="h-5 w-5" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    className="h-11 w-11 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="max-w-md bg-white shadow-2xl border-0 rounded-2xl">
                                  <AlertDialogHeader className="text-center space-y-4 pb-4">
                                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                                      <AlertTriangle className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="space-y-2">
                                      <AlertDialogTitle className="text-2xl font-bold text-slate-800">
                                        ¿Confirmar Eliminación?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription className="text-base text-slate-600 leading-relaxed">
                                        Esta acción eliminará permanentemente el material <span className="font-bold text-slate-800">"{item.tipo_material}"</span> del inventario.
                                        <br /><br />
                                        Esta acción no se puede deshacer.
                                      </AlertDialogDescription>
                                    </div>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-3 pt-6 border-t border-slate-200">
                                    <AlertDialogCancel className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50">
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleEliminar(item.id)}
                                      className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Eliminar Material
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-20 space-y-6">
                <div className="mx-auto w-28 h-28 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                  <Package className="w-14 h-14 text-slate-400" />
                </div>
                <div className="space-y-3">
                  <p className="text-2xl font-semibold text-slate-600">No hay materiales en inventario</p>
                  <p className="text-lg text-slate-500 max-w-md mx-auto leading-relaxed">
                    Agrega nuevos materiales para comenzar a gestionar el inventario de acopio
                  </p>
                </div>
              </div>
            )}

            {editandoId && (
              <Dialog open={!!editandoId} onOpenChange={() => setEditandoId(null)}>
                <DialogContent className="sm:max-w-[500px] bg-white shadow-2xl border-0 rounded-2xl">
                  <DialogHeader className="text-center space-y-4 pb-6">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Edit className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <DialogTitle className="text-2xl font-bold text-slate-800">Editar Material</DialogTitle>
                    </div>
                  </DialogHeader>
                  <div className="space-y-6 pt-6">
                    <div className="space-y-3">
                      <Label htmlFor="tipo_material_edit" className="text-lg font-bold text-slate-700">Tipo de Material</Label>
                      <Input
                        type="text"
                        id="tipo_material_edit"
                        name="tipo_material"
                        value={materialEditado.tipo_material}
                        onChange={handleEditarInputChange}
                        className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="cantidad_disponible_edit" className="text-lg font-bold text-slate-700">Cantidad Disponible (m³)</Label>
                      <Input
                        type="number"
                        id="cantidad_disponible_edit"
                        name="cantidad_disponible"
                        value={materialEditado.cantidad_disponible.toString()}
                        onChange={handleEditarInputChange}
                        className="h-14 text-lg border-2 border-slate-300 focus:border-blue-500 rounded-xl"
                      />
                    </div>
                    <div className="flex gap-3 pt-6 border-t border-slate-200">
                      <Button
                        variant="outline"
                        onClick={() => setEditandoId(null)}
                        className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        onClick={guardarEdicion}
                        className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
        
        <DesgloseMaterialModal
          open={modalDesgloseOpen}
          onOpenChange={setModalDesgloseOpen}
          inventario={inventario}
          onDesgloseRealizado={handleDesgloseRealizado}
        />
      </div>
    </div>
  );
};

export default InventarioPage;
