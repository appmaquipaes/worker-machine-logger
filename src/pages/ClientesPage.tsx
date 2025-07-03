import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from "sonner";
import { ArrowLeft, UserPlus, Users, MapPin, Search, Building2, Contact, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Cliente, 
  loadClientes, 
  saveClientes, 
  createCliente,
  updateCliente,
  deleteCliente,
  getTiposPersona,
  getTiposCliente,
  TipoPersona
} from '@/models/Clientes';
import { Finca, loadFincas, getFincasByCliente } from '@/models/Fincas';
import FincasManagement from '@/components/FincasManagement';
import ClientesTable from '@/components/clientes/ClientesTable';
import ClienteDialogForm from '@/components/clientes/ClienteDialogForm';
import EditarClienteDialog from '@/components/clientes/EditarClienteDialog';
import ClientesEmptyState from '@/components/clientes/ClientesEmptyState';

const formSchema = z.object({
  nombre_cliente: z.string().min(1, 'El nombre del cliente es requerido'),
  tipo_persona: z.string().min(1, 'El tipo de persona es requerido'),
  nit_cedula: z.string().min(1, 'El NIT o cédula es requerido'),
  correo_electronico: z.string().email('Email inválido').optional().or(z.literal('')),
  persona_contacto: z.string().min(1, 'La persona de contacto es requerida'),
  telefono_contacto: z.string().min(1, 'El teléfono de contacto es requerido'),
  ciudad: z.string().min(1, 'La ciudad es requerida'),
  tipo_cliente: z.string().optional(),
  observaciones: z.string().optional(),
});

const ClientesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showFincasDialog, setShowFincasDialog] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipoPersona, setFilterTipoPersona] = useState('');
  const [filterTipoCliente, setFilterTipoCliente] = useState('');

  const tiposPersona = getTiposPersona();
  const tiposCliente = getTiposCliente();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_cliente: '',
      tipo_persona: '',
      nit_cedula: '',
      correo_electronico: '',
      persona_contacto: '',
      telefono_contacto: '',
      ciudad: '',
      tipo_cliente: '',
      observaciones: '',
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setClientes(loadClientes());
    setFincas(loadFincas());
  };

  const filteredClientes = clientes.filter(cliente => {
    const matchesSearch = cliente.nombre_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.nit_cedula.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cliente.persona_contacto.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipoPersona = !filterTipoPersona || cliente.tipo_persona === filterTipoPersona;
    const matchesTipoCliente = !filterTipoCliente || cliente.tipo_cliente === filterTipoCliente;
    
    return matchesSearch && matchesTipoPersona && matchesTipoCliente;
  });

  const getFincasCount = (clienteId: string): number => {
    return getFincasByCliente(clienteId).length;
  };

  const getTipoClienteColor = (tipo?: string): "default" | "secondary" | "destructive" | "outline" => {
    if (!tipo) return "outline";
    switch (tipo.toLowerCase()) {
      case 'vip': return 'default';
      case 'premium': return 'secondary';
      case 'regular': return 'outline';
      default: return 'secondary';
    }
  };

  const handleAddCliente = (data: z.infer<typeof formSchema>) => {
    try {
      const nuevoCliente = createCliente(
        data.nombre_cliente,
        data.tipo_persona as TipoPersona,
        data.nit_cedula,
        data.correo_electronico || undefined,
        data.persona_contacto,
        data.telefono_contacto,
        data.ciudad,
        data.tipo_cliente as any || undefined,
        data.observaciones || undefined
      );

      const clientesActualizados = [...clientes, nuevoCliente];
      saveClientes(clientesActualizados);
      setClientes(clientesActualizados);
      
      form.reset();
      setShowAddDialog(false);
      toast.success('Cliente agregado exitosamente');
    } catch (error) {
      console.error('Error agregando cliente:', error);
      toast.error('Error al agregar el cliente');
    }
  };

  const handleUpdateCliente = (data: z.infer<typeof formSchema>) => {
    if (!selectedCliente) return;

    try {
      const clienteActualizado = updateCliente(selectedCliente.id, {
        nombre_cliente: data.nombre_cliente,
        tipo_persona: data.tipo_persona as TipoPersona,
        nit_cedula: data.nit_cedula,
        correo_electronico: data.correo_electronico || undefined,
        persona_contacto: data.persona_contacto,
        telefono_contacto: data.telefono_contacto,
        ciudad: data.ciudad,
        tipo_cliente: data.tipo_cliente as any || undefined,
        observaciones: data.observaciones || undefined,
      });

      const clientesActualizados = clientes.map(c => 
        c.id === selectedCliente.id ? clienteActualizado : c
      );
      
      saveClientes(clientesActualizados);
      setClientes(clientesActualizados);
      setShowEditDialog(false);
      setSelectedCliente(null);
      toast.success('Cliente actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando cliente:', error);
      toast.error('Error al actualizar el cliente');
    }
  };

  const handleDeleteCliente = (id: string) => {
    try {
      deleteCliente(id);
      const clientesActualizados = clientes.filter(c => c.id !== id);
      saveClientes(clientesActualizados);
      setClientes(clientesActualizados);
      toast.success('Cliente eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      toast.error('Error al eliminar el cliente');
    }
  };

  const openEditCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    form.reset({
      nombre_cliente: cliente.nombre_cliente,
      tipo_persona: cliente.tipo_persona,
      nit_cedula: cliente.nit_cedula,
      correo_electronico: cliente.correo_electronico || '',
      persona_contacto: cliente.persona_contacto,
      telefono_contacto: cliente.telefono_contacto,
      ciudad: cliente.ciudad,
      tipo_cliente: cliente.tipo_cliente || '',
      observaciones: cliente.observaciones || '',
    });
    setShowEditDialog(true);
  };

  const openFincasManagement = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setShowFincasDialog(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in max-w-7xl">
      {/* Header Section - Estandarizado */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Gestión de Clientes
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  Administra tu cartera de clientes y proyectos
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Agregar Cliente
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] animate-scale-in shadow-xl bg-white border-0 rounded-2xl">
                <DialogHeader className="space-y-4 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-bold text-slate-800">Agregar Cliente</DialogTitle>
                      <DialogDescription className="text-slate-600 mt-1">
                        Complete la información del cliente
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <ClienteDialogForm
                  form={form}
                  tiposPersona={tiposPersona}
                  tiposCliente={tiposCliente}
                  onSubmit={handleAddCliente}
                />
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="h-12 px-6 font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 shadow-sm"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards - Más compactas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold">Total Clientes</p>
                <p className="text-2xl font-bold text-blue-700 mt-1">{clientes.length}</p>
              </div>
              <div className="p-2 bg-blue-200 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold">Empresas</p>
                <p className="text-2xl font-bold text-green-700 mt-1">
                  {clientes.filter(c => c.tipo_persona === 'Empresa').length}
                </p>
              </div>
              <div className="p-2 bg-green-200 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold">Personas Naturales</p>
                <p className="text-2xl font-bold text-purple-700 mt-1">
                  {clientes.filter(c => c.tipo_persona === 'Natural').length}
                </p>
              </div>
              <div className="p-2 bg-purple-200 rounded-lg">
                <Contact className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold">Proyectos Activos</p>
                <p className="text-2xl font-bold text-orange-700 mt-1">{fincas.length}</p>
              </div>
              <div className="p-2 bg-orange-200 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters - Más compactos */}
      <Card className="mb-6 shadow-lg border-0 bg-white rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 rounded-t-2xl">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Search className="h-5 w-5 text-slate-600" />
            Buscar y Filtrar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search" className="text-sm font-semibold text-slate-700">Buscar Cliente</Label>
              <Input
                id="search"
                placeholder="Nombre, NIT/Cédula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 border-2 border-slate-300 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo-persona" className="text-sm font-semibold text-slate-700">Tipo de Persona</Label>
              <select
                id="tipo-persona"
                value={filterTipoPersona}
                onChange={(e) => setFilterTipoPersona(e.target.value)}
                className="w-full h-10 px-3 border-2 border-slate-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors bg-white"
              >
                <option value="">Todos</option>
                {tiposPersona.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo-cliente" className="text-sm font-semibold text-slate-700">Categoría</Label>
              <select
                id="tipo-cliente"
                value={filterTipoCliente}
                onChange={(e) => setFilterTipoCliente(e.target.value)}
                className="w-full h-10 px-3 border-2 border-slate-300 rounded-md focus:border-blue-500 focus:outline-none transition-colors bg-white"
              >
                <option value="">Todas</option>
                {tiposCliente.map((tipo) => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table - Estandarizada */}
      <Card className="shadow-lg border-0 bg-white rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 rounded-t-2xl">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-slate-600" />
              Lista de Clientes
            </div>
            <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
              {filteredClientes.length} resultados
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {filteredClientes.length > 0 ? (
            <ClientesTable
              clientes={filteredClientes}
              getFincasCount={getFincasCount}
              getTipoClienteColor={getTipoClienteColor}
              openFincasManagement={openFincasManagement}
              openEditCliente={openEditCliente}
              handleDeleteCliente={handleDeleteCliente}
              form={form}
              tiposPersona={tiposPersona}
              tiposCliente={tiposCliente}
              handleUpdateCliente={handleUpdateCliente}
            />
          ) : (
            <ClientesEmptyState />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditarClienteDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        cliente={selectedCliente}
        form={form}
        tiposPersona={tiposPersona}
        tiposCliente={tiposCliente}
        onSubmit={handleUpdateCliente}
      />

      <Dialog open={showFincasDialog} onOpenChange={setShowFincasDialog}>
        <DialogContent className="sm:max-w-6xl animate-scale-in shadow-xl bg-white border-0 rounded-2xl">
          <DialogHeader className="space-y-4 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-800">
                  Gestionar Fincas - {selectedCliente?.nombre_cliente}
                </DialogTitle>
                <DialogDescription className="text-slate-600 mt-1">
                  Administra las fincas asociadas a este cliente
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {selectedCliente && (
            <FincasManagement
              clienteId={selectedCliente.id}
              clienteNombre={selectedCliente.nombre_cliente}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientesPage;
