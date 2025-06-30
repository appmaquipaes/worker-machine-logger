
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  createTarifaTransporte,
  createTarifaAlquiler,
  createTarifaEscombrera,
  TarifaCliente 
} from '@/models/TarifasCliente';
import { loadProveedores } from '@/models/Proveedores';
import { loadMateriales } from '@/models/Materiales';
import { loadClientes } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { useMachine } from '@/context/MachineContext';

export const useTarifaForm = (
  initialData?: TarifaCliente | null,
  onTarifaCreated?: (tarifa: TarifaCliente) => void
) => {
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
    console.log('📂 Cargando datos iniciales...');
    setProveedores(loadProveedores());
    setMateriales(loadMateriales());
    const clientesData = loadClientes();
    console.log('👥 Clientes cargados:', clientesData);
    setClientes(clientesData);
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
    console.log('🔍 Cliente seleccionado en TarifaForm:', nuevoCliente);
    setCliente(nuevoCliente);
    setFinca('');
    
    if (nuevoCliente && tipoServicio === 'transporte') {
      const clienteData = clientes.find(c => 
        c.nombre_cliente === nuevoCliente && c.activo !== false
      );
      
      console.log('📋 Cliente encontrado:', clienteData);
      
      if (clienteData) {
        const fincasDelCliente = getFincasByCliente(clienteData.id);
        console.log('🏢 Fincas del cliente:', fincasDelCliente);
        
        if (fincasDelCliente.length === 0) {
          setDestino(nuevoCliente);
        } else {
          setDestino('');
        }
      } else {
        console.log('⚠️ Cliente no encontrado en la lista');
        setDestino('');
      }
    }
  };

  const handleFincaChange = (nuevaFinca: string) => {
    console.log('🏢 Finca seleccionada en TarifaForm:', nuevaFinca);
    setFinca(nuevaFinca);
    
    if (tipoServicio === 'transporte') {
      if (nuevaFinca) {
        setDestino(nuevaFinca);
      } else if (cliente) {
        const clienteData = clientes.find(c => 
          c.nombre_cliente === cliente && c.activo !== false
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
      const productosProveedores = require('@/models/Proveedores').loadProductosProveedores();
      const producto = productosProveedores.find((p: any) => p.id === materialId);
      
      if (producto) {
        setValorMaterial(producto.precio_unitario);
        setValorMaterialCliente(producto.precio_unitario);
      } else {
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

    if (onTarifaCreated) {
      onTarifaCreated(nuevaTarifa);
    }
    
    if (!initialData) {
      resetForm();
    }
  };

  // Determinar si el cliente tiene fincas
  const clienteData = cliente ? clientes.find(c => 
    c.nombre_cliente === cliente && c.activo !== false
  ) : null;
  
  const fincasDisponibles = clienteData ? getFincasByCliente(clienteData.id) : [];
  const clienteTieneFincas = fincasDisponibles.length > 0;

  return {
    // Data
    proveedores,
    materiales,
    clientes,
    machines,
    
    // Form state
    tipoServicio,
    cliente,
    finca,
    origen,
    destino,
    valorFlete,
    tipoMaterial,
    valorMaterial,
    valorMaterialCliente,
    maquinaId,
    valorPorHora,
    valorPorDia,
    valorPorMes,
    escombreraId,
    valorVolquetaSencilla,
    valorVolquetaDobletroque,
    observaciones,
    clienteTieneFincas,
    
    // Setters
    setTipoServicio,
    setOrigen,
    setDestino,
    setValorFlete,
    setValorMaterialCliente,
    setMaquinaId,
    setValorPorHora,
    setValorPorDia,
    setValorPorMes,
    setEscombreraId,
    setValorVolquetaSencilla,
    setValorVolquetaDobletroque,
    setObservaciones,
    
    // Handlers
    handleClienteChange,
    handleFincaChange,
    handleMaterialChange,
    handleSubmit
  };
};
