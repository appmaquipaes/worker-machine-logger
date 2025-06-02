
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  createTarifaTransporte,
  createTarifaAlquiler,
  TarifaCliente 
} from '@/models/TarifasCliente';
import { loadProveedores } from '@/models/Proveedores';
import { loadMateriales } from '@/models/Materiales';
import { getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
import { useMachine } from '@/context/MachineContext';
import ClienteFincaSelector from '@/components/ClienteFincaSelector';

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
  const [tipoServicio, setTipoServicio] = useState<'transporte' | 'alquiler_maquina'>('transporte');
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
  
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    setProveedores(loadProveedores());
    setMateriales(loadMateriales());
  }, []);

  // Cargar datos iniciales si se está editando
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
      } else {
        setMaquinaId(initialData.maquina_id || '');
        setValorPorHora(initialData.valor_por_hora || 0);
        setValorPorDia(initialData.valor_por_dia || 0);
        setValorPorMes(initialData.valor_por_mes || 0);
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
          onChange={(e) => setTipoServicio(e.target.value as 'transporte' | 'alquiler_maquina')}
          className="w-full p-2 border rounded-md"
        >
          <option value="transporte">Servicio de Transporte</option>
          <option value="alquiler_maquina">Alquiler de Maquinaria</option>
        </select>
      </div>

      <ClienteFincaSelector
        selectedCliente={cliente}
        selectedFinca={finca}
        onClienteChange={handleClienteChange}
        onFincaChange={handleFincaChange}
      />

      {tipoServicio === 'transporte' && (
        <>
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
                onChange={(e) => setDestino(e.target.value)}
                placeholder={
                  !cliente 
                    ? "Seleccione primero un cliente" 
                    : clienteTieneFincas 
                      ? "Se asigna automáticamente según la finca seleccionada"
                      : "Se asigna automáticamente con el nombre del cliente"
                }
                disabled={clienteTieneFincas}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="valor-flete">Valor Flete por m³ *</Label>
            <Input
              id="valor-flete"
              type="number"
              value={valorFlete}
              onChange={(e) => setValorFlete(parseFloat(e.target.value) || 0)}
              placeholder="Valor del flete por metro cúbico"
            />
          </div>

          <div>
            <Label htmlFor="tipo-material">Tipo de Material</Label>
            <select
              id="tipo-material"
              value={tipoMaterial}
              onChange={(e) => handleMaterialChange(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccionar material</option>
              {materiales.map((material) => (
                <option key={material.id} value={material.id}>
                  {material.nombre_material}
                </option>
              ))}
            </select>
          </div>

          {tipoMaterial && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valor-material">Valor Material por m³ (Referencia)</Label>
                <Input
                  id="valor-material"
                  type="number"
                  value={valorMaterial}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
              <div>
                <Label htmlFor="valor-material-cliente">Valor Material Cliente por m³ *</Label>
                <Input
                  id="valor-material-cliente"
                  type="number"
                  value={valorMaterialCliente}
                  onChange={(e) => setValorMaterialCliente(parseFloat(e.target.value) || 0)}
                  placeholder="Valor que se le cobra al cliente"
                />
              </div>
            </div>
          )}
        </>
      )}

      {tipoServicio === 'alquiler_maquina' && (
        <>
          <div>
            <Label htmlFor="maquina">Máquina *</Label>
            <select
              id="maquina"
              value={maquinaId}
              onChange={(e) => setMaquinaId(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccionar máquina</option>
              {machines.map((machine) => (
                <option key={machine.id} value={machine.id}>
                  {machine.name} ({machine.type}) - {machine.plate}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="valor-hora">Valor por Hora</Label>
              <Input
                id="valor-hora"
                type="number"
                value={valorPorHora}
                onChange={(e) => setValorPorHora(parseFloat(e.target.value) || 0)}
                placeholder="Valor por hora"
              />
            </div>
            
            <div>
              <Label htmlFor="valor-dia">Valor por Día</Label>
              <Input
                id="valor-dia"
                type="number"
                value={valorPorDia}
                onChange={(e) => setValorPorDia(parseFloat(e.target.value) || 0)}
                placeholder="Valor por día"
              />
            </div>
            
            <div>
              <Label htmlFor="valor-mes">Valor por Mes</Label>
              <Input
                id="valor-mes"
                type="number"
                value={valorPorMes}
                onChange={(e) => setValorPorMes(parseFloat(e.target.value) || 0)}
                placeholder="Valor por mes"
              />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            * Defina al menos uno de los valores de alquiler (hora, día o mes)
          </p>
        </>
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
