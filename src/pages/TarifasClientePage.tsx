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
import { useDataPersistence } from '@/hooks/useDataPersistence';

import TarifasClienteStats from "@/components/tarifas/TarifasClienteStats";
import TarifasClienteTable from "@/components/tarifas/TarifasClienteTable";
import TarifaClienteForm from "@/components/TarifaClienteForm";

const TarifasClientePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { machines } = useMachine();
  const { saveToLocalStorage, loadFromLocalStorage } = useDataPersistence();

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
    loadData();
  }, [user, navigate]);

  const loadData = () => {
    console.log('🔄 Cargando datos de tarifas cliente...');
    const tarifasData = loadFromLocalStorage('tarifas_cliente', []);
    const clientesData = loadFromLocalStorage('clientes', []);
    const proveedoresData = loadFromLocalStorage('proveedores', []);
    const materialesData = loadFromLocalStorage('materiales_volquetas', []);
    
    setTarifas(tarifasData);
    setClientes(clientesData);
    setProveedores(proveedoresData);
    setMateriales(materialesData);
    
    console.log('✅ Datos cargados - Tarifas:', tarifasData.length);
  };

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
    
    const guardadoExitoso = saveToLocalStorage('tarifas_cliente', tarifasActualizadas);
    if (guardadoExitoso) {
      setTarifas(tarifasActualizadas);
      setShowDialog(false);
      setEditingTarifa(null);
    } else {
      toast.error('Error guardando la tarifa');
    }
  };

  const handleEdit = (tarifa: TarifaCliente) => {
    setEditingTarifa(tarifa);
    setShowDialog(true);
  };

  const handleDeleteTarifa = (id: string) => {
    const tarifasActualizadas = tarifas.filter(t => t.id !== id);
    const guardadoExitoso = saveToLocalStorage('tarifas_cliente', tarifasActualizadas);
    if (guardadoExitoso) {
      setTarifas(tarifasActualizadas);
      toast.success('Tarifa eliminada');
    } else {
      toast.error('Error eliminando la tarifa');
    }
  };

  const handleToggleStatus = (id: string) => {
    const tarifasActualizadas = tarifas.map(t =>
      t.id === id ? { ...t, activa: !t.activa } : t
    );
    const guardadoExitoso = saveToLocalStorage('tarifas_cliente', tarifasActualizadas);
    if (guardadoExitoso) {
      setTarifas(tarifasActualizadas);
    } else {
      toast.error('Error actualizando el estado de la tarifa');
    }
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
    <div className="container mx-auto py-8 px-4 animate-fade-in min-h-screen">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-2 mb-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Tarifas por Cliente
            </h1>
            <p className="text-lg text-slate-600">
              Gestiona las tarifas especiales de transporte, alquiler y escombrera para cada cliente.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 h-12 px-6 font-semibold border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 shadow-sm hover:scale-105 hover:shadow-md"
          >
            <ArrowLeft size={18} />
            Volver al panel admin
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total Tarifas</p>
                <p className="text-3xl font-bold text-blue-800">{tarifas.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-semibold uppercase tracking-wide">Transporte</p>
                <p className="text-3xl font-bold text-green-800">{totalTransporte}</p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">Alquiler</p>
                <p className="text-3xl font-bold text-purple-800">{totalAlquiler}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-semibold uppercase tracking-wide">Escombrera</p>
                <p className="text-3xl font-bold text-orange-800">{totalEscombrera}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-800">Gestión de Tarifas</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Administra tarifas personalizadas para transporte, alquiler y recepción de escombrera.
              </CardDescription>
            </div>
            <Dialog open={showDialog} onOpenChange={(open) => {
              setShowDialog(open);
              if (!open) {
                setEditingTarifa(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in">
                  <Plus className="mr-2 h-5 w-5" />
                  Agregar Tarifa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] bg-white shadow-2xl border-0 animate-fade-in">
                <DialogHeader className="text-center space-y-4 pb-4 border-b border-slate-100">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                      {editingTarifa ? 'Editar Tarifa' : 'Agregar Nueva Tarifa'}
                    </DialogTitle>
                    <DialogDescription className="text-base text-slate-600">
                      Define tarifas especiales para servicios de transporte, alquiler de maquinaria o recepción de escombrera.
                    </DialogDescription>
                  </div>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="py-4">
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
        <CardContent className="p-4 md:p-8">
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 pointer-events-none" />
              <Input
                placeholder="Buscar por cliente, máquina, destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-slate-300 focus:border-blue-500 bg-white rounded-lg shadow-sm"
              />
            </div>
          </div>
          {tarifasFiltradas.length > 0 ? (
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
          ) : (
            <div className="text-center py-16 space-y-6">
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center animate-fade-in">
                <DollarSign className="w-12 h-12 text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-semibold text-slate-600">No hay tarifas registradas</p>
                <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
                  {searchTerm
                    ? 'No se encontraron tarifas que coincidan con tu búsqueda.'
                    : 'Agrega nuevas tarifas para comenzar.'}
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
