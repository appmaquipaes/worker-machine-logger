
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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
        <Label htmlFor="tipo-material">Tipo de Material</Label>
        <select
          id="tipo-material"
          value={tipoMaterial}
          onChange={(e) => onMaterialChange(e.target.value)}
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
              onChange={(e) => onValorMaterialClienteChange(parseFloat(e.target.value) || 0)}
              placeholder="Valor que se le cobra al cliente"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TarifaTransporteForm;
