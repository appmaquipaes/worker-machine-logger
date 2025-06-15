import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ArrowLeft, Plus, Edit, Trash2, DollarSign, Search, Users, AlertTriangle, Truck, Settings } from 'lucide-react';
import {
  TarifaCliente,
  loadTarifasCliente,
  saveTarifasCliente,
  createTarifaTransporte,
  createTarifaAlquiler
} from '@/models/TarifasCliente';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { useMachine } from '@/context/MachineContext';
import { loadMateriales } from '@/models/Materiales';
import { loadProveedores } from '@/models/Proveedores';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import TarifaTransporteForm from '@/components/TarifaTransporteForm';
import TarifaAlquilerForm from '@/components/TarifaAlquilerForm';

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

  // Formulario compartido
  const [tipoServicio, setTipoServicio] = useState<'transporte' | 'alquiler_maquina'>('transporte');
  const [cliente, setCliente] = useState('');
  const [finca, setFinca] = useState('');
  // Transporte
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [valorFlete, setValorFlete] = useState<number>(0);
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [valorMaterial, setValorMaterial] = useState<number>(0);
  const [valorMaterialCliente, setValorMaterialCliente] = useState<number>(0);
  // Alquiler
  const [maquinaId, setMaquinaId] = useState('');
  const [valorPorHora, setValorPorHora] = useState<number>(0);
  const [valorPorDia, setValorPorDia] = useState<number>(0);
  const [valorPorMes, setValorPorMes] = useState<number>(0);
  // Observaciones
  const [observaciones, setObservaciones] = useState('');

  // Para filtrar búsqueda
  const tarifasFiltradas = tarifas.filter(t => {
    const clienteObj = clientes.find(c => c.id === t.cliente || c.nombre_cliente === t.cliente);
    const clienteNombre = clienteObj?.nombre_cliente || t.cliente || '';
    const maquina = machines.find(m => m.id === t.maquina_id);
    const maquinaNombre = maquina?.name || t.tipo_maquina || '';
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

  // Resetear formulario
  const resetForm = () => {
    setTipoServicio('transporte');
    setCliente('');
    setFinca('');
    setOrigen('');
    setDestino('');
    setValorFlete(0);
    setTipoMaterial('');
    setValorMaterial(0);
    setValorMaterialCliente(0);
    setMaquinaId('');
    setValorPorHora(0);
    setValorPorDia(0);
    setValorPorMes(0);
    setObservaciones('');
  };

  // Selección de cliente y finca
  const handleClienteChange = (nuevoCliente: string) => {
    setCliente(nuevoCliente);
    setFinca('');
    // para transporte, destino default según cliente o finca
    if (tipoServicio === 'transporte' && nuevoCliente) {
      const clienteData = getClienteByName(nuevoCliente) || clientes.find(c => c.id === nuevoCliente);
      if (clienteData) {
        const fincas = (clienteData.fincas || []);
        if (fincas.length === 0) {
          setDestino(clienteData.nombre_cliente || nuevoCliente);
        } else {
          setDestino('');
        }
      }
    } else {
      setDestino('');
    }
  };
  const handleFincaChange = (nuevaFinca: string) => {
    setFinca(nuevaFinca);
    if (tipoServicio === 'transporte') {
      if (nuevaFinca) setDestino(nuevaFinca);
      else if (cliente) {
        const clienteData = getClienteByName(cliente) || clientes.find(c => c.id === cliente);
        if (clienteData) {
          const fincas = (clienteData.fincas || []);
          if (fincas.length === 0) setDestino(clienteData.nombre_cliente || cliente);
          else setDestino('');
        }
      }
    }
  };
  // Material
  const handleMaterialChange = (materialId: string) => {
    setTipoMaterial(materialId);
    if (materialId) {
      const material = materiales.find(m => m.id === materialId);
      if (material) {
        setValorMaterial(material.valor_por_m3);
        setValorMaterialCliente(material.valor_por_m3);
      }
    } else {
      setValorMaterial(0);
      setValorMaterialCliente(0);
    }
  };

  // Crear o actualizar tarifa según tipo
  const handleSubmit = () => {
    if (!cliente) {
      toast.error('Debe seleccionar un cliente');
      return;
    }
    let nuevaTarifa: TarifaCliente;
    if (tipoServicio === 'transporte') {
      if (!origen || !destino || valorFlete <= 0) {
        toast.error('Complete todos los campos obligatorios para Transporte');
        return;
      }
      nuevaTarifa = createTarifaTransporte(
        cliente,
        finca || undefined,
        origen,
        destino,
        valorFlete,
        valorMaterial > 0 ? valorMaterial : undefined,
        valorMaterialCliente > 0 ? valorMaterialCliente : undefined,
        observaciones || undefined,
        tipoMaterial || undefined
      );
    } else {
      if (!maquinaId || (valorPorHora <= 0 && valorPorDia <= 0 && valorPorMes <= 0)) {
        toast.error('Debe seleccionar una máquina y definir al menos un valor de alquiler');
        return;
      }
      const maquina = machines.find(m => m.id === maquinaId);
      nuevaTarifa = createTarifaAlquiler(
        cliente,
        finca || undefined,
        maquinaId,
        maquina?.type || 'Desconocido',
        valorPorHora > 0 ? valorPorHora : undefined,
        valorPorDia > 0 ? valorPorDia : undefined,
        valorPorMes > 0 ? valorPorMes : undefined,
        observaciones || undefined
      );
    }
    let tarifasActualizadas: TarifaCliente[];
    if (editingTarifa) {
      tarifasActualizadas = tarifas.map(t => t.id === editingTarifa.id
        ? { ...nuevaTarifa, id: editingTarifa.id, fecha_creacion: editingTarifa.fecha_creacion, activa: t.activa }
        : t
      );
      toast.success('Tarifa actualizada');
    } else {
      tarifasActualizadas = [...tarifas, nuevaTarifa];
      toast.success('Tarifa agregada');
    }
    saveTarifasCliente(tarifasActualizadas);
    setTarifas(tarifasActualizadas);
    setShowDialog(false);
    setEditingTarifa(null);
    resetForm();
  };

  const handleEdit = (tarifa: TarifaCliente) => {
    setEditingTarifa(tarifa);
    setShowDialog(true);
    setTipoServicio(tarifa.tipo_servicio);
    setCliente(tarifa.cliente);
    setFinca(tarifa.finca || '');
    setObservaciones(tarifa.observaciones || '');
    if (tarifa.tipo_servicio === 'transporte') {
      setOrigen(tarifa.origen || '');
      setDestino(tarifa.destino || '');
      setValorFlete(tarifa.valor_flete_m3 || 0);
      setTipoMaterial(tarifa.tipo_material || '');
      setValorMaterial(tarifa.valor_material_m3 || 0);
      setValorMaterialCliente(tarifa.valor_material_cliente_m3 || 0);
      setMaquinaId('');
      setValorPorHora(0);
      setValorPorDia(0);
      setValorPorMes(0);
    } else {
      setOrigen('');
      setDestino('');
      setValorFlete(0);
      setTipoMaterial('');
      setValorMaterial(0);
      setValorMaterialCliente(0);
      setMaquinaId(tarifa.maquina_id || '');
      setValorPorHora(tarifa.valor_por_hora || 0);
      setValorPorDia(tarifa.valor_por_dia || 0);
      setValorPorMes(tarifa.valor_por_mes || 0);
    }
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

  // Utilidades visuales
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

  // Porcentaje margen material
  const calcularMargen = (tarifa: TarifaCliente) => {
    if (!tarifa.valor_material_m3 || !tarifa.valor_material_cliente_m3) return null;
    const margen = tarifa.valor_material_cliente_m3 - tarifa.valor_material_m3;
    const porcentaje = ((margen / tarifa.valor_material_m3) * 100).toFixed(1);
    return { margen, porcentaje };
  };

  if (!user || user.role !== 'Administrador') return null;

  return (
    <div className="container mx-auto py-8 px-4 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Tarifas por Cliente
            </h1>
            <p className="text-lg text-slate-600">
              Gestiona las tarifas especiales de transporte y alquiler
            </p>
          </div>
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

      {/* Estadísticas */}
      <TarifasClienteStats
        totalTarifas={tarifas.length}
        totalClientes={new Set(tarifas.map(t => t.cliente)).size}
        promedioAlquilerHora={
          (() => {
            const alquileres = tarifas.filter(t => t.tipo_servicio === 'alquiler_maquina' && t.valor_por_hora);
            return alquileres.length > 0
              ? formatCurrency(alquileres.reduce((sum, t) => sum + (t.valor_por_hora || 0), 0) / alquileres.length)
              : '$0';
          })()
        }
      />

      {/* Card principal */}
      <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-slate-800">Gestión de Tarifas</CardTitle>
              <CardDescription className="text-base text-slate-600">
                Administra tarifas personalizadas para ambos servicios
              </CardDescription>
            </div>
            <Dialog open={showDialog} onOpenChange={(open) => {
              setShowDialog(open);
              if (!open) {
                setEditingTarifa(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Plus className="mr-2 h-5 w-5" />
                  Agregar Tarifa
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] bg-white shadow-2xl border-0">
                <DialogHeader className="text-center space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    {tipoServicio === 'transporte'
                      ? <Truck className="h-8 w-8 text-white" />
                      : <Settings className="h-8 w-8 text-white" />}
                  </div>
                  <div className="space-y-2">
                    <DialogTitle className="text-2xl font-bold text-slate-800">
                      {editingTarifa ? 'Editar Tarifa' : 'Agregar Nueva Tarifa'}
                    </DialogTitle>
                    <DialogDescription className="text-base text-slate-600">
                      {tipoServicio === 'transporte'
                        ? 'Define una tarifa especial para flete y material'
                        : 'Define una tarifa especial para alquiler de maquinaria'}
                    </DialogDescription>
                  </div>
                </DialogHeader>

                {/* Selector tipo de servicio */}
                <div className="mb-4">
                  <label className="font-semibold text-slate-700">Tipo de Servicio *</label>
                  <select
                    value={tipoServicio}
                    onChange={e => setTipoServicio(e.target.value as any)}
                    className="w-full p-2 border rounded-md mt-1"
                    disabled={!!editingTarifa}
                  >
                    <option value="transporte">Transporte (flete/material)</option>
                    <option value="alquiler_maquina">Alquiler de Maquinaria</option>
                  </select>
                </div>
                <ClienteFincaSelector
                  selectedCliente={cliente}
                  selectedFinca={finca}
                  onClienteChange={handleClienteChange}
                  onFincaChange={handleFincaChange}
                />
                {tipoServicio === 'transporte' ? (
                  <TarifaTransporteForm
                    origen={origen}
                    destino={destino}
                    valorFlete={valorFlete}
                    tipoMaterial={tipoMaterial}
                    valorMaterial={valorMaterial}
                    valorMaterialCliente={valorMaterialCliente}
                    proveedores={proveedores}
                    materiales={materiales}
                    cliente={cliente}
                    clienteTieneFincas={!!finca}
                    onOrigenChange={setOrigen}
                    onDestinoChange={setDestino}
                    onValorFleteChange={setValorFlete}
                    onMaterialChange={handleMaterialChange}
                    onValorMaterialClienteChange={setValorMaterialCliente}
                  />
                ) : (
                  <TarifaAlquilerForm
                    maquinaId={maquinaId}
                    valorPorHora={valorPorHora}
                    valorPorDia={valorPorDia}
                    valorPorMes={valorPorMes}
                    machines={machines}
                    onMaquinaChange={setMaquinaId}
                    onValorPorHoraChange={setValorPorHora}
                    onValorPorDiaChange={setValorPorDia}
                    onValorPorMesChange={setValorPorMes}
                  />
                )}
                <div>
                  <label className="font-semibold text-slate-700">Observaciones</label>
                  <Input
                    value={observaciones}
                    onChange={e => setObservaciones(e.target.value)}
                    placeholder="Observaciones adicionales"
                  />
                </div>
                <div className="flex gap-3 pt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingTarifa(null);
                      resetForm();
                      setShowDialog(false);
                    }}
                    className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    {editingTarifa ? 'Actualizar Tarifa' : 'Guardar Tarifa'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Buscar por cliente, máquina, destino..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-slate-300 focus:border-blue-500 bg-white"
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
              <div className="mx-auto w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center">
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
