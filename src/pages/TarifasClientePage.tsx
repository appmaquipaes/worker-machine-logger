
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Plus, DollarSign } from 'lucide-react';
import { 
  TarifaCliente, 
  loadTarifasCliente, 
  saveTarifasCliente 
} from '@/models/TarifasCliente';
import { loadMateriales } from '@/models/Materiales';
import TarifaClienteForm from '@/components/TarifaClienteForm';

const TarifasClientePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tarifas, setTarifas] = useState<TarifaCliente[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    setTarifas(loadTarifasCliente());
    setMateriales(loadMateriales());
  };

  const handleTarifaCreated = (nuevaTarifa: TarifaCliente) => {
    const updatedTarifas = [...tarifas, nuevaTarifa];
    saveTarifasCliente(updatedTarifas);
    setTarifas(updatedTarifas);
    setDialogOpen(false);
  };

  const toggleTarifaStatus = (id: string) => {
    const updatedTarifas = tarifas.map(tarifa =>
      tarifa.id === id ? { ...tarifa, activa: !tarifa.activa } : tarifa
    );
    saveTarifasCliente(updatedTarifas);
    setTarifas(updatedTarifas);
    toast.success('Estado de tarifa actualizado');
  };

  const getMaterialName = (materialId?: string) => {
    if (!materialId) return '-';
    const material = materiales.find(m => m.id === materialId);
    return material ? material.nombre_material : materialId;
  };

  const calcularMargenGanancia = (tarifa: TarifaCliente) => {
    if (!tarifa.valor_material_m3 || !tarifa.valor_material_cliente_m3) return null;
    const margen = tarifa.valor_material_cliente_m3 - tarifa.valor_material_m3;
    const porcentaje = ((margen / tarifa.valor_material_m3) * 100).toFixed(1);
    return { margen, porcentaje };
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Tarifas por Cliente</h1>
          <div className="flex gap-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus size={18} />
                  Nueva Tarifa
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Tarifa</DialogTitle>
                </DialogHeader>
                <TarifaClienteForm
                  onTarifaCreated={handleTarifaCreated}
                  onCancel={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            
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
          Gestiona las tarifas de flete personalizadas por cliente y destino con márgenes de ganancia.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Tarifas Configuradas
          </CardTitle>
          <CardDescription>
            {tarifas.length} tarifa(s) registrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Destino/Punto de Entrega</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Valor Flete/m³</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Valor Material/m³</TableHead>
                <TableHead>Valor Cliente/m³</TableHead>
                <TableHead>Margen</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tarifas.map((tarifa) => {
                const margen = calcularMargenGanancia(tarifa);
                return (
                  <TableRow key={tarifa.id}>
                    <TableCell className="font-medium">{tarifa.cliente}</TableCell>
                    <TableCell>{tarifa.destino}</TableCell>
                    <TableCell>{tarifa.origen}</TableCell>
                    <TableCell>${tarifa.valor_flete_m3.toLocaleString()}</TableCell>
                    <TableCell>{getMaterialName(tarifa.tipo_material)}</TableCell>
                    <TableCell>
                      {tarifa.valor_material_m3 ? `$${tarifa.valor_material_m3.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>
                      {tarifa.valor_material_cliente_m3 ? `$${tarifa.valor_material_cliente_m3.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>
                      {margen ? (
                        <div className="text-sm">
                          <div className="font-medium text-green-600">${margen.margen.toLocaleString()}</div>
                          <div className="text-muted-foreground">({margen.porcentaje}%)</div>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tarifa.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tarifa.activa ? 'Activa' : 'Inactiva'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={tarifa.activa}
                          onCheckedChange={() => toggleTarifaStatus(tarifa.id)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {tarifas.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No hay tarifas configuradas. Crea la primera tarifa usando el botón "Nueva Tarifa".
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TarifasClientePage;
