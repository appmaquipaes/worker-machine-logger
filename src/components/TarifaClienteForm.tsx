import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  createTarifaCliente, 
  TarifaCliente 
} from '@/models/TarifasCliente';
import { loadProveedores } from '@/models/Proveedores';
import { loadMateriales } from '@/models/Materiales';
import { loadClientes, getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';
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
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  
  // Estados del formulario
  const [cliente, setCliente] = useState('');
  const [finca, setFinca] = useState('');
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [valorFlete, setValorFlete] = useState<number>(0);
  const [tipoMaterial, setTipoMaterial] = useState('');
  const [valorMaterial, setValorMaterial] = useState<number>(0);
  const [valorMaterialCliente, setValorMaterialCliente] = useState<number>(0);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    setProveedores(loadProveedores());
    setMateriales(loadMateriales());
  }, []);

  // Cargar datos iniciales si se está editando
  useEffect(() => {
    if (initialData) {
      setCliente(initialData.cliente);
      setFinca(initialData.finca || '');
      setOrigen(initialData.origen);
      setDestino(initialData.destino);
      setValorFlete(initialData.valor_flete_m3);
      setTipoMaterial(initialData.tipo_material || '');
      setValorMaterial(initialData.valor_material_m3 || 0);
      setValorMaterialCliente(initialData.valor_material_cliente_m3 || 0);
      setObservaciones(initialData.observaciones || '');
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setCliente('');
    setFinca('');
    setOrigen('');
    setDestino('');
    setValorFlete(0);
    setTipoMaterial('');
    setValorMaterial(0);
    setValorMaterialCliente(0);
    setObservaciones('');
  };

  const handleClienteChange = (nuevoCliente: string) => {
    setCliente(nuevoCliente);
    setFinca('');
    
    // Verificar si el cliente tiene fincas
    if (nuevoCliente) {
      const clienteData = getClienteByName(nuevoCliente);
      if (clienteData) {
        const fincas = getFincasByCliente(clienteData.id);
        if (fincas.length === 0) {
          // Si no tiene fincas, usar el nombre del cliente como destino
          setDestino(nuevoCliente);
        } else {
          // Si tiene fincas, limpiar el destino para que se seleccione una finca
          setDestino('');
        }
      }
    } else {
      setDestino('');
    }
  };

  const handleFincaChange = (nuevaFinca: string) => {
    setFinca(nuevaFinca);
    // Si se selecciona una finca, usar su nombre como destino
    if (nuevaFinca) {
      setDestino(nuevaFinca);
    } else if (cliente) {
      // Si se deselecciona la finca pero hay cliente, verificar si tiene fincas
      const clienteData = getClienteByName(cliente);
      if (clienteData) {
        const fincas = getFincasByCliente(clienteData.id);
        if (fincas.length === 0) {
          // Si no tiene fincas, usar el nombre del cliente
          setDestino(cliente);
        } else {
          // Si tiene fincas, limpiar el destino
          setDestino('');
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
        // Sugerir un valor inicial para el cliente (puede ser el mismo o con margen)
        setValorMaterialCliente(material.valor_por_m3);
      }
    } else {
      setValorMaterial(0);
      setValorMaterialCliente(0);
    }
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
      valorMaterialCliente > 0 ? valorMaterialCliente : undefined,
      observaciones || undefined,
      tipoMaterial || undefined
    );

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
      <ClienteFincaSelector
        selectedCliente={cliente}
        selectedFinca={finca}
        onClienteChange={handleClienteChange}
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
          {cliente && !clienteTieneFincas && (
            <p className="text-xs text-muted-foreground mt-1">
              Este cliente no tiene fincas registradas, se usa el nombre del cliente como destino.
            </p>
          )}
          {cliente && clienteTieneFincas && (
            <p className="text-xs text-muted-foreground mt-1">
              El destino se establece automáticamente según la finca seleccionada.
            </p>
          )}
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

      <div className="grid grid-cols-1 gap-4">
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
            <p className="text-xs text-muted-foreground mt-1">
              Valor de referencia del material
            </p>
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
            <p className="text-xs text-muted-foreground mt-1">
              Valor con margen de ganancia para el cliente
            </p>
          </div>
        </div>
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
