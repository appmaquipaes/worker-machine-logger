import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Store, Package } from 'lucide-react';
import { Proveedor, ProductoProveedor, loadProveedores, saveProveedores, loadProductos, saveProductos, createProveedor, createProductoProveedor } from '@/models/Proveedores';
import ProveedorForm from '@/components/proveedores/ProveedorForm';
import ProveedorTable from '@/components/proveedores/ProveedorTable';
import ProductoForm from '@/components/proveedores/ProductoForm';
import ProductoTable from '@/components/proveedores/ProductoTable';

const ProveedoresPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<ProductoProveedor[]>([]);
  const [showProveedorDialog, setShowProveedorDialog] = useState(false);
  const [showProductoDialog, setShowProductoDialog] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [editingProducto, setEditingProducto] = useState<ProductoProveedor | null>(null);

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
    setProductos(loadProductos());
  }, [user, navigate]);

  const handleProveedorCreated = (formData: any) => {
    let proveedoresActualizados: Proveedor[];
    if (editingProveedor) {
      proveedoresActualizados = proveedores.map(p => 
        p.id === editingProveedor.id ? { ...formData, id: editingProveedor.id } : p
      );
      toast.success('Proveedor actualizado exitosamente');
    } else {
      const nuevoProveedor = createProveedor(
        formData.nombre,
        formData.ciudad,
        formData.contacto,
        formData.correo_electronico,
        formData.nit,
        formData.tipo_proveedor,
        formData.forma_pago,
        formData.observaciones
      );
      proveedoresActualizados = [...proveedores, nuevoProveedor];
      toast.success('Proveedor agregado exitosamente');
    }
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    setShowProveedorDialog(false);
    setEditingProveedor(null);
  };

  const handleProductoCreated = (formData: any) => {
    let productosActualizados: ProductoProveedor[];
    if (editingProducto) {
      productosActualizados = productos.map(p => 
        p.id === editingProducto.id ? { ...formData, id: editingProducto.id, proveedor_id: editingProducto.proveedor_id } : p
      );
      toast.success('Producto actualizado exitosamente');
    } else {
      // For new products, we'll use the first provider for now
      const proveedorId = proveedores.length > 0 ? proveedores[0].id : 'default';
      const nuevoProducto = createProductoProveedor(
        proveedorId,
        formData.tipo_insumo,
        formData.nombre_producto,
        formData.unidad,
        formData.precio_unitario,
        formData.observaciones
      );
      productosActualizados = [...productos, nuevoProducto];
      toast.success('Producto agregado exitosamente');
    }
    saveProductos(productosActualizados);
    setProductos(productosActualizados);
    setShowProductoDialog(false);
    setEditingProducto(null);
  };

  const handleEditProveedor = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setShowProveedorDialog(true);
  };

  const handleEditProducto = (producto: ProductoProveedor) => {
    setEditingProducto(producto);
    setShowProductoDialog(true);
  };

  const handleDeleteProveedor = (id: string) => {
    const proveedoresActualizados = proveedores.filter(p => p.id !== id);
    saveProveedores(proveedoresActualizados);
    setProveedores(proveedoresActualizados);
    toast.success('Proveedor eliminado');
  };

  const handleDeleteProducto = (id: string) => {
    const productosActualizados = productos.filter(p => p.id !== id);
    saveProductos(productosActualizados);
    setProductos(productosActualizados);
    toast.success('Producto eliminado');
  };

  const handleCancelProveedor = () => {
    setShowProveedorDialog(false);
    setEditingProveedor(null);
  };

  const handleCancelProducto = () => {
    setShowProductoDialog(false);
    setEditingProducto(null);
  };

  const getProductosCount = (proveedorId: string): number => {
    return productos.filter(p => p.proveedor_id === proveedorId).length;
  };

  const handleSelectProveedor = (proveedor: Proveedor) => {
    // Implementation for selecting proveedor if needed
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Gestión de Proveedores
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Administra proveedores y sus productos/servicios
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 h-12 px-6 font-semibold bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 shadow-sm hover:scale-105 hover:shadow-md"
          >
            <ArrowLeft size={18} />
            Volver al Panel Admin
          </Button>
        </div>
      </div>

      <Tabs defaultValue="proveedores" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
          <TabsTrigger value="proveedores" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Store className="mr-2 h-4 w-4" />
            Proveedores
          </TabsTrigger>
          <TabsTrigger value="productos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            <Package className="mr-2 h-4 w-4" />
            Productos y Servicios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proveedores">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-green-800">Proveedores</CardTitle>
                  <CardDescription className="text-green-600">
                    Gestiona la información de tus proveedores
                  </CardDescription>
                </div>
                <Dialog open={showProveedorDialog} onOpenChange={(open) => {
                  setShowProveedorDialog(open);
                  if (!open) setEditingProveedor(null);
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Proveedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-green-800">
                        {editingProveedor ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
                      </DialogTitle>
                      <DialogDescription className="text-green-600">
                        {editingProveedor ? 'Modifica los datos del proveedor' : 'Completa la información del nuevo proveedor'}
                      </DialogDescription>
                    </DialogHeader>
                    <ProveedorForm
                      defaultValues={editingProveedor || undefined}
                      onSubmit={handleProveedorCreated}
                      onCancel={handleCancelProveedor}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ProveedorTable
                proveedores={proveedores}
                onEdit={handleEditProveedor}
                onDelete={handleDeleteProveedor}
                onSelect={handleSelectProveedor}
                getProductosCount={getProductosCount}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="productos">
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl font-bold text-blue-800">Productos y Servicios</CardTitle>
                  <CardDescription className="text-blue-600">
                    Gestiona el catálogo de productos y servicios
                  </CardDescription>
                </div>
                <Dialog open={showProductoDialog} onOpenChange={(open) => {
                  setShowProductoDialog(open);
                  if (!open) setEditingProducto(null);
                }}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar Producto/Servicio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-blue-800">
                        {editingProducto ? 'Editar Producto/Servicio' : 'Agregar Nuevo Producto/Servicio'}
                      </DialogTitle>
                      <DialogDescription className="text-blue-600">
                        {editingProducto ? 'Modifica los datos del producto/servicio' : 'Completa la información del nuevo producto/servicio'}
                      </DialogDescription>
                    </DialogHeader>
                    <ProductoForm
                      defaultValues={editingProducto || undefined}
                      onSubmit={handleProductoCreated}
                      onCancel={handleCancelProducto}
                      proveedorNombre=""
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ProductoTable
                productos={productos}
                onEdit={handleEditProducto}
                onDelete={handleDeleteProducto}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProveedoresPage;
