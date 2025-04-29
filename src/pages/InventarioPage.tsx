
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft } from 'lucide-react';
import { InventarioAcopio, loadInventarioAcopio } from '@/models/InventarioAcopio';
import { toast } from "@/hooks/use-toast";

const InventarioPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estado
  const [inventario, setInventario] = useState<InventarioAcopio[]>([]);

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

  // Cargar datos
  useEffect(() => {
    setInventario(loadInventarioAcopio());
  }, []);

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Inventario de Material</h1>
          <Button 
            variant="back" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
        <p className="text-muted-foreground mt-2">
          Estado actual del inventario de materiales
        </p>
      </div>

      {/* Tabla de inventario */}
      <Card>
        <CardHeader>
          <CardTitle>Stock Disponible</CardTitle>
          <CardDescription>
            Listado de todos los materiales en inventario
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
                      <TableCell>{item.cantidad_disponible.toLocaleString()} m³</TableCell>
                      <TableCell>${item.costo_promedio_m3.toLocaleString()}</TableCell>
                      <TableCell>${(item.cantidad_disponible * item.costo_promedio_m3).toLocaleString()}</TableCell>
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
    </div>
  );
};

export default InventarioPage;
