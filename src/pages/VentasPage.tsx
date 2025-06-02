
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
      'Observaciones': venta.observaciones || ''
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

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Gestión de Ventas</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Nueva Venta
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
          Registra y gestiona todas las ventas de material y transporte.
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="filtro-cliente" className="flex items-center gap-1">
                <Users size={16} />
                Cliente
              </Label>
              <Select onValueChange={setFiltroCliente} value={filtroCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.nombre_cliente}>
                      {cliente.nombre_cliente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filtro-finca" className="flex items-center gap-1">
                <MapPin size={16} />
                Finca
              </Label>
              <Select 
                onValueChange={setFiltroFinca} 
                value={filtroFinca}
                disabled={filtroCliente === 'all' || fincas.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    filtroCliente === 'all' 
                      ? "Primero seleccione un cliente" 
                      : fincas.length === 0 
                        ? "El cliente no tiene fincas"
                        : "Todas las fincas"
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las fincas</SelectItem>
                  {fincas.map((finca) => (
                    <SelectItem key={finca.id} value={finca.nombre_finca}>
                      {finca.nombre_finca} - {finca.ciudad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filtro-tipo">Tipo de Venta</Label>
              <Select onValueChange={setFiltroTipoVenta} value={filtroTipoVenta}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {tiposVenta.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="filtro-forma-pago">Forma de Pago</Label>
              <Select onValueChange={setFiltroFormaPago} value={filtroFormaPago}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las formas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las formas</SelectItem>
                  {formasPago.map((forma) => (
                    <SelectItem key={forma} value={forma}>
                      {forma}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="fecha-inicio">Fecha Inicio</Label>
              <Input
                id="fecha-inicio"
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fecha-fin">Fecha Fin</Label>
              <Input
                id="fecha-fin"
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={limpiarFiltros}>
              Limpiar Filtros
            </Button>
            <div className="flex gap-2 items-center">
              <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportar Excel
              </Button>
              <div className="text-lg font-semibold">
                Total Filtrado: ${calcularTotalVentas().toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Ventas</CardDescription>
            <CardTitle className="text-2xl">{ventasFiltradas.length}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Valor Total</CardDescription>
            <CardTitle className="text-2xl">${calcularTotalVentas().toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Promedio por Venta</CardDescription>
            <CardTitle className="text-2xl">
              ${ventasFiltradas.length > 0 ? (calcularTotalVentas() / ventasFiltradas.length).toLocaleString() : '0'}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Clientes Únicos</CardDescription>
            <CardTitle className="text-2xl">
              {new Set(ventasFiltradas.map(v => v.cliente)).size}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Tabla de Ventas */}
      <Card>
        <CardHeader>
          <CardTitle>Listado de Ventas</CardTitle>
          <CardDescription>
            {ventasFiltradas.length} venta(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Finca/Destino</TableHead>
                <TableHead>Tipo de Venta</TableHead>
                <TableHead>Ciudad Entrega</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Forma de Pago</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventasFiltradas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell>
                    {new Date(venta.fecha).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{venta.cliente}</TableCell>
                  <TableCell>{getFincaFromDestino(venta.destino_material) || venta.destino_material}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      venta.tipo_venta === 'Solo material' ? 'bg-blue-100 text-blue-800' :
                      venta.tipo_venta === 'Solo transporte' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
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
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {ventasFiltradas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
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
