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

  // Lógica para manejador del desglose
  const handleDesgloseRealizado = (movimiento: { cantidadRecebo: number; subproductos: { [key: string]: number } }) => {
    if (!movimiento) return;

    const { cantidadRecebo, subproductos } = movimiento;

    // Buscar Recebo
    const inventarioActual = [...inventario];
    const idxRecebo = inventarioActual.findIndex(i => i.tipo_material.toLowerCase().includes("recebo común"));
    if (idxRecebo === -1) return;

    // Descontar Recebo Común
    inventarioActual[idxRecebo].cantidad_disponible -= cantidadRecebo;

    // Agregar/sumar subproductos al inventario
    Object.entries(subproductos).forEach(([nombre, cantidad]) => {
      if (!cantidad || cantidad <= 0) return;
      const idxSub = inventarioActual.findIndex(i => i.tipo_material === nombre);
      if (idxSub === -1) {
        // Crear nueva línea
        inventarioActual.push({
          id: Date.now().toString() + Math.random().toString().slice(2,7),
          tipo_material: nombre,
          cantidad_disponible: cantidad,
          costo_promedio_m3: 0, // Se puede ajustar según lógica contable
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
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Inventario de Acopio
            </h1>
            <p className="text-lg text-slate-600">
              Gestiona el inventario de materiales en acopio
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 h-12 px-6 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
      </div>

      {/* Estadísticas del inventario */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total Materiales</p>
                <p className="text-3xl font-bold text-blue-700">{stats.totalMateriales}</p>
              </div>
              <div className="p-3 bg-blue-200 rounded-xl">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Con Stock</p>
                <p className="text-3xl font-bold text-green-700">{stats.materialesConStock}</p>
              </div>
              <div className="p-3 bg-green-200 rounded-xl">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Sin Stock</p>
                <p className="text-3xl font-bold text-red-700">{stats.materialesSinStock}</p>
              </div>
              <div className="p-3 bg-red-200 rounded-xl">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">Valor Total</p>
                <p className="text-3xl font-bold text-purple-700">${stats.valorTotalInventario.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-xl">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mb-4">
        <Button
          variant="default"
          onClick={() => setModalDesgloseOpen(true)}
          className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white font-semibold px-6 h-10 shadow-lg hover:from-yellow-500 hover:to-yellow-300"
        >
          Desglosar/Transformar Material
        </Button>
      </div>

      {/* Agregar Material */}
      <Card className="mb-8 shadow-2xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">Agregar Material</CardTitle>
            </div>
            <Button 
              onClick={exportarReporteStock} 
              variant="outline" 
              className="flex items-center gap-2 h-12 px-6 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Exportar Reporte
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="tipo_material" className="text-slate-700 font-semibold">Tipo de Material</Label>
              <Input
                type="text"
                id="tipo_material"
                name="tipo_material"
                value={nuevoMaterial.tipo_material}
                onChange={handleInputChange}
                className="h-12 border-slate-300 focus:border-blue-500"
                placeholder="Ej: Arena fina, Grava"
              />
            </div>
            <div>
              <Label htmlFor="cantidad_disponible" className="text-slate-700 font-semibold">Cantidad Disponible (m³)</Label>
              <Input
                type="number"
                id="cantidad_disponible"
                name="cantidad_disponible"
                value={nuevoMaterial.cantidad_disponible.toString()}
                onChange={handleInputChange}
                className="h-12 border-slate-300 focus:border-blue-500"
                placeholder="0"
              />
            </div>
          </div>
          <Button 
            onClick={agregarMaterial}
            className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Plus className="mr-2 h-5 w-5" />
            Agregar Material
          </Button>
        </CardContent>
      </Card>

      {/* Inventario Actual */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-2xl font-bold text-slate-800">Inventario Actual</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          {inventario.length > 0 ? (
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableHead 
                      onClick={() => ordenarInventario('tipo_material')} 
                      className="cursor-pointer font-bold text-slate-700 h-14 hover:text-blue-600 transition-colors"
                    >
                      Tipo de Material
                      {columnaOrdenada === 'tipo_material' && (orden === 'asc' ? ' ▲' : ' ▼')}
                    </TableHead>
                    <TableHead 
                      onClick={() => ordenarInventario('cantidad_disponible')} 
                      className="cursor-pointer font-bold text-slate-700 h-14 hover:text-blue-600 transition-colors"
                    >
                      Cantidad Disponible (m³)
                      {columnaOrdenada === 'cantidad_disponible' && (orden === 'asc' ? ' ▲' : ' ▼')}
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Costo Promedio</TableHead>
                    <TableHead className="font-bold text-slate-700 h-14">Valor Total</TableHead>
                    <TableHead className="w-32 font-bold text-slate-700 h-14">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventario.map((item, index) => (
                    <TableRow 
                      key={item.id}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      <TableCell className="font-semibold text-slate-800 py-4">{item.tipo_material}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${item.cantidad_disponible <= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {item.cantidad_disponible.toLocaleString()}
                          </span>
                          {item.cantidad_disponible <= 0 && (
                            <Badge variant="destructive" className="text-xs">
                              Sin Stock
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-semibold text-emerald-600">
                          ${(item.costo_promedio_m3 || 0).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="font-bold text-purple-600">
                          ${((item.cantidad_disponible * (item.costo_promedio_m3 || 0))).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {editandoId === item.id ? (
                          <div className="flex gap-2">
                            <Button 
                              variant="default" 
                              size="sm" 
                              onClick={guardarEdicion}
                              className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Guardar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => setEditandoId(null)}
                              className="h-9 px-3"
                            >
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditarClick(item)}
                              className="h-9 w-9 p-0 border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  className="h-9 w-9 p-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="max-w-md bg-white shadow-2xl border-0">
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
            <div className="text-center py-16 space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                <Package className="w-12 h-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-600">No hay materiales en inventario</p>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                  Agrega nuevos materiales para comenzar a gestionar el inventario
                </p>
              </div>
            </div>
          )}

          {editandoId && (
            <Dialog open={!!editandoId} onOpenChange={() => setEditandoId(null)}>
              <DialogContent className="sm:max-w-[500px] bg-white shadow-2xl border-0">
                <DialogHeader className="text-center space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Edit className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl font-bold text-slate-800">Editar Material</DialogTitle>
                  </div>
                </DialogHeader>
                <div className="space-y-6 pt-6">
                  <div>
                    <Label htmlFor="tipo_material_edit" className="text-slate-700 font-semibold">Tipo de Material</Label>
                    <Input
                      type="text"
                      id="tipo_material_edit"
                      name="tipo_material"
                      value={materialEditado.tipo_material}
                      onChange={handleEditarInputChange}
                      className="h-12 border-slate-300 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cantidad_disponible_edit" className="text-slate-700 font-semibold">Cantidad Disponible (m³)</Label>
                    <Input
                      type="number"
                      id="cantidad_disponible_edit"
                      name="cantidad_disponible"
                      value={materialEditado.cantidad_disponible.toString()}
                      onChange={handleEditarInputChange}
                      className="h-12 border-slate-300 focus:border-blue-500"
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
  );
};

export default InventarioPage;
