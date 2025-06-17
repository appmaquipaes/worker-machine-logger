
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Truck, Download } from 'lucide-react';
import { DatePicker } from '@/components/DatePicker';
import { 
  ServicioTransporte, 
  createServicioTransporte, 
  loadServiciosTransporte, 
  saveServiciosTransporte 
} from '@/models/ServiciosTransporte';
import { 
  findTarifaCliente, 
  loadTarifasCliente 
} from '@/models/TarifasCliente';
import { loadProveedores, getUniqueProviderMaterialTypes } from '@/models/Proveedores';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import * as XLSX from 'xlsx';

const ServiciosTransportePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [servicios, setServicios] = useState<ServicioTransporte[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [tiposMaterial, setTiposMaterial] = useState<string[]>([]);
  
  // Estados del formulario
  const [fecha, setFecha] = useState(new Date());
  const [cliente, setCliente] = useState('');
  const [finca, setFinca] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [cantidadM3, setCantidadM3] = useState<number>(0);
  const [numeroViajes, setNumeroViajes] = useState<number>(1);
  const [vehiculo, setVehiculo] = useState('');
  const [conductor, setConductor] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  // Estados calculados
  const [valorFleteM3, setValorFleteM3] = useState<number>(0);
  const [valorMaterialM3, setValorMaterialM3] = useState<number>(0);
  const [tarifaEncontrada, setTarifaEncontrada] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Buscar tarifa automáticamente cuando cambian cliente, finca, origen o destino
    if (cliente && origen && destino) {
      const tarifa = findTarifaCliente(cliente, finca, origen, destino);
      if (tarifa) {
        setValorFleteM3(tarifa.valor_flete_m3);
        setValorMaterialM3(tarifa.valor_material_m3 || 0);
        setTarifaEncontrada(true);
        toast.success('Tarifa encontrada y aplicada automáticamente');
      } else {
        setTarifaEncontrada(false);
        setValorFleteM3(0);
        setValorMaterialM3(0);
      }
    }
  }, [cliente, finca, origen, destino]);

  const loadData = () => {
    setServicios(loadServiciosTransporte());
    setProveedores(loadProveedores());
    setTiposMaterial(getUniqueProviderMaterialTypes());
  };

  const resetForm = () => {
    setFecha(new Date());
    setCliente('');
    setFinca('');
    setOrigen('');
    setDestino('');
    setTipoMaterial('');
    setCantidadM3(0);
    setNumeroViajes(1);
    setVehiculo('');
    setConductor('');
    setObservaciones('');
    setValorFleteM3(0);
    setValorMaterialM3(0);
    setTarifaEncontrada(false);
  };

  const handleSubmit = () => {
    if (!cliente || !finca || !origen || !destino || !tipoMaterial || cantidadM3 <= 0 || valorFleteM3 <= 0) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }

    const nuevoServicio = createServicioTransporte(
      fecha,
      cliente,
      finca,
      origen,
      destino,
      tipoMaterial,
      cantidadM3,
      valorFleteM3,
      valorMaterialM3 > 0 ? valorMaterialM3 : undefined,
      vehiculo || undefined,
      conductor || undefined,
      observaciones || undefined,
      numeroViajes
    );

    const updatedServicios = [...servicios, nuevoServicio];
    saveServiciosTransporte(updatedServicios);
    setServicios(updatedServicios);
    
    resetForm();
    toast.success('Servicio de transporte registrado exitosamente');
  };

  const exportToExcel = () => {
    if (servicios.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = servicios.map(servicio => ({
      'Fecha': new Date(servicio.fecha).toLocaleDateString(),
      'Cliente': servicio.cliente,
      'Finca': servicio.finca,
      'Origen': servicio.origen,
      'Destino': servicio.destino,
      'Tipo Material': servicio.tipo_material,
      'Cantidad (m³)': servicio.cantidad_m3,
      'Valor Flete/m³': servicio.valor_flete_m3,
      'Total Flete': servicio.total_flete,
      'Valor Material/m³': servicio.valor_material_m3 || '',
      'Total Material Ref.': servicio.total_material_referencia || '',
      'Vehículo': servicio.vehiculo || '',
      'Conductor': servicio.conductor || '',
      'Número Viajes': servicio.numero_viajes,
      'Observaciones': servicio.observaciones || ''
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Servicios Transporte');
    
    const fileName = `servicios_transporte_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte exportado correctamente');
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Servicios de Transporte</h1>
          <div className="flex gap-2">
            <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Volver
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Registra servicios de transporte cuando el cliente compra material directamente.
        </p>
      </div>

      {/* Formulario de registro */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Nuevo Servicio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <DatePicker date={fecha} setDate={setFecha} />
            </div>
            
            <div>
              <Label htmlFor="numero-viajes">Número de Viajes *</Label>
              <Input
                id="numero-viajes"
                type="number"
                min="1"
                value={numeroViajes}
                onChange={(e) => setNumeroViajes(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <ClienteFincaSelector
            selectedCliente={cliente}
            selectedFinca={finca}
            onClienteChange={setCliente}
            onFincaChange={setFinca}
            onCiudadChange={setDestino}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="origen">Origen *</Label>
              <Select onValueChange={setOrigen} value={origen}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar origen" />
                </SelectTrigger>
                <SelectContent>
                  {proveedores.map((prov) => (
                    <SelectItem key={prov.id} value={prov.nombre}>
                      {prov.nombre} - {prov.ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tipo-material">Tipo de Material *</Label>
              <Select onValueChange={setTipoMaterial} value={tipoMaterial}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar material" />
                </SelectTrigger>
                <SelectContent>
                  {tiposMaterial.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cantidad">Cantidad (m³) *</Label>
              <Input
                id="cantidad"
                type="number"
                step="0.01"
                value={cantidadM3}
                onChange={(e) => setCantidadM3(parseFloat(e.target.value) || 0)}
              />
            </div>
            
            <div>
              <Label htmlFor="valor-flete">Valor Flete por m³ *</Label>
              <Input
                id="valor-flete"
                type="number"
                value={valorFleteM3}
                onChange={(e) => setValorFleteM3(parseFloat(e.target.value) || 0)}
                className={tarifaEncontrada ? 'bg-green-50 border-green-300' : ''}
              />
              {tarifaEncontrada && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Tarifa aplicada automáticamente
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor-material">Valor Material por m³ (Referencia)</Label>
              <Input
                id="valor-material"
                type="number"
                value={valorMaterialM3}
                onChange={(e) => setValorMaterialM3(parseFloat(e.target.value) || 0)}
                className={tarifaEncontrada ? 'bg-green-50 border-green-300' : ''}
              />
            </div>
            
            <div>
              <Label htmlFor="vehiculo">Vehículo</Label>
              <Input
                id="vehiculo"
                value={vehiculo}
                onChange={(e) => setVehiculo(e.target.value)}
                placeholder="Placa o identificación"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="conductor">Conductor</Label>
              <Input
                id="conductor"
                value={conductor}
                onChange={(e) => setConductor(e.target.value)}
                placeholder="Nombre del conductor"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones adicionales..."
            />
          </div>

          {cantidadM3 > 0 && valorFleteM3 > 0 && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="font-medium mb-2">Resumen del Servicio</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Flete:</p>
                  <p className="font-medium text-lg">${(cantidadM3 * valorFleteM3).toLocaleString()}</p>
                </div>
                {valorMaterialM3 > 0 && (
                  <div>
                    <p className="text-muted-foreground">Total Material (Referencia):</p>
                    <p className="font-medium text-lg">${(cantidadM3 * valorMaterialM3).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Registrar Servicio
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de servicios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Servicios Registrados
          </CardTitle>
          <CardDescription>
            {servicios.length} servicio(s) registrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Finca</TableHead>
                <TableHead>Origen → Destino</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Cantidad (m³)</TableHead>
                <TableHead>Viajes</TableHead>
                <TableHead>Valor Flete/m³</TableHead>
                <TableHead>Total Flete</TableHead>
                <TableHead>Vehículo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicios.map((servicio) => (
                <TableRow key={servicio.id}>
                  <TableCell>{new Date(servicio.fecha).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{servicio.cliente}</TableCell>
                  <TableCell>{servicio.finca}</TableCell>
                  <TableCell>{servicio.origen} → {servicio.destino}</TableCell>
                  <TableCell>{servicio.tipo_material}</TableCell>
                  <TableCell>{servicio.cantidad_m3}</TableCell>
                  <TableCell>{servicio.numero_viajes}</TableCell>
                  <TableCell>${servicio.valor_flete_m3.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold">${servicio.total_flete.toLocaleString()}</TableCell>
                  <TableCell>{servicio.vehiculo || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {servicios.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay servicios registrados.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiciosTransportePage;
