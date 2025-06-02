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
import { Trash2, Plus } from 'lucide-react';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Venta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información General */}
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="tipo-venta">Tipo de Venta *</Label>
                <Select onValueChange={setTipoVenta} value={tipoVenta}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposVenta.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ClienteFincaSelector
                selectedCliente={cliente}
                selectedFinca={finca}
                onClienteChange={setCliente}
                onFincaChange={setFinca}
                onCiudadChange={setCiudadEntrega}
              />

              <div>
                <Label htmlFor="ciudad-entrega">Ciudad de Entrega</Label>
                <Input
                  id="ciudad-entrega"
                  value={ciudadEntrega}
                  onChange={(e) => setCiudadEntrega(e.target.value)}
                  placeholder="Ciudad de entrega"
                />
              </div>

              <div>
                <Label htmlFor="origen-material">Origen del Material</Label>
                <Select onValueChange={setOrigenMaterial} value={origenMaterial}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar origen" />
                  </SelectTrigger>
                  <SelectContent>
                    {origenesMaterial.map((origen) => (
                      <SelectItem key={origen} value={origen}>
                        {origen}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="forma-pago">Forma de Pago *</Label>
                <Select onValueChange={setFormaPago} value={formaPago}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar forma de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    {formasPago.map((forma) => (
                      <SelectItem key={forma} value={forma}>
                        {forma}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Agregar Productos/Servicios */}
          <Card>
            <CardHeader>
              <CardTitle>Agregar Productos/Servicios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="tipo-detalle">Tipo *</Label>
                  <Select onValueChange={(value: 'Material' | 'Flete') => setTipoDetalle(value)} value={tipoDetalle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Flete">Flete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="producto-servicio">Producto/Servicio *</Label>
                  <Input
                    id="producto-servicio"
                    value={productoServicio}
                    onChange={(e) => setProductoServicio(e.target.value)}
                    placeholder="Nombre del producto/servicio"
                  />
                </div>

                <div>
                  <Label htmlFor="cantidad">Cantidad (m³) *</Label>
                  <Input
                    id="cantidad"
                    type="number"
                    step="0.01"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="valor-unitario">Valor Unitario *</Label>
                  <Input
                    id="valor-unitario"
                    type="number"
                    step="0.01"
                    value={valorUnitario}
                    onChange={(e) => setValorUnitario(parseFloat(e.target.value) || 0)}
                    className={tarifaClienteEncontrada ? 'bg-green-50 border-green-300' : ''}
                  />
                  {tarifaClienteEncontrada && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ Tarifa personalizada aplicada
                    </p>
                  )}
                </div>

                <div className="flex items-end">
                  <Button onClick={agregarDetalle} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detalle de Productos/Servicios */}
          {detalles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Detalle de la Venta</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Producto/Servicio</TableHead>
                      <TableHead>Cantidad (m³)</TableHead>
                      <TableHead>Valor Unitario</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalles.map((detalle) => (
                      <TableRow key={detalle.id}>
                        <TableCell>{detalle.tipo}</TableCell>
                        <TableCell>{detalle.producto_servicio}</TableCell>
                        <TableCell>{detalle.cantidad_m3}</TableCell>
                        <TableCell>${detalle.valor_unitario.toLocaleString()}</TableCell>
                        <TableCell>${detalle.subtotal.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarDetalle(detalle.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 text-right">
                  <p className="text-lg font-semibold">
                    Total: ${calcularTotal().toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Registrar Venta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrarVentaDialog;
