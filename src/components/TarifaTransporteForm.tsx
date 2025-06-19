
import React, { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { loadProductosProveedores } from '@/models/Proveedores';

interface TarifaTransporteFormProps {
  origen: string;
  destino: string;
  valorFlete: number;
  tipoMaterial: string;
  valorMaterial: number;
  valorMaterialCliente: number;
  proveedores: any[];
  materiales: any[];
  cliente: string;
  clienteTieneFincas: boolean;
  onOrigenChange: (value: string) => void;
  onDestinoChange: (value: string) => void;
  onValorFleteChange: (value: number) => void;
  onMaterialChange: (value: string) => void;
  onValorMaterialClienteChange: (value: number) => void;
}

const TarifaTransporteForm: React.FC<TarifaTransporteFormProps> = ({
  origen,
  destino,
  valorFlete,
  tipoMaterial,
  valorMaterial,
  valorMaterialCliente,
  proveedores,
  materiales,
  cliente,
  clienteTieneFincas,
  onOrigenChange,
  onDestinoChange,
  onValorFleteChange,
  onMaterialChange,
  onValorMaterialClienteChange
}) => {
  const [materialesProveedor, setMaterialesProveedor] = useState<any[]>([]);

  useEffect(() => {
    if (origen) {
      // Buscar el proveedor seleccionado
      const proveedorSeleccionado = proveedores.find(prov => 
        `${prov.nombre} - ${prov.ciudad}` === origen
      );
      
      if (proveedorSeleccionado) {
        // Cargar productos del proveedor
        const productosProveedores = loadProductosProveedores();
        const materialesDelProveedor = productosProveedores.filter(
          producto => producto.proveedor_id === proveedorSeleccionado.id && 
          producto.tipo_insumo === 'Material'
        );
        setMaterialesProveedor(materialesDelProveedor);
        console.log('Materiales encontrados para proveedor:', materialesDelProveedor);
      } else {
        setMaterialesProveedor([]);
      }
    } else {
      // Si no hay origen seleccionado, usar la lista general de materiales
      setMaterialesProveedor(materiales);
    }
  }, [origen, proveedores, materiales]);

  const getDestinoPlaceholder = () => {
    if (!cliente) {
      return "Seleccione primero un cliente";
    }
    if (clienteTieneFincas) {
      return "Se asigna automáticamente según la finca seleccionada";
    }
    return "Se asigna automáticamente con el nombre del cliente";
  };

  const isDestinoDisabled = !cliente || clienteTieneFincas;

  const formatPrice = (price: number | undefined) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '0';
    }
    return price.toLocaleString();
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="origen">Origen *</Label>
          <select
            id="origen"
            value={origen}
            onChange={(e) => onOrigenChange(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Seleccionar origen</option>
            {proveedores.map((prov) => (
              <option key={prov.id} value={`${prov.nombre} - ${prov.ciudad}`}>
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
            onChange={(e) => onDestinoChange(e.target.value)}
            placeholder={getDestinoPlaceholder()}
            disabled={isDestinoDisabled}
            className={isDestinoDisabled ? "bg-gray-50" : ""}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="valor-flete">Valor Flete por m³ *</Label>
        <Input
          id="valor-flete"
          type="number"
          value={valorFlete}
          onChange={(e) => onValorFleteChange(parseFloat(e.target.value) || 0)}
          placeholder="Valor del flete por metro cúbico"
        />
      </div>

      <div>
        <Label htmlFor="tipo-material">
          Material/Producto 
          {origen && materialesProveedor.length === 0 && (
            <span className="text-sm text-orange-600 ml-2">
              (No hay materiales registrados para este proveedor)
            </span>
          )}
        </Label>
        <select
          id="tipo-material"
          value={tipoMaterial}
          onChange={(e) => onMaterialChange(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Seleccionar material</option>
          {materialesProveedor.map((material) => (
            <option key={material.id} value={material.id}>
              {material.nombre_producto} - {material.unidad} (${formatPrice(material.precio_unitario)})
            </option>
          ))}
        </select>
        {origen && materialesProveedor.length === 0 && (
          <p className="text-sm text-orange-600 mt-1">
            Debes agregar productos/materiales a este proveedor en la sección de Gestión de Proveedores.
          </p>
        )}
      </div>

      {tipoMaterial && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="valor-material">Precio Proveedor por {
              materialesProveedor.find(m => m.id === tipoMaterial)?.unidad || 'unidad'
            }</Label>
            <Input
              id="valor-material"
              type="number"
              value={valorMaterial}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div>
            <Label htmlFor="valor-material-cliente">Precio Cliente por {
              materialesProveedor.find(m => m.id === tipoMaterial)?.unidad || 'unidad'
            } *</Label>
            <Input
              id="valor-material-cliente"
              type="number"
              value={valorMaterialCliente}
              onChange={(e) => onValorMaterialClienteChange(parseFloat(e.target.value) || 0)}
              placeholder="Precio que se le cobra al cliente"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TarifaTransporteForm;
