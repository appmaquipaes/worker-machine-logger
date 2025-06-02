import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { InventarioAcopio, loadInventarioAcopio } from '@/models/InventarioAcopio';
import { toast } from "@/hooks/use-toast";
import { Report } from '@/context/ReportContext';
import ProfitCalculator from '@/components/ProfitCalculator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InventarioPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estado
  const [inventario, setInventario] = useState<InventarioAcopio[]>([]);
  const [materialTrips, setMaterialTrips] = useState<Report[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Report | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Control de acceso - solo administradores
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'Administrador') {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder a esta página",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Función para cargar datos
  const cargarDatos = () => {
    console.log('Cargando datos del inventario...');
    setIsRefreshing(true);
    
    try {
      const inventarioActual = loadInventarioAcopio();
      console.log('Inventario cargado:', inventarioActual);
      setInventario(inventarioActual);
      
      // Cargar reportes de viajes relacionados con material
      const storedReports = localStorage.getItem('reports');
      if (storedReports) {
        const reports = JSON.parse(storedReports).map((report: any) => ({
          ...report,
          createdAt: new Date(report.createdAt),
          reportDate: report.reportDate ? new Date(report.reportDate) : new Date(report.createdAt),
        }));
        
        // Filtrar solo reportes de tipo 'Viajes'
        const materialReports = reports.filter((report: Report) => 
          report.reportType === 'Viajes' && 
          report.cantidadM3 && 
          report.value && 
          report.destination
        );
        
        setMaterialTrips(materialReports);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast({
        title: "Error",
        description: "Error al cargar los datos del inventario",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  // Escuchar cambios en localStorage para actualizar automáticamente
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'inventario_acopio') {
        console.log('Detectado cambio en inventario_acopio, recargando...');
        cargarDatos();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // También escuchar cambios internos (mismo tab)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, [key, value]);
      if (key === 'inventario_acopio') {
        console.log('Detectado cambio interno en inventario_acopio, recargando...');
        setTimeout(() => cargarDatos(), 100); // Pequeño delay para asegurar que se guardó
      }
    };

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      localStorage.setItem = originalSetItem;
    };
  }, []);

  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString();
  };

  const handleSelectTrip = (trip: Report) => {
    setSelectedTrip(trip);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleRefresh = () => {
    cargarDatos();
    toast({
      title: "Inventario actualizado",
      description: "Los datos del inventario han sido recargados",
    });
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Inventario de Material</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              Actualizar
            </Button>
            <Button 
              variant="back" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Volver al panel admin
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          Estado actual del inventario de materiales
        </p>
      </div>

      <Tabs defaultValue="inventario" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="inventario">Inventario Actual</TabsTrigger>
          <TabsTrigger value="ventas">Análisis de Ventas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventario">
          {/* Tabla de inventario */}
          <Card>
            <CardHeader>
              <CardTitle>Stock Disponible</CardTitle>
              <CardDescription>
                Listado de todos los materiales en inventario
                {isRefreshing && <span className="ml-2 text-blue-600">Actualizando...</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inventario.length > 0 ? (
                <div className="rounded-md border overflow-hidden overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Material</TableHead>
                        <TableHead>Cantidad Disponible (m³)</TableHead>
                        <TableHead>Costo Promedio por m³</TableHead>
                        <TableHead>Valor Total en Inventario</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventario.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.tipo_material}</TableCell>
                          <TableCell>{formatNumber(item.cantidad_disponible)} m³</TableCell>
                          <TableCell>${formatNumber(item.costo_promedio_m3)}</TableCell>
                          <TableCell>${formatNumber(item.cantidad_disponible * item.costo_promedio_m3)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No hay materiales en inventario</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ventas">
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Viajes con Material</CardTitle>
                <CardDescription>
                  Seleccione un viaje para ver análisis detallado
                </CardDescription>
              </CardHeader>
              <CardContent>
                {materialTrips.length > 0 ? (
                  <div className="rounded-md border overflow-hidden overflow-y-auto max-h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Material</TableHead>
                          <TableHead>Cantidad (m³)</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {materialTrips.map((trip) => (
                          <TableRow 
                            key={trip.id}
                            className={selectedTrip?.id === trip.id ? "bg-primary/10" : ""}
                          >
                            <TableCell>{formatDate(trip.reportDate)}</TableCell>
                            <TableCell className="font-medium">{trip.description}</TableCell>
                            <TableCell>{formatNumber(trip.cantidadM3)} m³</TableCell>
                            <TableCell>${formatNumber(trip.value)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSelectTrip(trip)}
                              >
                                Analizar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No hay viajes registrados con material</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <div className="md:col-span-1">
              {selectedTrip ? (
                <>
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle>Detalles del Viaje</CardTitle>
                      <CardDescription>
                        Información completa del viaje seleccionado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="font-medium">Fecha:</div>
                        <div>{formatDate(selectedTrip.reportDate)}</div>
                        
                        <div className="font-medium">Material:</div>
                        <div>{selectedTrip.description}</div>
                        
                        <div className="font-medium">Cantidad:</div>
                        <div>{formatNumber(selectedTrip.cantidadM3)} m³</div>
                        
                        <div className="font-medium">Origen:</div>
                        <div>{selectedTrip.origin}</div>
                        
                        <div className="font-medium">Destino:</div>
                        <div>{selectedTrip.destination}</div>
                        
                        <div className="font-medium">Operador:</div>
                        <div>{selectedTrip.userName}</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <ProfitCalculator report={selectedTrip} />
                </>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-60">
                    <p className="text-muted-foreground">
                      Seleccione un viaje para ver su análisis de utilidad
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventarioPage;
