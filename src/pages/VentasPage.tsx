
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
import { ArrowLeft, Plus, Eye, Filter, Download, BarChart3, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { Venta, loadVentas, tiposVenta, formasPago } from '@/models/Ventas';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { migrateTarifas } from '@/models/Tarifas';
import RegistrarVentaDialog from '@/components/RegistrarVentaDialog';
import * as XLSX from 'xlsx';

const VentasPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<Venta[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filtros
  const [filtroCliente, setFiltroCliente] = useState('all');
  const [filtroFinca, setFiltroFinca] = useState('all');
  const [filtroTipoVenta, setFiltroTipoVenta] = useState('all');
  const [filtroFormaPago, setFiltroFormaPago] = useState('all');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  
  const [clientes, setClientes] = useState<any[]>([]);
  const [fincas, setFincas] = useState<any[]>([]);

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
    // Ejecutar migración de tarifas al cargar la página
    migrateTarifas();
    loadData();
  }, []);

  const loadData = () => {
    const ventasData = loadVentas();
    const clientesData = loadClientes();
    
    setVentas(ventasData);
    setVentasFiltradas(ventasData);
    setClientes(clientesData);
  };

  // Cargar fincas cuando se selecciona un cliente
  useEffect(() => {
    if (filtroCliente && filtroCliente !== 'all') {
      const cliente = getClienteByName(filtroCliente);
      if (cliente) {
        const fincasData = getFincasByCliente(cliente.id);
        setFincas(fincasData);
      } else {
        setFincas([]);
      }
      setFiltroFinca('all'); // Reset finca selection
    } else {
      setFincas([]);
      setFiltroFinca('all');
    }
  }, [filtroCliente]);

  // Aplicar filtros
  useEffect(() => {
    let ventasFiltered = [...ventas];

    if (filtroCliente && filtroCliente !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => v.cliente === filtroCliente);
    }

    if (filtroFinca && filtroFinca !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => {
        const fincaFromDestino = v.destino_material ? v.destino_material.split(' - ')[1] : '';
        return fincaFromDestino === filtroFinca;
      });
    }

    if (filtroTipoVenta && filtroTipoVenta !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => v.tipo_venta === filtroTipoVenta);
    }

    if (filtroFormaPago && filtroFormaPago !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => v.forma_pago === filtroFormaPago);
    }

    if (filtroFechaInicio) {
      ventasFiltered = ventasFiltered.filter(v => 
        new Date(v.fecha) >= new Date(filtroFechaInicio)
      );
    }

    if (filtroFechaFin) {
      ventasFiltered = ventasFiltered.filter(v => 
        new Date(v.fecha) <= new Date(filtroFechaFin)
      );
    }

    setVentasFiltradas(ventasFiltered);
  }, [ventas, filtroCliente, filtroFinca, filtroTipoVenta, filtroFormaPago, filtroFechaInicio, filtroFechaFin]);

  const limpiarFiltros = () => {
    setFiltroCliente('all');
    setFiltroFinca('all');
    setFiltroTipoVenta('all');
    setFiltroFormaPago('all');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
  };

  const calcularTotalVentas = () => {
    return ventasFiltradas.reduce((total, venta) => total + venta.total_venta, 0);
  };

  const exportToExcel = () => {
    if (ventasFiltradas.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = ventasFiltradas.map(venta => ({
      'Fecha': new Date(venta.fecha).toLocaleDateString(),
      'Cliente': venta.cliente,
      'Finca': venta.destino_material ? venta.destino_material.split(' - ')[1] || '' : '',
      'Tipo de Venta': venta.tipo_venta,
      'Ciudad Entrega': venta.ciudad_entrega,
      'Origen Material': venta.origen_material,
      'Forma de Pago': venta.forma_pago,
      'Total Venta': venta.total_venta,
      'Observaciones': venta.observaciones || '',
      'Tipo Registro': venta.observaciones?.includes('Venta automática') ? 'Automática' : 'Manual'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    
    const fileName = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte exportado correctamente');
  };

  // Función para extraer finca del destino
  const getFincaFromDestino = (destino: string): string => {
    if (!destino) return '';
    return destino.split(' - ')[1] || '';
  };

  // Función para determinar si una venta es automática
  const esVentaAutomatica = (venta: Venta): boolean => {
    return venta.observaciones?.includes('Venta automática') || false;
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-2 sm:px-4">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-2 gap-2 md:gap-0">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight mb-1">Gestión de Ventas</h1>
            <p className="text-muted-foreground text-sm">Registra y gestiona todas las ventas de material y transporte</p>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.03] duration-150"
              variant="default"
              size="sm"
            >
              <Plus size={18} />
              Nueva Venta
            </Button>
            <Button 
              variant="back"
              onClick={() => navigate('/admin')}
              className="shadow-sm"
              size="sm"
            >
              <ArrowLeft size={18} />
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6 shadow-xs border border-muted">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Cliente */}
            <div>
              <Label className="flex items-center gap-1 text-xs mb-1">
                <Users size={15} /> Cliente
              </Label>
              <Select onValueChange={setFiltroCliente} value={filtroCliente}>
                <SelectTrigger className="bg-white border hover:bg-accent shadow-sm transition">
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent className="z-[51]">
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.nombre_cliente}>
                      {cliente.nombre_cliente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Finca */}
            <div>
              <Label className="flex items-center gap-1 text-xs mb-1">
                <MapPin size={15} /> Finca
              </Label>
              <Select 
                onValueChange={setFiltroFinca} 
                value={filtroFinca}
                disabled={filtroCliente === 'all' || fincas.length === 0}
              >
                <SelectTrigger className="bg-white border hover:bg-accent shadow-sm transition">
                  <SelectValue placeholder={
                    filtroCliente === 'all' 
                      ? "Primero seleccione un cliente" 
                      : fincas.length === 0 
                        ? "El cliente no tiene fincas"
                        : "Todas las fincas"
                  } />
                </SelectTrigger>
                <SelectContent className="z-[51]">
                  <SelectItem value="all">Todas las fincas</SelectItem>
                  {fincas.map((finca) => (
                    <SelectItem key={finca.id} value={finca.nombre_finca}>
                      {finca.nombre_finca} - {finca.ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Tipo de Venta */}
            <div>
              <Label className="text-xs mb-1">Tipo de Venta</Label>
              <Select onValueChange={setFiltroTipoVenta} value={filtroTipoVenta}>
                <SelectTrigger className="bg-white border hover:bg-accent shadow-sm transition">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent className="z-[51]">
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {tiposVenta.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Forma de Pago */}
            <div>
              <Label className="text-xs mb-1">Forma de Pago</Label>
              <Select onValueChange={setFiltroFormaPago} value={filtroFormaPago}>
                <SelectTrigger className="bg-white border hover:bg-accent shadow-sm transition">
                  <SelectValue placeholder="Todas las formas" />
                </SelectTrigger>
                <SelectContent className="z-[51]">
                  <SelectItem value="all">Todas las formas</SelectItem>
                  {formasPago.map((forma) => (
                    <SelectItem key={forma} value={forma}>
                      {forma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Fecha Inicio */}
            <div>
              <Label className="text-xs mb-1">Fecha Inicio</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="bg-white border hover:bg-accent shadow-sm transition"
              />
            </div>
            {/* Fecha Fin */}
            <div>
              <Label className="text-xs mb-1">Fecha Fin</Label>
              <Input
                id="fecha-fin"
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="bg-white border hover:bg-accent shadow-sm transition"
              />
            </div>
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-5 gap-4">
            <Button 
              variant="ghost"
              className="text-sm bg-accent/70 hover:bg-accent transition"
              onClick={limpiarFiltros}
            >
              Limpiar Filtros
            </Button>
            <div className="flex gap-2 items-center">
              <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2 transition" size="sm">
                <Download className="h-4 w-4" />
                Exportar Excel
              </Button>
              <div className="text-sm md:text-base font-semibold whitespace-nowrap">
                Total Filtrado: <span className="text-primary">${calcularTotalVentas().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="shadow-xs border border-muted bg-accent/40">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-xs">Total Ventas</CardDescription>
            <CardTitle className="text-2xl font-extrabold text-primary">{ventasFiltradas.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-xs border border-muted bg-accent/40">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-xs">Valor Total</CardDescription>
            <CardTitle className="text-2xl font-extrabold text-primary">${calcularTotalVentas().toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-xs border border-muted bg-accent/40">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-xs">Promedio por Venta</CardDescription>
            <CardTitle className="text-2xl font-extrabold text-primary">
              ${ventasFiltradas.length > 0 ? (calcularTotalVentas() / ventasFiltradas.length).toLocaleString() : '0'}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-xs border border-muted bg-accent/40">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-xs">Ventas Automáticas</CardDescription>
            <CardTitle className="text-2xl font-extrabold text-green-600">
              {ventasFiltradas.filter(esVentaAutomatica).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="shadow-xs border border-muted bg-accent/40">
          <CardHeader className="pb-2">
            <CardDescription className="uppercase text-xs">Clientes Únicos</CardDescription>
            <CardTitle className="text-2xl font-extrabold text-primary">
              {new Set(ventasFiltradas.map(v => v.cliente)).size}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de Ventas */}
      <Card className="shadow-xs border border-muted">
        <CardHeader>
          <CardTitle className="text-lg">Listado de Ventas</CardTitle>
          <CardDescription>
            <span className="text-sm">{ventasFiltradas.length} venta(s) encontrada(s)</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/30">
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Finca/Destino</TableHead>
                <TableHead>Tipo de Venta</TableHead>
                <TableHead>Ciudad Entrega</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Forma de Pago</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventasFiltradas.map((venta, idx) => (
                <TableRow 
                  key={venta.id}
                  className={idx % 2 === 1 ? "bg-muted/20" : ""}
                  tabIndex={0}
                  aria-label={`Ver detalle de venta del ${new Date(venta.fecha).toLocaleDateString()}`}
                >
                  <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{venta.cliente}</TableCell>
                  <TableCell>{getFincaFromDestino(venta.destino_material) || venta.destino_material}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition
                      ${
                        venta.tipo_venta === 'Solo material' ? 'bg-blue-100 text-blue-800' :
                        venta.tipo_venta === 'Solo transporte' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {venta.tipo_venta}
                    </span>
                  </TableCell>
                  <TableCell>{venta.ciudad_entrega}</TableCell>
                  <TableCell>{venta.origen_material}</TableCell>
                  <TableCell>{venta.forma_pago}</TableCell>
                  <TableCell className="font-semibold">
                    ${venta.total_venta.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${esVentaAutomatica(venta) ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                    `}>
                      {esVentaAutomatica(venta) ? 'Auto' : 'Manual'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
          {ventasFiltradas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground animate-fade-in">
              No se encontraron ventas con los filtros aplicados.
            </div>
          )}
        </CardContent>
      </Card>

      <RegistrarVentaDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onVentaCreated={loadData}
      />
    </div>
  );
};

export default VentasPage;
