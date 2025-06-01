
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Search, FileText, Calendar, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Compra, loadCompras } from '@/models/Compras';
import { loadProveedores } from '@/models/Proveedores';
import { toast } from 'sonner';
import RegistrarCompraDialog from '@/components/RegistrarCompraDialog';

const ComprasPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estados
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filteredCompras, setFilteredCompras] = useState<Compra[]>([]);
  const [showRegistrarDialog, setShowRegistrarDialog] = useState(false);
  
  // Filtros
  const [filterProveedor, setFilterProveedor] = useState('');
  const [filterTipoInsumo, setFilterTipoInsumo] = useState('');
  const [filterFormaPago, setFilterFormaPago] = useState('');
  const [filterFechaDesde, setFilterFechaDesde] = useState('');
  const [filterFechaHasta, setFilterFechaHasta] = useState('');
  
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

  // Aplicar filtros
  useEffect(() => {
    let filtered = [...compras];

    if (filterProveedor) {
      filtered = filtered.filter(compra => 
        compra.proveedor_nombre.toLowerCase().includes(filterProveedor.toLowerCase())
      );
    }

    if (filterTipoInsumo) {
      filtered = filtered.filter(compra => compra.tipo_insumo === filterTipoInsumo);
    }

    if (filterFormaPago) {
      filtered = filtered.filter(compra => compra.forma_pago === filterFormaPago);
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
  }, [compras, filterProveedor, filterTipoInsumo, filterFormaPago, filterFechaDesde, filterFechaHasta]);

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

  // Calcular estadísticas
  const totalCompras = filteredCompras.reduce((sum, compra) => sum + compra.total, 0);
  const totalComprasCount = filteredCompras.length;
  const promedioCompra = totalComprasCount > 0 ? totalCompras / totalComprasCount : 0;

  const proveedores = loadProveedores();

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Gestión de Compras</h1>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowRegistrarDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} />
              Nueva Compra
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Volver al panel admin
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Registro y seguimiento de todas las compras de materiales, lubricantes, repuestos y servicios
        </p>
      </div>

      <Tabs defaultValue="compras" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="compras">Lista de Compras</TabsTrigger>
          <TabsTrigger value="reportes">Reportes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compras">
          {/* Filtros */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search size={20} />
                Filtros de Búsqueda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="filter-proveedor">Proveedor</Label>
                  <Input
                    id="filter-proveedor"
                    placeholder="Buscar proveedor..."
                    value={filterProveedor}
                    onChange={(e) => setFilterProveedor(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="filter-tipo">Tipo de Insumo</Label>
                  <Select onValueChange={setFilterTipoInsumo} value={filterTipoInsumo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="Material">Material</SelectItem>
                      <SelectItem value="Lubricante">Lubricante</SelectItem>
                      <SelectItem value="Repuesto">Repuesto</SelectItem>
                      <SelectItem value="Servicio">Servicio</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="filter-pago">Forma de Pago</Label>
                  <Select onValueChange={setFilterFormaPago} value={filterFormaPago}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="Contado">Contado</SelectItem>
                      <SelectItem value="Crédito">Crédito</SelectItem>
                      <SelectItem value="Otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="filter-fecha-desde">Fecha Desde</Label>
                  <Input
                    id="filter-fecha-desde"
                    type="date"
                    value={filterFechaDesde}
                    onChange={(e) => setFilterFechaDesde(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="filter-fecha-hasta">Fecha Hasta</Label>
                  <Input
                    id="filter-fecha-hasta"
                    type="date"
                    value={filterFechaHasta}
                    onChange={(e) => setFilterFechaHasta(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="flex items-center p-6">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Compras</p>
                  <p className="text-2xl font-bold">{totalComprasCount}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Valor Total</p>
                  <p className="text-2xl font-bold">${formatNumber(totalCompras)}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Promedio por Compra</p>
                  <p className="text-2xl font-bold">${formatNumber(promedioCompra)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabla de compras */}
          <Card>
            <CardHeader>
              <CardTitle>Registro de Compras</CardTitle>
              <CardDescription>
                {filteredCompras.length} compra(s) encontrada(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCompras.length > 0 ? (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Documento</TableHead>
                        <TableHead>Proveedor</TableHead>
                        <TableHead>Tipo Insumo</TableHead>
                        <TableHead>Destino</TableHead>
                        <TableHead>Forma Pago</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Items</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompras.map((compra) => (
                        <TableRow key={compra.id}>
                          <TableCell>{formatDate(compra.fecha)}</TableCell>
                          <TableCell>
                            <div className="font-medium">{compra.tipo_documento}</div>
                            <div className="text-sm text-muted-foreground">{compra.numero_documento}</div>
                          </TableCell>
                          <TableCell className="font-medium">{compra.proveedor_nombre}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              compra.tipo_insumo === 'Material' ? 'bg-blue-100 text-blue-800' :
                              compra.tipo_insumo === 'Lubricante' ? 'bg-yellow-100 text-yellow-800' :
                              compra.tipo_insumo === 'Repuesto' ? 'bg-red-100 text-red-800' :
                              compra.tipo_insumo === 'Servicio' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {compra.tipo_insumo}
                            </span>
                          </TableCell>
                          <TableCell>{compra.destino_insumo}</TableCell>
                          <TableCell>{compra.forma_pago}</TableCell>
                          <TableCell className="font-medium">${formatNumber(compra.total)}</TableCell>
                          <TableCell>{compra.detalles.length} item(s)</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No se encontraron compras</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reportes">
          <Card>
            <CardHeader>
              <CardTitle>Reportes de Compras</CardTitle>
              <CardDescription>
                Análisis y estadísticas de compras
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-10">
                <p className="text-muted-foreground">Funcionalidad de reportes en desarrollo</p>
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
