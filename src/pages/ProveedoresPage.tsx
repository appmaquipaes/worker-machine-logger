
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Search, Building2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Proveedor,
  ProductoProveedor,
  createProveedor,
  createProductoProveedor,
  TipoProveedor
} from '@/models/Proveedores';
import { useProveedoresPersistence } from '@/hooks/useProveedoresPersistence';
import ProveedorTable from '@/components/proveedores/ProveedorTable';
import ProveedorForm, { ProveedorFormData } from '@/components/proveedores/ProveedorForm';
import ProductoForm, { ProductoFormData } from '@/components/proveedores/ProductoForm';
import ProductoTable from '@/components/proveedores/ProductoTable';

const ProveedoresPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showProductsView, setShowProductsView] = useState(false);

  const {
    proveedores,
    productosProveedores,
    addProveedor,
    addProductoProveedor,
    updateProveedor,
    deleteProveedor
  } = useProveedoresPersistence();

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
  }, [user, navigate]);

  // Filtrar proveedores por término de búsqueda
  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.ciudad.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.tipo_proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProveedor = (data: ProveedorFormData) => {
    const nuevoProveedor = createProveedor(
      data.nombre,
      data.ciudad,
      data.contacto,
      data.contacto,
      data.correo_electronico,
      data.observaciones,
      data.tipo_proveedor as TipoProveedor,
      data.nit,
      data.forma_pago
    );
    
    const success = addProveedor(nuevoProveedor);
    if (success) {
      setShowAddDialog(false);
      toast.success('Proveedor agregado correctamente');
    }
  };

  const handleEditProveedor = (data: ProveedorFormData) => {
    if (!editingProveedor) return;
    
    const success = updateProveedor(editingProveedor.id, {
      nombre: data.nombre,
      ciudad: data.ciudad,
      contacto_principal: data.contacto,
      contacto: data.contacto,
      correo_electronico: data.correo_electronico,
      email: data.correo_electronico,
      nit: data.nit,
      tipo_proveedor: data.tipo_proveedor as TipoProveedor,
      forma_pago: data.forma_pago,
      observaciones: data.observaciones
    });
    
    if (success) {
      setEditingProveedor(null);
      toast.success('Proveedor actualizado correctamente');
    }
  };

  const handleDeleteProveedor = (id: string) => {
    deleteProveedor(id);
    toast.success('Proveedor eliminado correctamente');
  };

  const handleAddProducto = (data: ProductoFormData) => {
    if (!selectedProveedor) return;
    
    const nuevoProducto = createProductoProveedor(
      selectedProveedor.id,
      data.nombre_producto,
      data.tipo_insumo,
      data.precio_unitario,
      data.observaciones,
      data.tipo_insumo,
      data.unidad,
      data.precio_unitario
    );
    
    const success = addProductoProveedor(nuevoProducto);
    if (success) {
      setShowProductDialog(false);
      toast.success('Producto agregado correctamente');
    }
  };

  const openEditProveedor = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
  };

  const openProductDialog = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setShowProductDialog(true);
  };

  const openProductsView = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor);
    setShowProductsView(true);
  };

  const getProductosCount = (proveedorId: string): number => {
    return productosProveedores.filter(p => p.proveedor_id === proveedorId).length;
  };

  const getProveedorProducts = (proveedorId: string): ProductoProveedor[] => {
    return productosProveedores.filter(p => p.proveedor_id === proveedorId);
  };

  const handleDeleteProducto = (id: string) => {
    // Esta función necesitaría ser implementada en el hook
    toast.success('Producto eliminado correctamente');
  };

  const getDefaultValues = (proveedor?: Proveedor): ProveedorFormData | undefined => {
    if (!proveedor) return undefined;
    
    return {
      nombre: proveedor.nombre,
      ciudad: proveedor.ciudad,
      contacto: proveedor.contacto,
      correo_electronico: proveedor.correo_electronico || '',
      nit: proveedor.nit,
      tipo_proveedor: proveedor.tipo_proveedor,
      forma_pago: proveedor.forma_pago || '',
      observaciones: proveedor.observaciones || ''
    };
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header mejorado */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-emerald-500">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-4 mb-4 justify-center lg:justify-start">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-800">
                  Gestión de Proveedores
                </h1>
              </div>
              <p className="text-xl text-slate-600 leading-relaxed">
                Administra proveedores y sus productos de manera eficiente
              </p>
            </div>
            <Button
              onClick={() => navigate('/admin')}
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 hover:border-emerald-500 hover:bg-emerald-50"
            >
              <ArrowLeft className="w-5 h-5 mr-3" />
              Volver al Panel
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda y botón agregar */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre, ciudad o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-14 text-lg border-2 border-slate-200 focus:border-emerald-500 bg-slate-50 focus:bg-white"
              />
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="lg"
              className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-3" />
              Agregar Nuevo Proveedor
            </Button>
          </div>
        </div>

        {/* Tabla de proveedores */}
        <Card className="shadow-xl border-0 overflow-hidden">
          <CardHeader className="bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-800">
                  Lista de Proveedores
                </CardTitle>
                <CardDescription className="text-lg text-slate-600 mt-2">
                  {filteredProveedores.length} proveedor{filteredProveedores.length !== 1 ? 'es' : ''} 
                  {searchTerm && ' encontrado(s)'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ProveedorTable
              proveedores={filteredProveedores}
              onEdit={openEditProveedor}
              onDelete={handleDeleteProveedor}
              onSelect={openProductsView}
              getProductosCount={getProductosCount}
            />
          </CardContent>
        </Card>

        {/* Dialog para agregar proveedor */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-4 pb-6 border-b border-slate-200">
              <DialogTitle className="text-3xl font-bold text-slate-800 text-center">
                Agregar Nuevo Proveedor
              </DialogTitle>
              <DialogDescription className="text-lg text-slate-600 text-center">
                Completa la información del proveedor para agregarlo al sistema
              </DialogDescription>
            </DialogHeader>
            <ProveedorForm
              onSubmit={handleAddProveedor}
              onCancel={() => setShowAddDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para editar proveedor */}
        <Dialog open={!!editingProveedor} onOpenChange={(open) => !open && setEditingProveedor(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-4 pb-6 border-b border-slate-200">
              <DialogTitle className="text-3xl font-bold text-slate-800 text-center">
                Editar Proveedor
              </DialogTitle>
              <DialogDescription className="text-lg text-slate-600 text-center">
                Modifica la información del proveedor
              </DialogDescription>
            </DialogHeader>
            <ProveedorForm
              onSubmit={handleEditProveedor}
              onCancel={() => setEditingProveedor(null)}
              defaultValues={getDefaultValues(editingProveedor || undefined)}
              isEditing={true}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para agregar producto */}
        <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-4 pb-6 border-b border-slate-200">
              <DialogTitle className="text-3xl font-bold text-slate-800 text-center">
                Agregar Producto
              </DialogTitle>
              <DialogDescription className="text-lg text-slate-600 text-center">
                Agregar un nuevo producto para <span className="font-bold text-emerald-600">{selectedProveedor?.nombre}</span>
              </DialogDescription>
            </DialogHeader>
            <ProductoForm
              onSubmit={handleAddProducto}
              onCancel={() => setShowProductDialog(false)}
              proveedorNombre={selectedProveedor?.nombre || ''}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog para ver productos */}
        <Dialog open={showProductsView} onOpenChange={setShowProductsView}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="space-y-4 pb-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <DialogTitle className="text-3xl font-bold text-slate-800">
                    Productos de {selectedProveedor?.nombre}
                  </DialogTitle>
                  <DialogDescription className="text-lg text-slate-600 mt-2">
                    Gestiona los productos y servicios de este proveedor
                  </DialogDescription>
                </div>
                <Button
                  onClick={() => {
                    if (selectedProveedor) {
                      setShowProductsView(false);
                      setTimeout(() => openProductDialog(selectedProveedor), 200);
                    }
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Agregar Producto
                </Button>
              </div>
            </DialogHeader>
            
            <div className="space-y-6">
              {selectedProveedor && (
                <div className="bg-slate-50 p-6 rounded-xl border">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Información del Proveedor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-base">
                    <div>
                      <span className="text-slate-600 font-medium">Ciudad:</span>
                      <span className="ml-2 text-slate-800">{selectedProveedor.ciudad}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Tipo:</span>
                      <span className="ml-2 text-slate-800">{selectedProveedor.tipo_proveedor}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Contacto:</span>
                      <span className="ml-2 text-slate-800">{selectedProveedor.contacto}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">NIT:</span>
                      <span className="ml-2 text-slate-800">{selectedProveedor.nit}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Email:</span>
                      <span className="ml-2 text-slate-800">{selectedProveedor.correo_electronico || 'No especificado'}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Forma de Pago:</span>
                      <span className="ml-2 text-slate-800">{selectedProveedor.forma_pago || 'No especificado'}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <ProductoTable
                productos={selectedProveedor ? getProveedorProducts(selectedProveedor.id) : []}
                onEdit={(producto) => {
                  // Implementar edición de producto si es necesario
                  toast.info('Función de edición en desarrollo');
                }}
                onDelete={handleDeleteProducto}
              />
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
};

export default ProveedoresPage;
