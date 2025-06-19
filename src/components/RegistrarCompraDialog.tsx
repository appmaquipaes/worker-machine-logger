import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Compra, 
  DetalleCompra, 
  createCompra, 
  createDetalleCompra, 
  loadCompras, 
  saveCompras, 
  updateCompraTotal 
} from '@/models/Compras';
import { loadProveedores, Proveedor, ProductoProveedor, loadProductos } from '@/models/Proveedores';
import { loadInventarioAcopio, updateInventarioAfterCompra, saveInventarioAcopio } from '@/models/InventarioAcopio';

interface RegistrarCompraDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompraRegistrada: () => void;
}

const RegistrarCompraDialog: React.FC<RegistrarCompraDialogProps> = ({
  open,
  onOpenChange,
  onCompraRegistrada
}) => {
  // Estados del formulario principal
  const [fecha, setFecha] = useState('');
  const [proveedorId, setProveedorId] = useState('');
  const [tipoInsumo, setTipoInsumo] = useState<'Material' | 'Lubricante' | 'Repuesto' | 'Servicio' | 'Otro'>('Material');
  const [tipoDocumento, setTipoDocumento] = useState<'Factura' | 'Remisión' | 'Otro'>('Factura');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [formaPago, setFormaPago] = useState<'Contado' | 'Crédito' | 'Otro'>('Contado');
  const [destinoInsumo, setDestinoInsumo] = useState<'Acopio Maquipaes' | 'Taller' | 'Maquinaria específica' | 'Otro'>('Acopio Maquipaes');
  const [observaciones, setObservaciones] = useState('');

  // Estados para el detalle
  const [detalles, setDetalles] = useState<DetalleCompra[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [unidad, setUnidad] = useState('');
  const [cantidad, setCantidad] = useState<number>(0);
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);
  const [observacionesDetalle, setObservacionesDetalle] = useState('');

  // Datos auxiliares
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productosProveedor, setProductosProveedor] = useState<ProductoProveedor[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<ProductoProveedor[]>([]);

  useEffect(() => {
    setProveedores(loadProveedores());
    setProductosProveedor(loadProductos());
  }, []);

  // Filtrar productos cuando cambie el proveedor
  useEffect(() => {
    if (proveedorId && productosProveedor.length > 0) {
      const productos = productosProveedor.filter(producto => producto.proveedor_id === proveedorId);
      setProductosDisponibles(productos);
    } else {
      setProductosDisponibles([]);
    }
    // Limpiar selección de producto cuando cambie el proveedor
    setProductoSeleccionado('');
    resetDetalleForm();
  }, [proveedorId, productosProveedor]);

  // Cargar datos del producto seleccionado
  useEffect(() => {
    if (productoSeleccionado) {
      const producto = productosDisponibles.find(p => p.id === productoSeleccionado);
      if (producto) {
        setNombreProducto(producto.nombre_producto);
        setUnidad(producto.unidad);
        setPrecioUnitario(producto.precio_unitario);
        setTipoInsumo(producto.tipo_insumo as 'Material' | 'Lubricante' | 'Repuesto' | 'Servicio' | 'Otro');
      }
    } else {
      setNombreProducto('');
      setUnidad('');
      setPrecioUnitario(0);
    }
  }, [productoSeleccionado, productosDisponibles]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFecha('');
    setProveedorId('');
    setTipoInsumo('Material');
    setTipoDocumento('Factura');
    setNumeroDocumento('');
    setFormaPago('Contado');
    setDestinoInsumo('Acopio Maquipaes');
    setObservaciones('');
    setDetalles([]);
    setProductosDisponibles([]);
    resetDetalleForm();
  };

  const resetDetalleForm = () => {
    setProductoSeleccionado('');
    setNombreProducto('');
    setUnidad('');
    setCantidad(0);
    setPrecioUnitario(0);
    setObservacionesDetalle('');
  };

  const agregarDetalle = () => {
    if (!nombreProducto.trim() || !unidad.trim() || cantidad <= 0 || precioUnitario <= 0) {
      toast.error('Complete todos los campos del producto');
      return;
    }

    const nuevoDetalle = createDetalleCompra(
      '', // Se asignará cuando se cree la compra
      nombreProducto,
      unidad,
      cantidad,
      precioUnitario,
      observacionesDetalle
    );

    setDetalles([...detalles, nuevoDetalle]);
    resetDetalleForm();
    toast.success('Producto agregado al detalle');
  };

  const eliminarDetalle = (index: number) => {
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
    toast.success('Producto eliminado del detalle');
  };

  const getProveedorNombre = (id: string): string => {
    const proveedor = proveedores.find(p => p.id === id);
    return proveedor ? proveedor.nombre : '';
  };

  const calcularTotal = (): number => {
    return detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
  };

  const registrarCompra = () => {
    // Validaciones
    if (!fecha || !proveedorId || !numeroDocumento.trim()) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }

    if (detalles.length === 0) {
      toast.error('Debe agregar al menos un producto al detalle');
      return;
    }

    try {
      console.log('=== REGISTRANDO COMPRA ===');
      console.log('Destino del insumo:', destinoInsumo);
      console.log('Tipo de insumo:', tipoInsumo);
      console.log('Detalles:', detalles);
      
      // Crear la compra
      let nuevaCompra = createCompra(
        new Date(fecha),
        proveedorId,
        getProveedorNombre(proveedorId),
        tipoInsumo,
        tipoDocumento,
        numeroDocumento,
        formaPago,
        destinoInsumo,
        observaciones
      );

      // Asignar el ID de la compra a los detalles y agregar al objeto compra
      const detallesConId = detalles.map(detalle => ({
        ...detalle,
        compra_id: nuevaCompra.id
      }));

      nuevaCompra.detalles = detallesConId;
      nuevaCompra = updateCompraTotal(nuevaCompra);

      // Guardar en localStorage
      const comprasExistentes = loadCompras();
      comprasExistentes.push(nuevaCompra);
      saveCompras(comprasExistentes);

      // Si el destino es "Acopio Maquipaes" y el tipo es "Material", actualizar inventario
      if (destinoInsumo === 'Acopio Maquipaes' && tipoInsumo === 'Material') {
        console.log('✓ Compra de Material con destino Acopio Maquipaes detectada');
        
        let inventario = loadInventarioAcopio();
        console.log('Inventario antes de la compra:', inventario);
        
        // Procesar cada detalle que sea material
        detallesConId.forEach(detalle => {
          console.log(`Agregando al inventario: ${detalle.cantidad} m³ de ${detalle.nombre_producto} a $${detalle.precio_unitario}`);
          
          inventario = updateInventarioAfterCompra(inventario, {
            tipo_material: detalle.nombre_producto,
            cantidad_m3: detalle.cantidad,
            costo_unitario_total: detalle.precio_unitario
          });
        });
        
        console.log('Inventario después de la compra:', inventario);
        saveInventarioAcopio(inventario);
        toast.success('Compra registrada e inventario actualizado');
      } else {
        console.log('✗ Compra no aplica para inventario de acopio');
        toast.success('Compra registrada exitosamente');
      }

      onCompraRegistrada();
      onOpenChange(false);
      resetForm();

    } catch (error) {
      console.error('Error al registrar compra:', error);
      toast.error('Error al registrar la compra');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Compra</DialogTitle>
          <DialogDescription>
            Complete la información de la compra y agregue los productos o servicios adquiridos
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información general de la compra */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha *</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="proveedor">Proveedor *</Label>
                  <Select onValueChange={setProveedorId} value={proveedorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor.id} value={proveedor.id}>
                          {proveedor.nombre} - {proveedor.ciudad}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipo-insumo">Tipo de Insumo *</Label>
                  <Select onValueChange={(value: any) => setTipoInsumo(value)} value={tipoInsumo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Lubricante">Lubricante</SelectItem>
                      <SelectItem value="Repuesto">Repuesto</SelectItem>
                      <SelectItem value="Servicio">Servicio</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tipo-documento">Tipo de Documento *</Label>
                  <Select onValueChange={(value: any) => setTipoDocumento(value)} value={tipoDocumento}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Factura">Factura</SelectItem>
                      <SelectItem value="Remisión">Remisión</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="numero-documento">Número de Documento *</Label>
                <Input
                  id="numero-documento"
                  value={numeroDocumento}
                  onChange={(e) => setNumeroDocumento(e.target.value)}
                  placeholder="Ej: F-001234"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="forma-pago">Forma de Pago *</Label>
                  <Select onValueChange={(value: any) => setFormaPago(value)} value={formaPago}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Contado">Contado</SelectItem>
                      <SelectItem value="Crédito">Crédito</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="destino-insumo">Destino del Insumo *</Label>
                  <Select onValueChange={(value: any) => setDestinoInsumo(value)} value={destinoInsumo}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Acopio Maquipaes">Acopio Maquipaes</SelectItem>
                      <SelectItem value="Taller">Taller</SelectItem>
                      <SelectItem value="Maquinaria específica">Maquinaria específica</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones adicionales..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Detalle de productos */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Productos/Servicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {proveedorId && productosDisponibles.length > 0 ? (
                <>
                  <div>
                    <Label htmlFor="producto-catalogo">Seleccionar del Catálogo</Label>
                    <Select onValueChange={setProductoSeleccionado} value={productoSeleccionado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto del proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {productosDisponibles.map((producto) => (
                          <SelectItem key={producto.id} value={producto.id}>
                            {producto.nombre_producto} - {producto.unidad} - ${producto.precio_unitario.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    O complete manualmente:
                  </div>
                </>
              ) : (
                <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded">
                  {!proveedorId ? 
                    'Seleccione un proveedor para ver productos disponibles' :
                    'Este proveedor no tiene productos en catálogo. Complete manualmente:'
                  }
                </div>
              )}

              <div>
                <Label htmlFor="nombre-producto">Nombre del Producto/Servicio *</Label>
                <Input
                  id="nombre-producto"
                  value={nombreProducto}
                  onChange={(e) => setNombreProducto(e.target.value)}
                  placeholder="Ej: Arena lavada"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unidad">Unidad *</Label>
                  <Input
                    id="unidad"
                    value={unidad}
                    onChange={(e) => setUnidad(e.target.value)}
                    placeholder="Ej: m³, galón, unidad"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cantidad">Cantidad *</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    min="0"
                    step="0.01"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="precio-unitario">Precio Unitario *</Label>
                <Input
                  id="precio-unitario"
                  type="number"
                  min="0"
                  step="0.01"
                  value={precioUnitario}
                  onChange={(e) => setPrecioUnitario(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="observaciones-detalle">Observaciones del Producto</Label>
                <Textarea
                  id="observaciones-detalle"
                  value={observacionesDetalle}
                  onChange={(e) => setObservacionesDetalle(e.target.value)}
                  placeholder="Observaciones específicas del producto..."
                  rows={2}
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Subtotal: ${((cantidad || 0) * (precioUnitario || 0)).toLocaleString()}
                </p>
                <Button onClick={agregarDetalle} className="flex items-center gap-2">
                  <Plus size={16} />
                  Agregar Producto
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de productos agregados */}
        {detalles.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Productos Agregados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio Unit.</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalles.map((detalle, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{detalle.nombre_producto}</TableCell>
                        <TableCell>{detalle.unidad}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell>${detalle.precio_unitario.toLocaleString()}</TableCell>
                        <TableCell className="font-medium">${detalle.subtotal.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => eliminarDetalle(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-4 text-right">
                <p className="text-lg font-bold">
                  Total de la Compra: ${calcularTotal().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={registrarCompra} className="flex items-center gap-2">
            <Save size={16} />
            Registrar Compra
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrarCompraDialog;
