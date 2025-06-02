
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
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit, DollarSign } from 'lucide-react';
import { 
  TarifaCliente, 
  createTarifaCliente, 
  loadTarifasCliente, 
  saveTarifasCliente 
} from '@/models/TarifasCliente';
import { loadProveedores } from '@/models/Proveedores';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';

const TarifasClientePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [tarifas, setTarifas] = useState<TarifaCliente[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Estados del formulario
  const [cliente, setCliente] = useState('');
  const [finca, setFinca] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [valorFlete, setValorFlete] = useState<number>(0);
  const [valorMaterial, setValorMaterial] = useState<number>(0);
  const [observaciones, setObservaciones] = useState('');

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
    setProveedores(loadProveedores());
  };

  const resetForm = () => {
    setCliente('');
    setFinca('');
    setOrigen('');
    setDestino('');
    setValorFlete(0);
    setValorMaterial(0);
    setObservaciones('');
  };

  const handleSubmit = () => {
    if (!cliente || !origen || !destino || valorFlete <= 0) {
      toast.error('Complete todos los campos obligatorios');
      return;
    }

    const nuevaTarifa = createTarifaCliente(
      cliente,
      finca || undefined,
      origen,
      destino,
      valorFlete,
      valorMaterial > 0 ? valorMaterial : undefined,
      observaciones || undefined
    );

    const updatedTarifas = [...tarifas, nuevaTarifa];
    saveTarifasCliente(updatedTarifas);
    setTarifas(updatedTarifas);
    
    resetForm();
    setDialogOpen(false);
    toast.success('Tarifa creada exitosamente');
  };

  const toggleTarifaStatus = (id: string) => {
    const updatedTarifas = tarifas.map(tarifa =>
      tarifa.id === id ? { ...tarifa, activa: !tarifa.activa } : tarifa
    );
    saveTarifasCliente(updatedTarifas);
    setTarifas(updatedTarifas);
    toast.success('Estado de tarifa actualizado');
  };

  // Handle finca change to also update destino
  const handleFincaChange = (nuevaFinca: string) => {
    setFinca(nuevaFinca);
    setDestino(nuevaFinca); // Sync destino with finca
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Tarifa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <ClienteFincaSelector
                    selectedCliente={cliente}
                    selectedFinca={finca}
                    onClienteChange={setCliente}
                    onFincaChange={handleFincaChange}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="origen">Origen *</Label>
                      <select
                        id="origen"
                        value={origen}
                        onChange={(e) => setOrigen(e.target.value)}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">Seleccionar origen</option>
                        {proveedores.map((prov) => (
                          <option key={prov.id} value={prov.nombre}>
                            {prov.nombre} - {prov.ciudad}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="destino">Destino/Punto de Entrega *</Label>
                      <Input
                        id="destino"
                        value={destino}
                        onChange={(e) => {
                          setDestino(e.target.value);
                          setFinca(e.target.value); // Keep finca in sync
                        }}
                        placeholder="Ciudad destino o punto de entrega"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="valor-flete">Valor Flete por m³ *</Label>
                      <Input
                        id="valor-flete"
                        type="number"
                        value={valorFlete}
                        onChange={(e) => setValorFlete(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="valor-material">Valor Material por m³ (Referencia)</Label>
                      <Input
                        id="valor-material"
                        type="number"
                        value={valorMaterial}
                        onChange={(e) => setValorMaterial(parseFloat(e.target.value) || 0)}
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
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSubmit}>
                      Crear Tarifa
                    </Button>
                  </div>
                </div>
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
          Gestiona las tarifas de flete personalizadas por cliente y destino.
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
                <TableHead>Valor Material/m³</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tarifas.map((tarifa) => (
                <TableRow key={tarifa.id}>
                  <TableCell className="font-medium">{tarifa.cliente}</TableCell>
                  <TableCell>{tarifa.destino}</TableCell>
                  <TableCell>{tarifa.origen}</TableCell>
                  <TableCell>${tarifa.valor_flete_m3.toLocaleString()}</TableCell>
                  <TableCell>
                    {tarifa.valor_material_m3 ? `$${tarifa.valor_material_m3.toLocaleString()}` : '-'}
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
              ))}
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
