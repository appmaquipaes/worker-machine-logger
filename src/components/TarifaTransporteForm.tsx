
import React, { useMemo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { loadProductos } from '@/models/Proveedores';

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
  // Obtener materiales del proveedor seleccionado
  const materialesDelProveedor = useMemo(() => {
    if (!origen) return [];
    
    const proveedorSeleccionado = proveedores.find(prov => 
      `${prov.nombre} - ${prov.ciudad}` === origen
    );
    
    if (!proveedorSeleccionado) return materiales;
    
    // Obtener productos del proveedor
    const productos = loadProductos();
    const productosDelProveedor = productos.filter(prod => 
      prod.proveedor_id === proveedorSeleccionado.id
    );
    
    // Filtrar materiales que coincidan con los productos del proveedor
    return materiales.filter(material => 
      productosDelProveedor.some(producto => 
        producto.nombre.toLowerCase().includes(material.nombre_material.toLowerCase()) ||
        material.nombre_material.toLowerCase().includes(producto.nombre.toLowerCase())
      )
    );
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

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="origen" className="text-sm font-medium text-slate-700">Origen *</Label>
          <Select value={origen} onValueChange={onOrigenChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar origen" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {proveedores.map((prov) => (
                <SelectItem key={prov.id} value={`${prov.nombre} - ${prov.ciudad}`}>
                  {prov.nombre} - {prov.ciudad}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="destino" className="text-sm font-medium text-slate-700">Destino/Punto de Entrega *</Label>
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
      
      <div className="space-y-2">
        <Label htmlFor="valor-flete" className="text-sm font-medium text-slate-700">Valor Flete por m³ *</Label>
        <Input
          id="valor-flete"
          type="number"
          placeholder="Ej: 15000"
          value={valorFlete === 0 ? '' : valorFlete}
          onChange={(e) => onValorFleteChange(parseFloat(e.target.value) || 0)}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo-material" className="text-sm font-medium text-slate-700">
          Tipo de Material
          {origen && (
            <span className="text-xs text-slate-500 ml-2">
              (Materiales disponibles del proveedor seleccionado)
            </span>
          )}
        </Label>
        <Select value={tipoMaterial} onValueChange={onMaterialChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={origen ? "Seleccionar material del proveedor" : "Primero seleccione un origen"} />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {materialesDelProveedor.length > 0 ? (
              materialesDelProveedor.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.nombre_material}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="" disabled>
                {origen ? "No hay materiales disponibles para este proveedor" : "Seleccione primero un origen"}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      {tipoMaterial && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="valor-material" className="text-sm font-medium text-slate-700">Valor Material por m³ (Referencia)</Label>
            <Input
              id="valor-material"
              type="number"
              value={valorMaterial === 0 ? '' : valorMaterial}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valor-material-cliente" className="text-sm font-medium text-slate-700">Valor Material Cliente por m³ *</Label>
            <Input
              id="valor-material-cliente"
              type="number"
              placeholder="Ej: 25000"
              value={valorMaterialCliente === 0 ? '' : valorMaterialCliente}
              onChange={(e) => onValorMaterialClienteChange(parseFloat(e.target.value) || 0)}
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TarifaTransporteForm;
