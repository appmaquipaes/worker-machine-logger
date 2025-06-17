
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
import { getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { useMachine } from '@/context/MachineContext';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';
import TarifaTransporteForm from '@/components/TarifaTransporteForm';
import TarifaAlquilerForm from '@/components/TarifaAlquilerForm';
import TarifaEscombreraForm from '@/components/TarifaEscombreraForm';

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
    setCliente(nuevoCliente);
    setFinca('');
    
    if (tipoServicio === 'transporte' && nuevoCliente) {
      const clienteData = getClienteByName(nuevoCliente);
      if (clienteData) {
        const fincas = getFincasByCliente(clienteData.id);
        if (fincas.length === 0) {
          setDestino(nuevoCliente);
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
      if (nuevaFinca) {
        setDestino(nuevaFinca);
      } else if (cliente) {
        const clienteData = getClienteByName(cliente);
        if (clienteData) {
          const fincas = getFincasByCliente(clienteData.id);
          if (fincas.length === 0) {
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

  // Determinar si el cliente tiene fincas
  const clienteData = cliente ? getClienteByName(cliente) : null;
  const fincasDisponibles = clienteData ? getFincasByCliente(clienteData.id) : [];
  const clienteTieneFincas = fincasDisponibles.length > 0;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="tipo-servicio">Tipo de Servicio *</Label>
        <select
          id="tipo-servicio"
          value={tipoServicio}
          onChange={(e) => setTipoServicio(e.target.value as 'transporte' | 'alquiler_maquina' | 'recepcion_escombrera')}
          className="w-full p-2 border rounded-md"
        >
          <option value="transporte">Servicio de Transporte</option>
          <option value="alquiler_maquina">Alquiler de Maquinaria</option>
          <option value="recepcion_escombrera">Recepción Escombrera</option>
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
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          {initialData ? 'Actualizar Tarifa' : 'Crear Tarifa'}
        </Button>
      </div>
    </div>
  );
};

export default TarifaClienteForm;
