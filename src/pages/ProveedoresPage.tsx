
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Package, Building, Store, Settings, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Proveedor, 
  ProductoProveedor,
  loadProveedores, 
  saveProveedores, 
  createProveedor,
  loadProductosProveedores,
  saveProductosProveedores,
  createProductoProveedor,
} from '@/models/Proveedores';
import ProveedorForm, { ProveedorFormData } from '@/components/proveedores/ProveedorForm';
import ProveedorTable from '@/components/proveedores/ProveedorTable';
import ProductoForm, { ProductoFormData } from '@/components/proveedores/ProductoForm';
import ProductoTable from '@/components/proveedores/ProductoTable';

const ProveedoresPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<ProductoProveedor[]>([]);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [editingProducto, setEditingProducto] = useState<ProductoProveedor | null>(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showProveedorDialog, setShowProveedorDialog] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
      return;
    }
    
    setProveedores(loadProveedores());
    setProductos(loadProductosProveedores());
  }, [user, navigate]);
  
  const handleAddProveedor = (data: ProveedorFormData) => {
    const nuevoProveedor = createProveedor(
      data.nombre,
      data.ciudad,
      data.contacto,
      data.correo_electronico,
      data.nit,
      data.tipo_proveedor,
      data.forma_pago,
      data.observaciones
    );
    
    const proveedoresActualizados = [...proveedores, nuevoProveedor];
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    
    setShowProveedorDialog(false);
    toast.success('Proveedor agregado correctamente');
  };
  
  const handleUpdateProveedor = (data: ProveedorFormData) => {
    if (!editingProveedor) return;
    
    const proveedoresActualizados = proveedores.map(proveedor => 
      proveedor.id === editingProveedor.id ? {
        ...proveedor,
        ...data
      } : proveedor
    );
    
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    setEditingProveedor(null);
    setShowProveedorDialog(false);
    toast.success('Proveedor actualizado correctamente');
  };
  
  const handleDeleteProveedor = (id: string) => {
    const proveedoresActualizados = proveedores.filter(proveedor => proveedor.id !== id);
    const productosActualizados = productos.filter(producto => producto.proveedor_id !== id);
    
    saveProveedores(proveedoresActualizados);
    saveProductosProveedores(productosActualizados);
    setProveedores(proveedoresActualizados);
    setProductos(productosActualizados);
    toast.success('Proveedor eliminado correctamente');
    if (selectedProveedor?.id === id) {
      setSelectedProveedor(null);
    }
  };
  
  const openEditProveedor = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setShowProveedorDialog(true);
  };

  const handleAddProducto = (data: ProductoFormData) => {
    if (!selectedProveedor) return;
    
    const nuevoProducto = createProductoProveedor(
      selectedProveedor.id,
      data.tipo_insumo,
      data.nombre_producto,
      data.unidad,
      data.precio_unitario,
      data.observaciones
    );
    
    const productosActualizados = [...productos, nuevoProducto];
    saveProductosProveedores(productosActualizados);
    setProductos(productosActualizados);
    
    setShowProductDialog(false);
    toast.success('Producto agregado correctamente');
  };

  const handleUpdateProducto = (data: ProductoFormData) => {
    if (!editingProducto) return;
    
    const productosActualizados = productos.map(producto => 
      producto.id === editingProducto.id ? {
        ...producto,
        ...data
      } : producto
    );
    
    saveProductosProveedores(productosActualizados);
    setProductos(productosActualizados);
    setEditingProducto(null);
    setShowProductDialog(false);
    toast.success('Producto actualizado correctamente');
  };

  const handleDeleteProducto = (id: string) => {
    const productosActualizados = productos.filter(producto => producto.id !== id);
    saveProductosProveedores(productosActualizados);
    setProductos(productosActualizados);
    toast.success('Producto eliminado correctamente');
  };

  const openEditProducto = (producto: ProductoProveedor) => {
    setEditingProducto(producto);
    setShowProductDialog(true);
  };

  const getProveedorProductos = (proveedorId: string) => {
    return productos.filter(producto => producto.proveedor_id === proveedorId);
  };

  if (!user || user.role !== 'Administrador') return null;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto py-8 px-4">
        {/* Modern Header with improved visual design */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 rounded-3xl mb-12 shadow-2xl">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.08%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
          
          <div className="relative px-8 py-12">
            <div className="flex justify-between items-start mb-8">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/admin')}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="font-medium">Volver al panel admin</span>
              </Button>
              
              <div className="flex items-center gap-2 bg-amber-500/20 backdrop-blur-sm rounded-full px-4 py-2">
                <Settings className="w-4 h-4 text-amber-300" />
                <span className="text-amber-100 text-sm font-medium">Administración</span>
              </div>
            </div>

            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                <Store className="w-10 h-10 text-amber-300" />
              </div>
              
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Gestión de <span className="text-amber-300">Proveedores</span>
                </h1>
                <p className="text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
                  Administra la red completa de proveedores, sus productos y servicios. 
                  Controla inventarios, precios y mantén actualizados los datos de contacto.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">🏪 Red de Proveedores</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">📦 Catálogo de Productos</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-white/90 text-sm">💰 Control de Precios</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="proveedores" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="bg-white/70 backdrop-blur-sm border-0 shadow-lg rounded-xl p-2">
              <TabsTrigger 
                value="proveedores" 
                className="px-6 py-3 rounded-lg font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Users className="w-4 h-4 mr-2" />
                Proveedores
              </TabsTrigger>
              <TabsTrigger 
                value="productos" 
                className="px-6 py-3 rounded-lg font-semibold data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all"
              >
                <Package className="w-4 h-4 mr-2" />
                Productos y Servicios
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="proveedores">
            <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">Lista de Proveedores</CardTitle>
                      <CardDescription className="text-emerald-50 mt-1">
                        Gestiona la información completa de tus proveedores registrados
                      </CardDescription>
                    </div>
                    <div className="ml-auto hidden sm:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-100 text-sm font-medium">{proveedores.length} proveedores activos</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Dialog open={showProveedorDialog} onOpenChange={setShowProveedorDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingProveedor(null);
                        }}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        <span className="font-semibold">Agregar Proveedor</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white shadow-2xl border-0">
                      <DialogHeader className="text-center space-y-4 pb-6 border-b border-slate-200">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Building className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2">
                          <DialogTitle className="text-2xl font-bold text-slate-800">
                            {editingProveedor ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
                          </DialogTitle>
                          <DialogDescription className="text-base text-slate-600">
                            {editingProveedor ? 'Modifica los datos del proveedor seleccionado' : 'Completa la información del nuevo proveedor'}
                          </DialogDescription>
                        </div>
                      </DialogHeader>
                      <ProveedorForm 
                        onSubmit={editingProveedor ? handleUpdateProveedor : handleAddProveedor} 
                        onCancel={() => setShowProveedorDialog(false)} 
                        defaultValues={editingProveedor || undefined}
                        isEditing={!!editingProveedor}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <ProveedorTable 
                  proveedores={proveedores} 
                  onEdit={openEditProveedor} 
                  onDelete={handleDeleteProveedor} 
                  onSelect={setSelectedProveedor}
                  getProductosCount={(id) => getProveedorProductos(id).length}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="productos">
            <Card className="border-0 shadow-2xl bg-white/70 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-bold">Productos y Servicios</CardTitle>
                      <CardDescription className="text-blue-50 mt-1">
                        Gestiona el catálogo completo de productos y servicios de tus proveedores
                      </CardDescription>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <Select
                    value={selectedProveedor?.id || ""}
                    onValueChange={(value) => {
                      const proveedor = proveedores.find(p => p.id === value);
                      setSelectedProveedor(proveedor || null);
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[250px] bg-white/10 border-white/20 text-white placeholder:text-white/70 h-12">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedProveedor && (
                    <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                      <DialogTrigger asChild>
                        <Button 
                          onClick={() => {
                            setEditingProducto(null);
                          }}
                          className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl px-6 py-3 transition-all duration-300 hover:scale-105"
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          <span className="font-semibold">Agregar Producto</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] bg-white shadow-2xl border-0">
                        <DialogHeader className="text-center space-y-4 pb-6 border-b border-slate-200">
                          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <Package className="h-8 w-8 text-white" />
                          </div>
                          <div className="space-y-2">
                            <DialogTitle className="text-2xl font-bold text-slate-800">
                              {editingProducto ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                            </DialogTitle>
                            <DialogDescription className="text-base text-slate-600">
                              {editingProducto ? 'Modifica el producto o servicio seleccionado' : `Agregar producto para ${selectedProveedor.nombre}`}
                            </DialogDescription>
                          </div>
                        </DialogHeader>
                        <ProductoForm 
                          onSubmit={editingProducto ? handleUpdateProducto : handleAddProducto} 
                          onCancel={() => setShowProductDialog(false)} 
                          defaultValues={editingProducto || undefined}
                          isEditing={!!editingProducto}
                          proveedorNombre={selectedProveedor.nombre}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {selectedProveedor ? (
                  <div>
                    <div className="mb-6 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">Productos de: {selectedProveedor.nombre}</h3>
                          <p className="text-sm text-slate-600">Tipo: {selectedProveedor.tipo_proveedor} • Ciudad: {selectedProveedor.ciudad}</p>
                        </div>
                        <div className="ml-auto bg-white/80 backdrop-blur-sm rounded-full px-4 py-2">
                          <span className="text-emerald-600 text-sm font-medium">
                            {getProveedorProductos(selectedProveedor.id).length} productos registrados
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <ProductoTable 
                      productos={getProveedorProductos(selectedProveedor.id)} 
                      onEdit={openEditProducto} 
                      onDelete={handleDeleteProducto} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-16 space-y-6">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                      <Package className="w-12 h-12 text-slate-400" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-slate-600">Selecciona un proveedor</p>
                      <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                        Selecciona un proveedor para ver y gestionar sus productos y servicios
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProveedoresPage;
