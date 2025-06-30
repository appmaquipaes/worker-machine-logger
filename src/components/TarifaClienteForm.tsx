import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  createTarifaTransporte,
  createTarifaAlquiler,
  createTarifaEscombrera,
  TarifaCliente 
} from '@/models/TarifasCliente';
import { loadProveedores } from '@/models/Proveedores';
import { loadMateriales } from '@/models/Materiales';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { useMachine } from '@/context/MachineContext';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import TarifaTransporteForm from '@/components/TarifaTransporteForm';
import TarifaAlquilerForm from '@/components/TarifaAlquilerForm';
import TarifaEscombreraForm from '@/components/TarifaEscombreraForm';
import { Truck, Settings, MapPin } from 'lucide-react';

interface TarifaClienteFormProps {
  initialData?: TarifaCliente | null;
  onTarifaCreated: (tarifa: TarifaCliente) => void;
  onCancel: () => void;
}

const TarifaClienteForm: React.FC<TarifaClienteFormProps> = ({
  initialData,
  onTarifaCreated,
  onCancel
}) => {
  const { machines } = useMachine();
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  
  // Estados del formulario
  const [tipoServicio, setTipoServicio] = useState<'transporte' | 'alquiler_maquina' | 'recepcion_escombrera'>('transporte');
  const [cliente, setCliente] = useState('');
  const [finca, setFinca] = useState('');
  
  // Estados para transporte
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [valorFlete, setValorFlete] = useState<number>(0);
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [valorMaterial, setValorMaterial] = useState<number>(0);
  const [valorMaterialCliente, setValorMaterialCliente] = useState<number>(0);
  
  // Estados para alquiler de maquinaria
  const [maquinaId, setMaquinaId] = useState('');
  const [valorPorHora, setValorPorHora] = useState<number>(0);
  const [valorPorDia, setValorPorDia] = useState<number>(0);
  const [valorPorMes, setValorPorMes] = useState<number>(0);
  
  // Estados para escombrera
  const [escombreraId, setEscombreraId] = useState('');
  const [valorVolquetaSencilla, setValorVolquetaSencilla] = useState<number>(0);
  const [valorVolquetaDobletroque, setValorVolquetaDobletroque] = useState<number>(0);
  
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    setProveedores(loadProveedores());
    setMateriales(loadMateriales());
    setClientes(loadClientes());
  }, []);

  useEffect(() => {
    if (initialData) {
      setTipoServicio(initialData.tipo_servicio);
      setCliente(initialData.cliente);
      setFinca(initialData.finca || '');
      setObservaciones(initialData.observaciones || '');
      
      if (initialData.tipo_servicio === 'transporte') {
        setOrigen(initialData.origen || '');
        setDestino(initialData.destino || '');
        setValorFlete(initialData.valor_flete_m3 || 0);
        setTipoMaterial(initialData.tipo_material || '');
        setValorMaterial(initialData.valor_material_m3 || 0);
        setValorMaterialCliente(initialData.valor_material_cliente_m3 || 0);
      } else if (initialData.tipo_servicio === 'alquiler_maquina') {
        setMaquinaId(initialData.maquina_id || '');
        setValorPorHora(initialData.valor_por_hora || 0);
        setValorPorDia(initialData.valor_por_dia || 0);
        setValorPorMes(initialData.valor_por_mes || 0);
      } else if (initialData.tipo_servicio === 'recepcion_escombrera') {
        setEscombreraId(initialData.escombrera_id || '');
        setValorVolquetaSencilla(initialData.valor_volqueta_sencilla || 0);
        setValorVolquetaDobletroque(initialData.valor_volqueta_doble_troque || 0);
      }
    } else {
      resetForm();
    }
  }, [initialData]);

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
    setEscombreraId('');
    setValorVolquetaSencilla(0);
    setValorVolquetaDobletroque(0);
    setObservaciones('');
  };

  const handleClienteChange = (nuevoCliente: string) => {
    console.log('🔍 Cliente seleccionado:', nuevoCliente);
    setCliente(nuevoCliente);
    setFinca('');
    
    if (nuevoCliente) {
      // Buscar el cliente por nombre para obtener su ID  
      const clienteData = clientes.find(c => 
        (c.nombre_cliente === nuevoCliente || c.nombre === nuevoCliente) && c.activo
      );
      
      console.log('📋 Cliente encontrado:', clienteData);
      
      if (clienteData) {
        const fincasDelCliente = getFincasByCliente(clienteData.id);
        console.log('🏢 Fincas del cliente:', fincasDelCliente);
        
        if (tipoServicio === 'transporte') {
          if (fincasDelCliente.length === 0) {
            setDestino(nuevoCliente);
          } else {
            setDestino('');
          }
        }
      } else {
        console.log('⚠️ Cliente no encontrado en la lista');
      }
    } else {
      setDestino('');
    }
  };

  const handleFincaChange = (nuevaFinca: string) => {
    console.log('🏢 Finca seleccionada:', nuevaFinca);
    setFinca(nuevaFinca);
    
    if (tipoServicio === 'transporte') {
      if (nuevaFinca) {
        setDestino(nuevaFinca);
      } else if (cliente) {
        const clienteData = clientes.find(c => 
          (c.nombre_cliente === cliente || c.nombre === cliente) && c.activo
        );
        if (clienteData) {
          const fincasDelCliente = getFincasByCliente(clienteData.id);
          if (fincasDelCliente.length === 0) {
            setDestino(cliente);
          } else {
            setDestino('');
          }
        }
      }
    }
  };

  const handleMaterialChange = (materialId: string) => {
    setTipoMaterial(materialId);
    
    if (materialId) {
      // Buscar el producto del proveedor
      const productosProveedores = require('@/models/Proveedores').loadProductosProveedores();
      const producto = productosProveedores.find((p: any) => p.id === materialId);
      
      if (producto) {
        setValorMaterial(producto.precio_unitario);
        setValorMaterialCliente(producto.precio_unitario);
      } else {
        // Fallback a material general si no se encuentra el producto
        const material = materiales.find(m => m.id === materialId);
        if (material) {
          setValorMaterial(material.valor_por_m3);
          setValorMaterialCliente(material.valor_por_m3);
        }
      }
    } else {
      setValorMaterial(0);
      setValorMaterialCliente(0);
    }
  };

  const handleSubmit = () => {
    if (!cliente) {
      toast.error('Debe seleccionar un cliente');
      return;
    }

    let nuevaTarifa: TarifaCliente;

    if (tipoServicio === 'transporte') {
      if (!origen || !destino || valorFlete <= 0) {
        toast.error('Complete todos los campos obligatorios para el servicio de transporte');
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
    } else if (tipoServicio === 'alquiler_maquina') {
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
    } else {
      // recepcion_escombrera
      if (!escombreraId || valorVolquetaSencilla <= 0 || valorVolquetaDobletroque <= 0) {
        toast.error('Debe seleccionar una escombrera y definir los valores para ambos tipos de volqueta');
        return;
      }

      nuevaTarifa = createTarifaEscombrera(
        cliente,
        finca || undefined,
        escombreraId,
        valorVolquetaSencilla,
        valorVolquetaDobletroque,
        observaciones || undefined
      );
    }

    onTarifaCreated(nuevaTarifa);
    if (!initialData) {
      resetForm();
    }
  };

  // Determinar si el cliente tiene fincas - CORREGIDO
  const clienteData = cliente ? clientes.find(c => 
    (c.nombre_cliente === cliente || c.nombre === cliente) && c.activo
  ) : null;
  
  const fincasDisponibles = clienteData ? getFincasByCliente(clienteData.id) : [];
  const clienteTieneFincas = fincasDisponibles.length > 0;

  console.log('🔍 Debug info:', {
    cliente,
    clienteData: clienteData ? { id: clienteData.id, nombre: clienteData.nombre_cliente } : null,
    fincasDisponibles: fincasDisponibles.length,
    clienteTieneFincas
  });

  const getServiceIcon = (tipo: string) => {
    switch (tipo) {
      case 'transporte': return <Truck className="h-5 w-5" />;
      case 'alquiler_maquina': return <Settings className="h-5 w-5" />;
      case 'recepcion_escombrera': return <MapPin className="h-5 w-5" />;
      default: return null;
    }
  };

  const getServiceLabel = (tipo: string) => {
    switch (tipo) {
      case 'transporte': return 'Servicio de Transporte';
      case 'alquiler_maquina': return 'Alquiler de Maquinaria';
      case 'recepcion_escombrera': return 'Recepción Escombrera';
      default: return tipo;
    }
  };

  return (
    <div className="space-y-8">
      {/* Service Type Selection */}
      <div className="space-y-4">
        <Label htmlFor="tipo-servicio" className="text-lg font-bold text-slate-700">
          Tipo de Servicio *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['transporte', 'alquiler_maquina', 'recepcion_escombrera'].map((tipo) => (
            <button
              key={tipo}
              type="button"
              onClick={() => setTipoServicio(tipo as any)}
              className={`p-6 rounded-xl border-2 transition-all duration-300 flex items-center gap-4 ${
                tipoServicio === tipo
                  ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div className={`p-3 rounded-lg ${
                tipoServicio === tipo ? 'bg-blue-100' : 'bg-slate-100'
              }`}>
                {getServiceIcon(tipo)}
              </div>
              <div className="text-left">
                <p className={`font-bold text-base ${
                  tipoServicio === tipo ? 'text-blue-700' : 'text-slate-700'
                }`}>
                  {getServiceLabel(tipo)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Client and Farm Selection */}
      <div className="bg-slate-50 p-6 rounded-xl">
        <ClienteFincaSelector
          selectedCliente={cliente}
          selectedFinca={finca}
          onClienteChange={handleClienteChange}
          onFincaChange={handleFincaChange}
        />
      </div>

      {/* Service-specific forms */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
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
            clienteTieneFincas={clienteTieneFincas}
            onOrigenChange={setOrigen}
            onDestinoChange={setDestino}
            onValorFleteChange={setValorFlete}
            onMaterialChange={handleMaterialChange}
            onValorMaterialClienteChange={setValorMaterialCliente}
          />
        ) : tipoServicio === 'alquiler_maquina' ? (
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
        ) : (
          <TarifaEscombreraForm
            escombreraId={escombreraId}
            valorVolquetaSencilla={valorVolquetaSencilla}
            valorVolquetaDobletroque={valorVolquetaDobletroque}
            onEscombreraChange={setEscombreraId}
            onValorSencillaChange={setValorVolquetaSencilla}
            onValorDobletroqueChange={setValorVolquetaDobletroque}
          />
        )}
      </div>
      
      {/* Observations */}
      <div className="space-y-3">
        <Label htmlFor="observaciones" className="text-lg font-bold text-slate-700">
          Observaciones
        </Label>
        <Textarea
          id="observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Observaciones adicionales sobre esta tarifa..."
          className="min-h-[120px] text-base border-2 border-slate-300 focus:border-blue-500 rounded-lg"
        />
      </div>
      
      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t-2 border-slate-100">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="h-14 px-8 text-lg font-semibold border-2 border-slate-300 hover:border-slate-400 rounded-xl"
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleSubmit}
          className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {initialData ? 'Actualizar Tarifa' : 'Crear Tarifa'}
        </Button>
      </div>
    </div>
  );
};

export default TarifaClienteForm;
