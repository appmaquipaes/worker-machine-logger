
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Search, DollarSign, Truck, Settings, MapPin } from 'lucide-react';
import {
  TarifaCliente,
  loadTarifasCliente,
  saveTarifasCliente,
} from '@/models/TarifasCliente';
import { loadClientes } from '@/models/Clientes';
import { useMachine } from '@/context/MachineContext';
import { loadMateriales } from '@/models/Materiales';
import { loadProveedores } from '@/models/Proveedores';

import TarifasClienteStats from "@/components/tarifas/TarifasClienteStats";
import TarifasClienteTable from "@/components/tarifas/TarifasClienteTable";
import TarifaClienteForm from "@/components/TarifaClienteForm";

const TarifasClientePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { machines } = useMachine();

  // Estados principales
  const [tarifas, setTarifas] = useState<TarifaCliente[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  const [showDialog, setShowDialog] = useState(false);
  const [editingTarifa, setEditingTarifa] = useState<TarifaCliente | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Para filtrar búsqueda
  const tarifasFiltradas = tarifas.filter(t => {
    const clienteObj = clientes.find(c => c.id === t.cliente || c.nombre_cliente === t.cliente);
    const clienteNombre = clienteObj?.nombre_cliente || t.cliente || '';
    const maquina = machines.find(m => m.id === t.maquina_id);
    const escombrera = machines.find(m => m.id === t.escombrera_id);
    const maquinaNombre = maquina?.name || escombrera?.name || t.tipo_maquina || '';
    const destinoText = t.destino || '';
    return (
      clienteNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      maquinaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      destinoText.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'Administrador') {
      toast.error('No tienes permisos para acceder a esta página');
      navigate('/dashboard');
      return;
    }
    setTarifas(loadTarifasCliente());
    setClientes(loadClientes());
    setProveedores(loadProveedores());
    setMateriales(loadMateriales());
  }, [user, navigate]);

  const handleTarifaCreated = (nuevaTarifa: TarifaCliente) => {
    let tarifasActualizadas: TarifaCliente[];
    if (editingTarifa) {
      tarifasActualizadas = tarifas.map(t => t.id === editingTarifa.id
        ? { ...nuevaTarifa, id: editingTarifa.id, fecha_creacion: editingTarifa.fecha_creacion, activa: t.activa }
        : t
      );
      toast.success('Tarifa actualizada exitosamente');
    } else {
      tarifasActualizadas = [...tarifas, nuevaTarifa];
      toast.success('Tarifa agregada exitosamente');
    }
    saveTarifasCliente(tarifasActualizadas);
    setTarifas(tarifasActualizadas);
    setShowDialog(false);
    setEditingTarifa(null);
  };

  const handleEdit = (tarifa: TarifaCliente) => {
    setEditingTarifa(tarifa);
    setShowDialog(true);
  };

  const handleDeleteTarifa = (id: string) => {
    const tarifasActualizadas = tarifas.filter(t => t.id !== id);
    saveTarifasCliente(tarifasActualizadas);
    setTarifas(tarifasActualizadas);
    toast.success('Tarifa eliminada');
  };

  const handleToggleStatus = (id: string) => {
    const tarifasActualizadas = tarifas.map(t =>
      t.id === id ? { ...t, activa: !t.activa } : t
    );
    saveTarifasCliente(tarifasActualizadas);
    setTarifas(tarifasActualizadas);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setEditingTarifa(null);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  const getMaterialName = (id?: string) => {
    if (!id) return '-';
    const m = materiales.find(mat => mat.id === id);
    return m ? m.nombre_material : id;
  };
  
  const getMachineName = (id?: string) => {
    if (!id) return '-';
    const machine = machines.find(m => m.id === id);
    return machine ? `${machine.name} (${machine.plate})` : id;
  };

  const calcularMargen = (tarifa: TarifaCliente) => {
    if (!tarifa.valor_material_m3 || !tarifa.valor_material_cliente_m3) return null;
    const margen = tarifa.valor_material_cliente_m3 - tarifa.valor_material_m3;
    const porcentaje = ((margen / tarifa.valor_material_m3) * 100).toFixed(1);
    return { margen, porcentaje };
  };

  const totalTransporte = tarifas.filter(t => t.tipo_servicio === 'transporte').length;
  const totalAlquiler = tarifas.filter(t => t.tipo_servicio === 'alquiler_maquina').length;
  const totalEscombrera = tarifas.filter(t => t.tipo_servicio === 'recepcion_escombrera').length;

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-6 px-4 animate-fade-in min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header Section */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Tarifas por Cliente
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              Gestiona las tarifas especiales de transporte, alquiler y escombrera para cada cliente de manera sencilla y organizada.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-3 h-14 px-8 text-lg font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 shadow-lg hover:scale-105 hover:shadow-xl rounded-xl"
          >
            <ArrowLeft size={22} />
            Volver al Panel Admin
          </Button>
        </div>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
        <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-blue-600 text-base font-bold uppercase tracking-wide">Total Tarifas</p>
                <p className="text-4xl font-bold text-blue-800">{tarifas.length}</p>
              </div>
              <div className="p-4 bg-blue-200 rounded-2xl">
                <DollarSign className="h-10 w-10 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-xl border-0 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-green-600 text-base font-bold uppercase tracking-wide">Transporte</p>
                <p className="text-4xl font-bold text-green-800">{totalTransporte}</p>
              </div>
              <div className="p-4 bg-green-200 rounded-2xl">
                <Truck className="h-10 w-10 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-xl border-0 bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-purple-600 text-base font-bold uppercase tracking-wide">Alquiler</p>
                <p className="text-4xl font-bold text-purple-800">{totalAlquiler}</p>
              </div>
              <div className="p-4 bg-purple-200 rounded-2xl">
                <Settings className="h-10 w-10 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-xl border-0 bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-orange-600 text-base font-bold uppercase tracking-wide">Escombrera</p>
                <p className="text-4xl font-bold text-orange-800">{totalEscombrera}</p>
              </div>
              <div className="p-4 bg-orange-200 rounded-2xl">
                <MapPin className="h-10 w-10 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-2xl border-0 bg-white backdrop-blur rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200 p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <CardTitle className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                Gestión de Tarifas
              </CardTitle>
              <CardDescription className="text-lg text-slate-600 leading-relaxed">
                Administra tarifas personalizadas para servicios de transporte, alquiler de maquinaria y recepción de escombrera.
              </CardDescription>
            </div>
            
            <Dialog open={showDialog} onOpenChange={(open) => {
              setShowDialog(open);
              if (!open) {
                setEditingTarifa(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="h-16 px-8 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl">
                  <Plus className="mr-3 h-6 w-6" />
                  Agregar Nueva Tarifa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px] max-h-[90vh] bg-white shadow-2xl border-0 animate-fade-in rounded-2xl">
                <DialogHeader className="text-center space-y-6 pb-6 border-b-2 border-slate-100">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center shadow-xl">
                    <DollarSign className="h-10 w-10 text-white" />
                  </div>
                  <div className="space-y-3">
                    <DialogTitle className="text-3xl font-bold text-slate-800">
                      {editingTarifa ? 'Editar Tarifa Existente' : 'Crear Nueva Tarifa'}
                    </DialogTitle>
                    <DialogDescription className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                      {editingTarifa 
                        ? 'Modifica los valores y configuraciones de la tarifa seleccionada.'
                        : 'Define tarifas especiales para servicios de transporte, alquiler de maquinaria o recepción de escombrera.'
                      }
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] px-2">
                  <div className="py-6">
                    <TarifaClienteForm
                      initialData={editingTarifa}
                      onTarifaCreated={handleTarifaCreated}
                      onCancel={handleCancel}
                    />
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="p-8">
          {/* Search Section */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6 pointer-events-none" />
              <Input
                placeholder="Buscar por cliente, máquina, destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-14 h-16 text-lg border-2 border-slate-300 focus:border-blue-500 bg-white rounded-xl shadow-lg focus:shadow-xl transition-all duration-300"
              />
            </div>
          </div>
          
          {/* Table or Empty State */}
          {tarifasFiltradas.length > 0 ? (
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden shadow-lg">
              <TarifasClienteTable
                tarifas={tarifasFiltradas}
                clientes={clientes}
                machines={machines}
                materiales={materiales}
                onEdit={handleEdit}
                onDelete={handleDeleteTarifa}
                onToggleStatus={handleToggleStatus}
                calcularMargen={calcularMargen}
                formatCurrency={formatCurrency}
                getMaterialName={getMaterialName}
                getMachineName={getMachineName}
              />
            </div>
          ) : (
            <div className="text-center py-20 space-y-8">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center animate-fade-in shadow-lg">
                <DollarSign className="w-16 h-16 text-slate-400" />
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-slate-600">
                  {searchTerm ? 'No se encontraron tarifas' : 'No hay tarifas registradas'}
                </h3>
                <p className="text-lg text-slate-500 max-w-lg mx-auto leading-relaxed">
                  {searchTerm
                    ? 'No se encontraron tarifas que coincidan con tu búsqueda. Intenta con otros términos.'
                    : 'Comienza agregando nuevas tarifas personalizadas para tus clientes utilizando el botón "Agregar Nueva Tarifa".'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TarifasClientePage;
