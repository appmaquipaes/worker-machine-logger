import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2, Plus, ShoppingCart, Package, FileText, Calculator, DollarSign } from 'lucide-react';
import { 
  Venta, 
  DetalleVenta, 
  createVenta, 
  createDetalleVenta, 
  updateVentaTotal,
  tiposVenta,
  formasPago,
  origenesMaterial,
  loadVentas,
  saveVentas
} from '@/models/Ventas';
import { loadInventarioAcopio, updateInventarioAfterVenta, saveInventarioAcopio } from '@/models/InventarioAcopio';
import { loadTarifas } from '@/models/Tarifas';
import { loadMateriales } from '@/models/Materiales';
import { findTarifaCliente } from '@/models/TarifasCliente';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';

interface RegistrarVentaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVentaCreated: () => void;
}

const RegistrarVentaDialog: React.FC<RegistrarVentaDialogProps> = ({
  open,
  onOpenChange,
  onVentaCreated
}) => {
  // Estados principales
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [cliente, setCliente] = useState('');
  const [finca, setFinca] = useState('');
  const [ciudadEntrega, setCiudadEntrega] = useState('');
  const [tipoVenta, setTipoVenta] = useState('');
  const [origenMaterial, setOrigenMaterial] = useState('');
  const [destinoMaterial, setDestinoMaterial] = useState('');
  const [formaPago, setFormaPago] = useState('');
  const [observaciones, setObservaciones] = useState('');

  // Estados para el detalle
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);
  const [tipoDetalle, setTipoDetalle] = useState<'Material' | 'Flete'>('Material');
  const [productoServicio, setProductoServicio] = useState('');
  const [cantidad, setCantidad] = useState<number>(0);
  const [valorUnitario, setValorUnitario] = useState<number>(0);

  // Datos auxiliares
  const [materiales, setMateriales] = useState<any[]>([]);
  const [tarifas, setTarifas] = useState<any[]>([]);
  const [tarifaClienteEncontrada, setTarifaClienteEncontrada] = useState(false);

  useEffect(() => {
    setMateriales(loadMateriales());
    setTarifas(loadTarifas());
  }, []);

  // Buscar tarifa de cliente automáticamente para fletes
  useEffect(() => {
    if (tipoDetalle === 'Flete' && cliente && origenMaterial && ciudadEntrega) {
      const tarifa = findTarifaCliente(cliente, finca, origenMaterial, ciudadEntrega);
      if (tarifa) {
        setValorUnitario(tarifa.valor_flete_m3);
        setTarifaClienteEncontrada(true);
        toast.success('Tarifa de cliente aplicada automáticamente');
      } else {
        setTarifaClienteEncontrada(false);
        // Fallback a tarifa general si existe
        const tarifaGeneral = tarifas.find(t => 
          t.origen === origenMaterial && t.destino === ciudadEntrega
        );
        if (tarifaGeneral) {
          setValorUnitario(tarifaGeneral.valor_por_m3);
        }
      }
    }
  }, [tipoDetalle, cliente, finca, origenMaterial, ciudadEntrega, tarifas]);

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setFecha(new Date().toISOString().split('T')[0]);
    setCliente('');
    setFinca('');
    setCiudadEntrega('');
    setTipoVenta('');
    setOrigenMaterial('');
    setDestinoMaterial('');
    setFormaPago('');
    setObservaciones('');
    setDetalles([]);
    setTarifaClienteEncontrada(false);
    resetDetalleForm();
  };

  const resetDetalleForm = () => {
    setTipoDetalle('Material');
    setProductoServicio('');
    setCantidad(0);
    setValorUnitario(0);
    setTarifaClienteEncontrada(false);
  };

  const agregarDetalle = () => {
    if (!productoServicio || cantidad <= 0 || valorUnitario <= 0) {
      toast.error('Complete todos los campos del detalle');
      return;
    }

    const nuevoDetalle = createDetalleVenta(
      tipoDetalle,
      productoServicio,
      cantidad,
      valorUnitario
    );

    setDetalles([...detalles, nuevoDetalle]);
    resetDetalleForm();
    toast.success('Producto/servicio agregado');
  };

  const eliminarDetalle = (id: string) => {
    setDetalles(detalles.filter(d => d.id !== id));
    toast.success('Producto/servicio eliminado');
  };

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
  };

  const handleSubmit = () => {
    if (!fecha || !cliente || !finca || !tipoVenta || !formaPago || detalles.length === 0) {
      toast.error('Complete todos los campos obligatorios incluyendo cliente y finca');
      return;
    }

    try {
      // Crear destino combinando cliente y finca
      const destinoCompleto = `${cliente} - ${finca}`;
      
      const nuevaVenta = createVenta(
        new Date(fecha),
        cliente,
        ciudadEntrega,
        tipoVenta,
        origenMaterial,
        destinoCompleto,
        formaPago,
        observaciones
      );

      nuevaVenta.detalles = detalles;
      const ventaFinal = updateVentaTotal(nuevaVenta);

      // Actualizar inventario si es necesario
      if (origenMaterial === 'Acopio Maquipaes') {
        const materialesVendidos = detalles.filter(d => d.tipo === 'Material');
        if (materialesVendidos.length > 0) {
          let inventario = loadInventarioAcopio();
          
          materialesVendidos.forEach(material => {
            inventario = updateInventarioAfterVenta(inventario, {
              tipo_material: material.producto_servicio,
              cantidad_m3: material.cantidad_m3
            });
          });
          
          saveInventarioAcopio(inventario);
        }
      }

      // Guardar la venta
      const ventas = loadVentas();
      ventas.push(ventaFinal);
      saveVentas(ventas);

      toast.success('Venta registrada exitosamente');
      onVentaCreated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al registrar venta:', error);
      toast.error('Error al registrar la venta');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto bg-white rounded-2xl border border-slate-200 shadow-2xl">
        <DialogHeader className="pb-6 border-b border-slate-200">
          <DialogTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
            Registrar Nueva Venta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 pt-6">
          {/* Información General */}
          <Card className="border-2 border-slate-200 shadow-lg rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl border-b border-slate-200">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <FileText className="h-6 w-6 text-blue-600" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="fecha" className="text-lg font-bold text-slate-700 flex items-center gap-2">
                    Fecha de la Venta <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="h-14 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="tipo-venta" className="text-lg font-bold text-slate-700">
                    Tipo de Venta <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={setTipoVenta} value={tipoVenta}>
                    <SelectTrigger className="h-14 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500">
                      <SelectValue placeholder="Seleccionar tipo de venta" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-xl">
                      {tiposVenta.map((tipo) => (
                        <SelectItem key={tipo} value={tipo} className="text-lg p-4 hover:bg-blue-50">
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <ClienteFincaSelector
                    selectedCliente={cliente}
                    selectedFinca={finca}
                    onClienteChange={setCliente}
                    onFincaChange={setFinca}
                    onCiudadChange={setCiudadEntrega}
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="ciudad-entrega" className="text-lg font-bold text-slate-700">
                    Ciudad de Entrega
                  </Label>
                  <Input
                    id="ciudad-entrega"
                    value={ciudadEntrega}
                    onChange={(e) => setCiudadEntrega(e.target.value)}
                    placeholder="Ciudad donde se entregará"
                    className="h-14 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="origen-material" className="text-lg font-bold text-slate-700">
                    Origen del Material
                  </Label>
                  <Select onValueChange={setOrigenMaterial} value={origenMaterial}>
                    <SelectTrigger className="h-14 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500">
                      <SelectValue placeholder="Seleccionar origen" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-xl">
                      {origenesMaterial.map((origen) => (
                        <SelectItem key={origen} value={origen} className="text-lg p-4 hover:bg-blue-50">
                          {origen}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="forma-pago" className="text-lg font-bold text-slate-700">
                    Forma de Pago <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={setFormaPago} value={formaPago}>
                    <SelectTrigger className="h-14 text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500">
                      <SelectValue placeholder="Seleccionar forma de pago" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-slate-200 rounded-xl shadow-xl">
                      {formasPago.map((forma) => (
                        <SelectItem key={forma} value={forma} className="text-lg p-4 hover:bg-blue-50">
                          {forma}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <Label htmlFor="observaciones" className="text-lg font-bold text-slate-700">
                    Observaciones Adicionales
                  </Label>
                  <Textarea
                    id="observaciones"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Comentarios o notas adicionales sobre la venta..."
                    className="min-h-[80px] text-lg border-2 border-slate-300 rounded-xl focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agregar Productos/Servicios */}
          <Card className="border-2 border-slate-200 shadow-lg rounded-2xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl border-b border-slate-200">
              <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                <Package className="h-6 w-6 text-green-600" />
                Agregar Productos y Servicios
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="tipo-detalle" className="text-lg font-bold text-slate-700">
                    Tipo <span className="text-red-500">*</span>
                  </Label>
                  <Select onValueChange={(value: 'Material' | 'Flete') => setTipoDetalle(value)} value={tipoDetalle}>
                    <SelectTrigger className="h-14 text-lg border-2 border-slate-300 rounded-xl focus:border-green-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-2 border-slate-200 rounded-xl">
                      <SelectItem value="Material" className="text-lg p-4">Material</SelectItem>
                      <SelectItem value="Flete" className="text-lg p-4">Flete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="producto-servicio" className="text-lg font-bold text-slate-700">
                    Producto/Servicio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="producto-servicio"
                    value={productoServicio}
                    onChange={(e) => setProductoServicio(e.target.value)}
                    placeholder="Nombre del producto o servicio"
                    className="h-14 text-lg border-2 border-slate-300 rounded-xl focus:border-green-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="cantidad" className="text-lg font-bold text-slate-700">
                    Cantidad (m³) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="cantidad"
                    type="number"
                    step="0.01"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)}
                    className="h-14 text-lg border-2 border-slate-300 rounded-xl focus:border-green-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="valor-unitario" className="text-lg font-bold text-slate-700">
                    Valor Unitario <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg font-semibold">$</span>
                    <Input
                      id="valor-unitario"
                      type="number"
                      step="0.01"
                      value={valorUnitario}
                      onChange={(e) => setValorUnitario(parseFloat(e.target.value) || 0)}
                      className={`h-14 text-lg pl-8 border-2 rounded-xl focus:ring-2 transition-all ${
                        tarifaClienteEncontrada 
                          ? 'bg-green-50 border-green-300 focus:border-green-500' 
                          : 'border-slate-300 focus:border-green-500'
                      }`}
                    />
                  </div>
                  {tarifaClienteEncontrada && (
                    <p className="text-sm text-green-600 font-semibold bg-green-50 p-2 rounded-lg border border-green-200">
                      ✓ Tarifa personalizada aplicada automáticamente
                    </p>
                  )}
                </div>

                <div className="flex items-end">
                  <Button 
                    onClick={agregarDetalle} 
                    className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-6 w-6 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalle de Productos/Servicios */}
          {detalles.length > 0 && (
            <Card className="border-2 border-slate-200 shadow-lg rounded-2xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-2xl border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-purple-600" />
                    Detalle de la Venta
                  </CardTitle>
                  <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-xl">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    <span className="text-lg font-bold text-purple-700">
                      Total: ${calcularTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="overflow-x-auto rounded-xl border-2 border-slate-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50">
                        <TableHead className="text-base font-bold text-slate-700 py-4">Tipo</TableHead>
                        <TableHead className="text-base font-bold text-slate-700 py-4">Producto/Servicio</TableHead>
                        <TableHead className="text-base font-bold text-slate-700 py-4">Cantidad (m³)</TableHead>
                        <TableHead className="text-base font-bold text-slate-700 py-4">Valor Unitario</TableHead>
                        <TableHead className="text-base font-bold text-slate-700 py-4">Subtotal</TableHead>
                        <TableHead className="text-base font-bold text-slate-700 py-4">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detalles.map((detalle, idx) => (
                        <TableRow key={detalle.id} className={idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"}>
                          <TableCell className="py-4">
                            <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                              detalle.tipo === 'Material' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {detalle.tipo}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 text-base font-medium">{detalle.producto_servicio}</TableCell>
                          <TableCell className="py-4 text-base">{detalle.cantidad_m3}</TableCell>
                          <TableCell className="py-4 text-base font-semibold">${detalle.valor_unitario.toLocaleString()}</TableCell>
                          <TableCell className="py-4 text-base font-bold text-green-600">${detalle.subtotal.toLocaleString()}</TableCell>
                          <TableCell className="py-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => eliminarDetalle(detalle.id)}
                              className="h-10 px-4 text-sm font-medium border-2 border-red-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              className="h-14 px-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ShoppingCart className="h-6 w-6 mr-3" />
              Registrar Venta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrarVentaDialog;
