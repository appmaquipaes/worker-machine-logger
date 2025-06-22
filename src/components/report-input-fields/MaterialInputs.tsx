
import React, { useState, useEffect } from 'react';
import { Truck, Wrench, AlertTriangle, Info } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Machine } from '@/context/MachineContext';
import { useMachineSpecificReports } from '@/hooks/useMachineSpecificReports';
import { ReportType } from '@/types/report';
import { loadInventarioAcopio } from '@/models/InventarioAcopio';
import { loadProductosProveedores } from '@/models/Proveedores';
import { esAcopio } from '@/utils/inventarioDetection';
import { extraerInfoProveedor } from '@/utils/proveedorUtils';

interface MaterialInputsProps {
  reportType: ReportType;
  origin: string;
  tipoMateria: string;
  setTipoMateria: (value: string) => void;
  cantidadM3?: number;
  setCantidadM3: (value: number | undefined) => void;
  tiposMaterial: string[];
  inventarioAcopio: any[];
  selectedMachine?: Machine;
}

const MaterialInputs: React.FC<MaterialInputsProps> = ({
  reportType,
  origin,
  tipoMateria,
  setTipoMateria,
  cantidadM3,
  setCantidadM3,
  tiposMaterial,
  inventarioAcopio,
  selectedMachine
}) => {
  const { isMaterialTransportVehicle, isCargador } = useMachineSpecificReports();
  const [inventarioActual, setInventarioActual] = useState<any[]>([]);
  const [productosProveedor, setProductosProveedor] = useState<any[]>([]);

  // Cargar inventario fresco cuando el componente se monta o cuando cambia el material
  useEffect(() => {
    const inventario = loadInventarioAcopio();
    setInventarioActual(inventario);
    console.log('MaterialInputs - Inventario cargado:', inventario);
  }, [tipoMateria]);

  // Cargar productos del proveedor cuando cambia el origen
  useEffect(() => {
    if (origin && !esAcopio(origin)) {
      const { proveedorId } = extraerInfoProveedor(origin);
      if (proveedorId) {
        const productos = loadProductosProveedores();
        const productosDelProveedor = productos.filter(
          producto => producto.proveedor_id === proveedorId && producto.tipo_insumo === 'Material'
        );
        setProductosProveedor(productosDelProveedor);
        console.log('MaterialInputs - Productos del proveedor cargados:', productosDelProveedor);
      } else {
        setProductosProveedor([]);
      }
    } else {
      setProductosProveedor([]);
    }
  }, [origin]);

  // Verificar si es Camabaja (transporta maquinaria, no material)
  const isCamabaja = selectedMachine?.type === 'Camabaja';

  // Solo mostrar si es reporte de viajes y es una máquina que transporta material (excluyendo Camabaja)
  if (reportType !== 'Viajes' || isCamabaja || (!isMaterialTransportVehicle(selectedMachine) && !isCargador(selectedMachine))) {
    return null;
  }

  console.log('MaterialInputs - selectedMachine:', selectedMachine);
  console.log('MaterialInputs - isCargador:', isCargador(selectedMachine));
  console.log('MaterialInputs - origin:', origin);

  // LÓGICA CORREGIDA: Determinar qué selector mostrar
  const origenEsAcopio = esAcopio(origin);
  const esCargadorMachine = isCargador(selectedMachine);
  
  // Mostrar selector de inventario solo para:
  // 1. Cargadores (siempre usan materiales del acopio)
  // 2. Cualquier máquina cuyo origen sea el acopio
  const shouldShowInventoryMaterialSelect = esCargadorMachine || origenEsAcopio;
  
  // Mostrar selector de productos del proveedor para volquetas/camiones que NO vienen del acopio
  const shouldShowProviderMaterialSelect = !esCargadorMachine && !origenEsAcopio && origin.trim() !== '' && productosProveedor.length > 0;
  
  // Mostrar selector estándar como fallback
  const shouldShowTipoMateriaInput = !esCargadorMachine && !origenEsAcopio && origin.trim() !== '' && productosProveedor.length === 0;
  
  console.log('MaterialInputs - origenEsAcopio:', origenEsAcopio);
  console.log('MaterialInputs - shouldShowInventoryMaterialSelect:', shouldShowInventoryMaterialSelect);
  console.log('MaterialInputs - shouldShowProviderMaterialSelect:', shouldShowProviderMaterialSelect);
  console.log('MaterialInputs - shouldShowTipoMateriaInput:', shouldShowTipoMateriaInput);
  console.log('MaterialInputs - productosProveedor:', productosProveedor);
  
  // Obtener stock disponible del material seleccionado usando el inventario actual
  const materialSeleccionado = inventarioActual.find(item => item.tipo_material === tipoMateria);
  const stockDisponible = materialSeleccionado?.cantidad_disponible || 0;
  const stockInsuficiente = cantidadM3 && cantidadM3 > stockDisponible;

  console.log('MaterialInputs - Material seleccionado:', materialSeleccionado);
  console.log('MaterialInputs - Stock disponible:', stockDisponible);
  console.log('MaterialInputs - Cantidad solicitada:', cantidadM3);
  console.log('MaterialInputs - Stock insuficiente:', stockInsuficiente);

  return (
    <>
      {shouldShowInventoryMaterialSelect && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={24} />
            <Label htmlFor="material-inventario" className="text-lg">
              {esCargadorMachine 
                ? 'Material a Cargar (del Acopio)' 
                : 'Material del Inventario'
              }
            </Label>
          </div>
          
          {esCargadorMachine && (
            <Alert className="border-green-200 bg-green-50 mb-3">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Carga desde Acopio:</strong> Selecciona el material disponible en el acopio 
                que vas a cargar y entregar al cliente.
              </AlertDescription>
            </Alert>
          )}
          
          <Select onValueChange={setTipoMateria} value={tipoMateria}>
            <SelectTrigger className="text-lg p-6">
              <SelectValue placeholder="Selecciona el material del inventario" />
            </SelectTrigger>
            <SelectContent>
              {inventarioActual.filter(item => item.cantidad_disponible > 0).map((item) => (
                <SelectItem key={item.id} value={item.tipo_material}>
                  {item.tipo_material} 
                  <span className="ml-2 font-medium text-green-600">
                    ({item.cantidad_disponible} m³ disponibles)
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {shouldShowProviderMaterialSelect && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={24} />
            <Label htmlFor="material-proveedor" className="text-lg">Tipo de Material (del Proveedor)</Label>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50 mb-3">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Materiales del Proveedor:</strong> Estos son los materiales específicos disponibles 
              del proveedor seleccionado en el origen.
            </AlertDescription>
          </Alert>
          
          <Select onValueChange={setTipoMateria} value={tipoMateria}>
            <SelectTrigger className="text-lg p-6">
              <SelectValue placeholder="Selecciona el material del proveedor" />
            </SelectTrigger>
            <SelectContent>
              {productosProveedor.map((producto) => (
                <SelectItem key={producto.id} value={producto.nombre_producto}>
                  {producto.nombre_producto}
                  <span className="ml-2 text-sm text-gray-600">
                    ({producto.unidad} - ${producto.precio_unitario?.toLocaleString()})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {shouldShowTipoMateriaInput && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Wrench size={24} />
            <Label htmlFor="tipo-materia" className="text-lg">Tipo de Materia</Label>
          </div>
          <Select onValueChange={setTipoMateria} value={tipoMateria}>
            <SelectTrigger className="text-lg p-6">
              <SelectValue placeholder="Selecciona el tipo de materia" />
            </SelectTrigger>
            <SelectContent>
              {tiposMaterial.map((tipo) => (
                <SelectItem key={tipo} value={tipo}>
                  {tipo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {(shouldShowInventoryMaterialSelect || shouldShowProviderMaterialSelect || shouldShowTipoMateriaInput) && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={24} />
            <Label htmlFor="cantidad-m3" className="text-lg">
              {esCargadorMachine 
                ? 'Cantidad de m³ Cargados'
                : 'Cantidad de m³ Transportados'
              }
              {shouldShowInventoryMaterialSelect && tipoMateria && (
                <span className={`text-sm ml-2 font-medium ${stockDisponible > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  (Disponibles: {stockDisponible} m³)
                </span>
              )}
            </Label>
          </div>
          
          {stockInsuficiente && shouldShowInventoryMaterialSelect && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 font-medium">
                <strong>Stock insuficiente:</strong> Cantidad solicitada ({cantidadM3} m³) supera 
                el stock disponible ({stockDisponible} m³)
              </AlertDescription>
            </Alert>
          )}
          
          <Input 
            id="cantidad-m3"
            type="number"
            min="0.1"
            step="0.1"
            max={shouldShowInventoryMaterialSelect && tipoMateria ? stockDisponible : undefined}
            placeholder={esCargadorMachine ? "Ej: 6 (cantidad cargada)" : "Ej: 6"}
            value={cantidadM3 === undefined ? '' : cantidadM3}
            onChange={(e) => setCantidadM3(parseFloat(e.target.value) || undefined)}
            className={`text-lg p-6 ${stockInsuficiente && shouldShowInventoryMaterialSelect ? 'border-red-300 focus:border-red-500' : ''}`}
            required
          />
        </div>
      )}
    </>
  );
};

export default MaterialInputs;
