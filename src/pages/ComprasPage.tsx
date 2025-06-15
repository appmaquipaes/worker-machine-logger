import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useMachine } from '@/context/MachineContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Search, FileText, Calendar, DollarSign, Download, BarChart3, Package, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Compra, loadCompras } from '@/models/Compras';
import { loadProveedores } from '@/models/Proveedores';
import { toast } from 'sonner';
import RegistrarCompraDialog from '@/components/RegistrarCompraDialog';
import * as XLSX from 'xlsx';

const ComprasPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { machines } = useMachine();
  
  // Estados
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filteredCompras, setFilteredCompras] = useState<Compra[]>([]);
  const [showRegistrarDialog, setShowRegistrarDialog] = useState(false);
  
  // Filtros
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterTipoInsumo, setFilterTipoInsumo] = useState('all');
  const [filterFormaPago, setFilterFormaPago] = useState('all');
  const [filterFechaDesde, setFilterFechaDesde] = useState('');
  const [filterFechaHasta, setFilterFechaHasta] = useState('');
  const [filterMaquina, setFilterMaquina] = useState('all');
  
  // Control de acceso
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Cargar datos
  useEffect(() => {
    const comprasData = loadCompras();
    setCompras(comprasData);
    setFilteredCompras(comprasData);
  }, []);

  useEffect(() => {
    let filtered = [...compras];

    if (filterProveedor) {
      filtered = filtered.filter(compra => 
        compra.proveedor_nombre.toLowerCase().includes(filterProveedor.toLowerCase())
      );
    }

    if (filterTipoInsumo && filterTipoInsumo !== 'all') {
      filtered = filtered.filter(compra => compra.tipo_insumo === filterTipoInsumo);
    }

    if (filterFormaPago && filterFormaPago !== 'all') {
      filtered = filtered.filter(compra => compra.forma_pago === filterFormaPago);
    }

    if (filterMaquina && filterMaquina !== 'all') {
      filtered = filtered.filter(compra => compra.destino_insumo === filterMaquina);
    }

    if (filterFechaDesde) {
      filtered = filtered.filter(compra => 
        compra.fecha >= new Date(filterFechaDesde)
      );
    }

    if (filterFechaHasta) {
      filtered = filtered.filter(compra => 
        compra.fecha <= new Date(filterFechaHasta)
      );
    }

    setFilteredCompras(filtered);
  }, [compras, filterProveedor, filterTipoInsumo, filterFormaPago, filterFechaDesde, filterFechaHasta, filterMaquina]);

  const handleCompraRegistrada = () => {
    const comprasData = loadCompras();
    setCompras(comprasData);
    setShowRegistrarDialog(false);
    toast.success('Compra registrada exitosamente');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  const formatNumber = (value: number): string => {
    return value.toLocaleString('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const exportToExcel = () => {
    if (filteredCompras.length === 0) {
      toast.error('No hay datos para exportar');
      return;
    }

    const exportData = filteredCompras.map(compra => ({
      'Fecha': formatDate(compra.fecha),
      'Documento': `${compra.tipo_documento} - ${compra.numero_documento}`,
      'Proveedor': compra.proveedor_nombre,
      'Tipo Insumo': compra.tipo_insumo,
      'Destino': compra.destino_insumo,
      'Forma Pago': compra.forma_pago,
      'Total': compra.total,
      'Items': compra.detalles.length
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Compras');
    
    const fileName = `compras_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    toast.success('Reporte exportado correctamente');
  };

  const limpiarFiltros = () => {
    setFilterProveedor('');
    setFilterTipoInsumo('all');
    setFilterFormaPago('all');
    setFilterFechaDesde('');
    setFilterFechaHasta('');
    setFilterMaquina('all');
  };

  // Calcular estadísticas
  const totalCompras = filteredCompras.reduce((sum, compra) => sum + compra.total, 0);
  const totalComprasCount = filteredCompras.length;
  const promedioCompra = totalComprasCount > 0 ? totalCompras / totalComprasCount : 0;

  const proveedores = loadProveedores();

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Gestión de Compras
            </h1>
            <p className="text-lg text-slate-600">
              Registro y seguimiento de todas las compras de materiales, lubricantes, repuestos y servicios
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowRegistrarDialog(true)}
              className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Plus size={18} />
              Nueva Compra
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 h-12 px-6 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300"
            >
              <ArrowLeft size={18} />
              Volver al panel admin
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="compras" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
          <TabsTrigger value="compras">Lista de Compras</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compras">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Compras</p>
                    <p className="text-3xl font-bold text-blue-700">{totalComprasCount}</p>
                  </div>
                  <div className="p-3 bg-blue-200 rounded-xl">
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Valor Total</p>
                    <p className="text-3xl font-bold text-green-700">${formatNumber(totalCompras)}</p>
                  </div>
                  <div className="p-3 bg-green-200 rounded-xl">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">Promedio por Compra</p>
                    <p className="text-3xl font-bold text-purple-700">${formatNumber(promedioCompra)}</p>
                  </div>
                  <div className="p-3 bg-purple-200 rounded-xl">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="mb-8 shadow-2xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                <Search size={20} />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div>
                  <Label htmlFor="filter-proveedor" className="text-slate-700 font-semibold">Proveedor</Label>
                  <Input
                    id="filter-proveedor"
                    placeholder="Buscar proveedor..."
                    value={filterProveedor}
                    onChange={(e) => setFilterProveedor(e.target.value)}
                    className="h-12 border-slate-300 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="filter-tipo" className="text-slate-700 font-semibold">Tipo de Insumo</Label>
                  <Select onValueChange={setFilterTipoInsumo} value={filterTipoInsumo}>
                    <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Lubricante">Lubricante</SelectItem>
                      <SelectItem value="Repuesto">Repuesto</SelectItem>
                      <SelectItem value="Servicio">Servicio</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="filter-maquina" className="text-slate-700 font-semibold">Máquina/Destino</Label>
                  <Select onValueChange={setFilterMaquina} value={filterMaquina}>
                    <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las máquinas</SelectItem>
                      {machines.map((machine) => (
                        <SelectItem key={machine.id} value={machine.name}>
                          {machine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="filter-pago" className="text-slate-700 font-semibold">Forma de Pago</Label>
                  <Select onValueChange={setFilterFormaPago} value={filterFormaPago}>
                    <SelectTrigger className="h-12 border-slate-300 focus:border-blue-500">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="Contado">Contado</SelectItem>
                      <SelectItem value="Crédito">Crédito</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="filter-fecha-desde" className="text-slate-700 font-semibold">Fecha Desde</Label>
                  <Input
                    id="filter-fecha-desde"
                    type="date"
                    value={filterFechaDesde}
                    onChange={(e) => setFilterFechaDesde(e.target.value)}
                    className="h-12 border-slate-300 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <Label htmlFor="filter-fecha-hasta" className="text-slate-700 font-semibold">Fecha Hasta</Label>
                  <Input
                    id="filter-fecha-hasta"
                    type="date"
                    value={filterFechaHasta}
                    onChange={(e) => setFilterFechaHasta(e.target.value)}
                    className="h-12 border-slate-300 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-8">
                <Button variant="outline" onClick={limpiarFiltros} className="h-12 px-6 font-semibold">
                  Limpiar Filtros
                </Button>
                <div className="flex gap-4 items-center">
                  <Button onClick={exportToExcel} variant="outline" className="flex items-center gap-2 h-12 px-6 font-semibold">
                    <Download className="h-4 w-4" />
                    Exportar Excel
                  </Button>
                  <div className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                    Total Filtrado: ${formatNumber(totalCompras)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabla de compras */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="text-2xl font-bold text-slate-800">Registro de Compras</CardTitle>
              <CardDescription className="text-base text-slate-600">
                {filteredCompras.length} compra(s) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              {filteredCompras.length > 0 ? (
                <div className="rounded-xl border border-slate-200 overflow-hidden shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-bold text-slate-700 h-14">Fecha</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Documento</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Proveedor</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Tipo Insumo</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Destino</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Forma Pago</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Total</TableHead>
                        <TableHead className="font-bold text-slate-700 h-14">Items</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompras.map((compra, index) => (
                        <TableRow 
                          key={compra.id}
                          className="hover:bg-blue-50/50 transition-colors duration-200"
                          style={{
                            animationDelay: `${index * 100}ms`,
                            animationFillMode: 'both'
                          }}
                        >
                          <TableCell className="py-4">{formatDate(compra.fecha)}</TableCell>
                          <TableCell className="py-4">
                            <div className="font-medium">{compra.tipo_documento}</div>
                            <div className="text-sm text-muted-foreground">{compra.numero_documento}</div>
                          </TableCell>
                          <TableCell className="font-semibold text-slate-800 py-4">{compra.proveedor_nombre}</TableCell>
                          <TableCell className="py-4">
                            <Badge variant="outline" className={`${
                              compra.tipo_insumo === 'Material' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              compra.tipo_insumo === 'Lubricante' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              compra.tipo_insumo === 'Repuesto' ? 'bg-red-50 text-red-700 border-red-200' :
                              compra.tipo_insumo === 'Servicio' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-gray-50 text-gray-700 border-gray-200'
                            }`}>
                              {compra.tipo_insumo}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-4">{compra.destino_insumo}</TableCell>
                          <TableCell className="py-4">{compra.forma_pago}</TableCell>
                          <TableCell className="font-bold text-emerald-600 py-4">${formatNumber(compra.total)}</TableCell>
                          <TableCell className="py-4">{compra.detalles.length} item(s)</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-16 space-y-6">
                  <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-slate-600">No se encontraron compras</p>
                    <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                      Ajusta los filtros o agrega nuevas compras
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reportes">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-2xl font-bold text-slate-800">
                <BarChart3 className="h-6 w-6" />
                Reportes de Compras
              </CardTitle>
              <CardDescription className="text-base text-slate-600">
                Análisis y estadísticas detalladas de compras
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Reporte por Tipo de Insumo */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader className="pb-3">
                    <CardDescription className="font-semibold text-blue-700">Por Tipo de Insumo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {['Material', 'Lubricante', 'Repuesto', 'Servicio', 'Otro'].map(tipo => {
                      const comprasTipo = filteredCompras.filter(c => c.tipo_insumo === tipo);
                      const totalTipo = comprasTipo.reduce((sum, c) => sum + c.total, 0);
                      return (
                        <div key={tipo} className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700">{tipo}:</span>
                          <span className="font-bold text-emerald-600">${formatNumber(totalTipo)}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Reporte por Proveedor */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader className="pb-3">
                    <CardDescription className="font-semibold text-green-700">Top Proveedores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {proveedores.slice(0, 5).map(proveedor => {
                      const comprasProveedor = filteredCompras.filter(c => c.proveedor_nombre === proveedor.nombre);
                      const totalProveedor = comprasProveedor.reduce((sum, c) => sum + c.total, 0);
                      return (
                        <div key={proveedor.id} className="flex justify-between text-sm mb-2">
                          <span className="truncate font-medium text-slate-700">{proveedor.nombre}:</span>
                          <span className="font-bold text-emerald-600">${formatNumber(totalProveedor)}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Reporte por Máquina */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardHeader className="pb-3">
                    <CardDescription className="font-semibold text-purple-700">Por Máquina/Destino</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {machines.slice(0, 5).map(machine => {
                      const comprasMaquina = filteredCompras.filter(c => c.destino_insumo === machine.name);
                      const totalMaquina = comprasMaquina.reduce((sum, c) => sum + c.total, 0);
                      return (
                        <div key={machine.id} className="flex justify-between text-sm mb-2">
                          <span className="truncate font-medium text-slate-700">{machine.name}:</span>
                          <span className="font-bold text-emerald-600">${formatNumber(totalMaquina)}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Reporte por Forma de Pago */}
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardHeader className="pb-3">
                    <CardDescription className="font-semibold text-orange-700">Por Forma de Pago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {['Contado', 'Crédito', 'Otro'].map(forma => {
                      const comprasForma = filteredCompras.filter(c => c.forma_pago === forma);
                      const totalForma = comprasForma.reduce((sum, c) => sum + c.total, 0);
                      return (
                        <div key={forma} className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700">{forma}:</span>
                          <span className="font-bold text-emerald-600">${formatNumber(totalForma)}</span>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              <div className="text-center">
                <Button 
                  onClick={exportToExcel} 
                  className="flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Download className="h-5 w-5" />
                  Exportar Reporte Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog para registrar nueva compra */}
      <RegistrarCompraDialog
        open={showRegistrarDialog}
        onOpenChange={setShowRegistrarDialog}
        onCompraRegistrada={handleCompraRegistrada}
      />
    </div>
  );
};

export default ComprasPage;
