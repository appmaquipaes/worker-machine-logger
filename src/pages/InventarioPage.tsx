
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, Edit2, Trash2, History, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import DesgloseMaterialModal from '@/components/DesgloseMaterialModal';
import MovimientoInventarioModal from '@/components/MovimientoInventarioModal';
import { useInventoryMaterials } from '@/context/EnhancedInventoryMaterialsContext';
import { useInventoryOperationsEnhanced } from '@/hooks/useInventoryOperationsEnhanced';
import { InventarioAcopio } from '@/models/InventarioAcopio';
import { Material } from '@/models/Materiales';

const InventarioPage = () => {
  const { toast } = useToast();
  const {
    inventario,
    materiales,
    isLoadingInventario,
    isLoadingMateriales,
    addInventarioItem,
    updateInventarioItem,
    deleteInventarioItem,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    reloadData
  } = useInventoryMaterials();

  const { isProcessing } = useInventoryOperationsEnhanced();

  const [showDesgloseModal, setShowDesgloseModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [editingInventarioItem, setEditingInventarioItem] = useState<InventarioAcopio | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);

  // Estados para formularios
  const [nuevoMaterial, setNuevoMaterial] = useState({
    nombre_material: '',
    valor_por_m3: '',
    precio_venta_m3: '',
    margen_ganancia: ''
  });

  const [nuevoInventario, setNuevoInventario] = useState({
    tipo_material: '',
    cantidad_disponible: '',
    costo_promedio_m3: ''
  });

  const handleAddMaterial = async () => {
    if (!nuevoMaterial.nombre_material || !nuevoMaterial.valor_por_m3) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const success = await addMaterial({
      nombre_material: nuevoMaterial.nombre_material,
      valor_por_m3: parseFloat(nuevoMaterial.valor_por_m3),
      precio_venta_m3: nuevoMaterial.precio_venta_m3 ? parseFloat(nuevoMaterial.precio_venta_m3) : undefined,
      margen_ganancia: nuevoMaterial.margen_ganancia ? parseFloat(nuevoMaterial.margen_ganancia) : undefined
    });

    if (success) {
      toast({
        title: "Éxito",
        description: "Material agregado correctamente"
      });
      setNuevoMaterial({
        nombre_material: '',
        valor_por_m3: '',
        precio_venta_m3: '',
        margen_ganancia: ''
      });
    } else {
      toast({
        title: "Error",
        description: "Error al agregar el material",
        variant: "destructive"
      });
    }
  };

  const handleAddInventario = async () => {
    if (!nuevoInventario.tipo_material || !nuevoInventario.cantidad_disponible) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    const success = await addInventarioItem({
      tipo_material: nuevoInventario.tipo_material,
      cantidad_disponible: parseFloat(nuevoInventario.cantidad_disponible),
      costo_promedio_m3: nuevoInventario.costo_promedio_m3 ? parseFloat(nuevoInventario.costo_promedio_m3) : 0
    });

    if (success) {
      toast({
        title: "Éxito",
        description: "Item de inventario agregado correctamente"
      });
      setNuevoInventario({
        tipo_material: '',
        cantidad_disponible: '',
        costo_promedio_m3: ''
      });
    } else {
      toast({
        title: "Error",
        description: "Error al agregar el item al inventario",
        variant: "destructive"
      });
    }
  };

  const handleDeleteInventario = async (id: string) => {
    const success = await deleteInventarioItem(id);
    if (success) {
      toast({
        title: "Éxito",
        description: "Item eliminado del inventario"
      });
    } else {
      toast({
        title: "Error",
        description: "Error al eliminar el item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    const success = await deleteMaterial(id);
    if (success) {
      toast({
        title: "Éxito",
        description: "Material eliminado correctamente"
      });
    } else {
      toast({
        title: "Error",
        description: "Error al eliminar el material",
        variant: "destructive"
      });
    }
  };

  const totalValorInventario = inventario.reduce((total, item) => 
    total + (item.cantidad_disponible * item.costo_promedio_m3), 0
  );

  const materialesConStockBajo = inventario.filter(item => item.cantidad_disponible < 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestión de Inventario y Materiales
          </h1>
          <p className="text-gray-600">
            Administra el inventario de acopio y catálogo de materiales
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-gray-900">{inventario.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Valor Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalValorInventario.toLocaleString('es-CO')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Stock Bajo</p>
                  <p className="text-2xl font-bold text-gray-900">{materialesConStockBajo.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Materiales</p>
                  <p className="text-2xl font-bold text-gray-900">{materiales.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alertas de Stock Bajo */}
        {materialesConStockBajo.length > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Atención:</strong> {materialesConStockBajo.length} materiales tienen stock bajo (menos de 10 m³).
            </AlertDescription>
          </Alert>
        )}

        {/* Botones de Acción */}
        <div className="flex gap-4 mb-6">
          <Button onClick={() => setShowMovimientoModal(true)} className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Registrar Movimiento
          </Button>
          <Button onClick={() => setShowDesgloseModal(true)} variant="outline" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Desglose de Material
          </Button>
          <Button onClick={reloadData} variant="outline" disabled={isLoadingInventario || isLoadingMateriales}>
            Actualizar Datos
          </Button>
        </div>

        <Tabs defaultValue="inventario" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inventario">Inventario de Acopio</TabsTrigger>
            <TabsTrigger value="materiales">Catálogo de Materiales</TabsTrigger>
          </TabsList>

          <TabsContent value="inventario" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Items en Inventario</CardTitle>
                <CardDescription>Lista detallada del inventario actual</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingInventario ? (
                  <p>Cargando inventario...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Material
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad (m³)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Costo Promedio (m³)
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {inventario.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.tipo_material}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.cantidad_disponible.toLocaleString('es-CO')} m³
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${item.costo_promedio_m3.toLocaleString('es-CO')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                onClick={() => setEditingInventarioItem(item)}
                                variant="ghost"
                                className="mr-2"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteInventario(item.id)}
                                variant="ghost"
                                className="text-red-600"
                                disabled={isProcessing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agregar Item al Inventario</CardTitle>
                <CardDescription>Añade un nuevo item al inventario de acopio</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo-material">Tipo de Material</Label>
                    <Input
                      type="text"
                      id="tipo-material"
                      value={nuevoInventario.tipo_material}
                      onChange={(e) => setNuevoInventario({ ...nuevoInventario, tipo_material: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cantidad-disponible">Cantidad Disponible (m³)</Label>
                    <Input
                      type="number"
                      id="cantidad-disponible"
                      value={nuevoInventario.cantidad_disponible}
                      onChange={(e) => setNuevoInventario({ ...nuevoInventario, cantidad_disponible: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="costo-promedio">Costo Promedio (m³)</Label>
                    <Input
                      type="number"
                      id="costo-promedio"
                      value={nuevoInventario.costo_promedio_m3}
                      onChange={(e) => setNuevoInventario({ ...nuevoInventario, costo_promedio_m3: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddInventario} disabled={isProcessing}>
                  Agregar al Inventario
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materiales" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Catálogo de Materiales</CardTitle>
                <CardDescription>Lista detallada de los materiales disponibles</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingMateriales ? (
                  <p>Cargando materiales...</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nombre
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Valor (m³)
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Precio Venta (m³)
                          </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Margen Ganancia (%)
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {materiales.map((material) => (
                          <tr key={material.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {material.nombre_material}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${material.valor_por_m3.toLocaleString('es-CO')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {material.precio_venta_m3 ? `$${material.precio_venta_m3.toLocaleString('es-CO')}` : 'No definido'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {material.margen_ganancia ? `${material.margen_ganancia.toLocaleString('es-CO')}%` : 'No definido'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button
                                onClick={() => setEditingMaterial(material)}
                                variant="ghost"
                                className="mr-2"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDeleteMaterial(material.id)}
                                variant="ghost"
                                className="text-red-600"
                                disabled={isProcessing}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Agregar Material</CardTitle>
                <CardDescription>Añade un nuevo material al catálogo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nombre-material">Nombre del Material</Label>
                    <Input
                      type="text"
                      id="nombre-material"
                      value={nuevoMaterial.nombre_material}
                      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, nombre_material: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor-m3">Valor por m³</Label>
                    <Input
                      type="number"
                      id="valor-m3"
                      value={nuevoMaterial.valor_por_m3}
                      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, valor_por_m3: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="precio-venta-m3">Precio de Venta por m³ (Opcional)</Label>
                    <Input
                      type="number"
                      id="precio-venta-m3"
                      value={nuevoMaterial.precio_venta_m3}
                      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, precio_venta_m3: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="margen-ganancia">Margen de Ganancia (%) (Opcional)</Label>
                    <Input
                      type="number"
                      id="margen-ganancia"
                      value={nuevoMaterial.margen_ganancia}
                      onChange={(e) => setNuevoMaterial({ ...nuevoMaterial, margen_ganancia: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddMaterial} disabled={isProcessing}>
                  Agregar Material
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

        {/* Modales */}
        <DesgloseMaterialModal 
          isOpen={showDesgloseModal}
          onClose={() => setShowDesgloseModal(false)}
        />
        
        <MovimientoInventarioModal 
          isOpen={showMovimientoModal}
          onClose={() => setShowMovimientoModal(false)}
        />
      </div>
    </div>
  );
};

export default InventarioPage;
