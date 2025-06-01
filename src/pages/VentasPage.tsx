
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
import { ArrowLeft, Plus, Eye, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Venta, loadVentas, tiposVenta } from '@/models/Ventas';
import { loadClientes } from '@/models/Clientes';
import RegistrarVentaDialog from '@/components/RegistrarVentaDialog';

const VentasPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<Venta[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Filtros
  const [filtroCliente, setFiltroCliente] = useState('all');
  const [filtroTipoVenta, setFiltroTipoVenta] = useState('all');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  
  const [clientes, setClientes] = useState<string[]>([]);

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
    const clientesData = loadClientes().map(c => c.nombre_cliente);
    
    setVentas(ventasData);
    setVentasFiltradas(ventasData);
    setClientes(clientesData);
  };

  // Aplicar filtros
  useEffect(() => {
    let ventasFiltered = [...ventas];

    if (filtroCliente && filtroCliente !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => v.cliente === filtroCliente);
    }

    if (filtroTipoVenta && filtroTipoVenta !== 'all') {
      ventasFiltered = ventasFiltered.filter(v => v.tipo_venta === filtroTipoVenta);
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
  }, [ventas, filtroCliente, filtroTipoVenta, filtroFechaInicio, filtroFechaFin]);

  const limpiarFiltros = () => {
    setFiltroCliente('all');
    setFiltroTipoVenta('all');
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
  };

  const calcularTotalVentas = () => {
    return ventasFiltradas.reduce((total, venta) => total + venta.total_venta, 0);
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="filtro-cliente">Cliente</Label>
              <Select onValueChange={setFiltroCliente} value={filtroCliente}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los clientes</SelectItem>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente} value={cliente}>
                      {cliente}
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
            <div className="text-lg font-semibold">
              Total Filtrado: ${calcularTotalVentas().toLocaleString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                  <TableCell>{venta.cliente}</TableCell>
                  <TableCell>{venta.tipo_venta}</TableCell>
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
