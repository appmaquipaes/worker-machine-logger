
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
import { esAcopio } from '@/utils/inventarioDetection';
import { useMaterialesPorProveedor } from '@/hooks/useMaterialesPorProveedor';
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
  const { obtenerMaterialesPorNombreProveedor, cargarDatos } = useMaterialesPorProveedor();
  const [inventarioActual, setInventarioActual] = useState<any[]>([]);

  // Cargar inventario fresco cuando el componente se monta o cuando cambia el material
  useEffect(() => {
    const inventario = loadInventarioAcopio();
    setInventarioActual(inventario);
    console.log('MaterialInputs - Inventario cargado:', inventario);
  }, [tipoMateria]);

  // Recargar datos de proveedores cuando cambia el origen
  useEffect(() => {
    if (origin && !esAcopio(origin)) {
      console.log('🔄 Recargando datos de proveedores por cambio de origen:', origin);
      cargarDatos();
    }
  }, [origin, cargarDatos]);

  // Verificar si es Camabaja (transporta maquinaria, no material)
  const isCamabaja = selectedMachine?.type === 'Camabaja';

  // FIX: No mostrar inputs de material para Camabaja
  if (reportType !== 'Viajes' || isCamabaja) {
    return null;
  }

  // Solo mostrar si es reporte de viajes y es una máquina que transporta material
  if (!isMaterialTransportVehicle(selectedMachine) && !isCargador(selectedMachine)) {
    return null;
  }

  console.log('MaterialInputs - selectedMachine:', selectedMachine);
  console.log('MaterialInputs - isCargador:', isCargador(selectedMachine));
  console.log('MaterialInputs - origin:', origin);

  // Función para formatear números con separador de miles
  const formatNumber = (value: string) => {
    // Remover cualquier carácter que no sea número o punto decimal
    const cleanValue = value.replace(/[^\d.]/g, '');
    // Convertir a número y formatear
    const num = parseFloat(cleanValue);
    if (isNaN(num)) return '';
    return num.toLocaleString('es-CO', { maximumFractionDigits: 1 });
  };

  const handleNumberChange = (value: string) => {
    // Limpiar el valor y convertir a número
    const cleanValue = value.replace(/[^\d.]/g, '');
    const numValue = parseFloat(cleanValue);
    setCantidadM3(isNaN(numValue) ? undefined : numValue);
  };

  // LÓGICA CORREGIDA: Determinar qué selector mostrar
  const origenEsAcopio = esAcopio(origin);
  const esCargadorMachine = isCargador(selectedMachine);
  
  // Mostrar selector de inventario solo para:
  // 1. Cargadores (siempre usan materiales del acopio)
  // 2. Cualquier máquina cuyo origen sea el acopio
  const shouldShowInventoryMaterialSelect = esCargadorMachine || origenEsAcopio;
  
  // Mostrar selector estándar para volquetas/camiones que NO vienen del acopio
  const shouldShowTipoMateriaInput = !esCargadorMachine && !origenEsAcopio && origin.trim() !== '';
  
  console.log('MaterialInputs - origenEsAcopio:', origenEsAcopio);
  console.log('MaterialInputs - shouldShowInventoryMaterialSelect:', shouldShowInventoryMaterialSelect);
  console.log('MaterialInputs - shouldShowTipoMateriaInput:', shouldShowTipoMateriaInput);
  
  // Obtener materiales del proveedor seleccionado
  const { proveedorNombre } = extraerInfoProveedor(origin);
  const materialesProveedor = proveedorNombre ? obtenerMaterialesPorNombreProveedor(proveedorNombre) : [];
  
  console.log('MaterialInputs - Proveedor extraído:', proveedorNombre);
  console.log('MaterialInputs - Materiales del proveedor:', materialesProveedor);
  
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
            <SelectTrigger className="text-lg p-6 bg-white border-2 border-gray-300 focus:border-blue-500 z-50">
              <SelectValue placeholder="Selecciona el material del inventario" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 shadow-lg z-50 max-h-60 overflow-y-auto">
              {inventarioActual.filter(item => item.cantidad_disponible > 0).map((item) => (
                <SelectItem 
                  key={`inventario-${item.id}-${item.tipo_material}`} 
                  value={item.tipo_material} 
                  className="hover:bg-gray-100"
                >
                  {item.tipo_material} 
                  <span className="ml-2 font-medium text-green-600">
                    ({item.cantidad_disponible.toLocaleString('es-CO', { maximumFractionDigits: 1 })} m³ disponibles)
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
            <Label htmlFor="tipo-materia" className="text-lg">
              Tipo de Material del Proveedor
              {proveedorNombre && (
                <span className="text-sm font-normal text-blue-600 ml-2">
                  ({proveedorNombre})
                </span>
              )}
            </Label>
          </div>
          
          {materialesProveedor.length > 0 ? (
            <>
              <Alert className="border-blue-200 bg-blue-50 mb-3">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Materiales disponibles del proveedor:</strong> Selecciona el material 
                  específico que ofrece {proveedorNombre}.
                </AlertDescription>
              </Alert>
              
              <Select onValueChange={setTipoMateria} value={tipoMateria}>
                <SelectTrigger className="text-lg p-6 bg-white border-2 border-gray-300 focus:border-blue-500 z-50">
                  <SelectValue placeholder="Selecciona el material del proveedor" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300 shadow-lg z-50 max-h-60 overflow-y-auto">
                  {materialesProveedor.map((material) => (
                    <SelectItem 
                      key={`proveedor-${material.id}-${material.tipo_material || material.nombre_producto}`} 
                      value={material.tipo_material || material.nombre_producto} 
                      className="hover:bg-gray-100"
                    >
                      {material.tipo_material || material.nombre_producto}
                      <span className="ml-2 text-sm text-gray-600">
                        (${(material.precio_por_m3 || material.precio_unitario || 0).toLocaleString('es-CO')}/m³)
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          ) : (
            <>
              <Alert className="border-amber-200 bg-amber-50 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <strong>Sin materiales registrados:</strong> Este proveedor no tiene materiales 
                  registrados. Selecciona de la lista general.
                </AlertDescription>
              </Alert>
              
              <Select onValueChange={setTipoMateria} value={tipoMateria}>
                <SelectTrigger className="text-lg p-6 bg-white border-2 border-gray-300 focus:border-blue-500 z-50">
                  <SelectValue placeholder="Selecciona el tipo de material" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-300 shadow-lg z-50 max-h-60 overflow-y-auto">
                  {tiposMaterial.map((tipo, index) => (
                    <SelectItem 
                      key={`material-general-${index}-${tipo}`} 
                      value={tipo} 
                      className="hover:bg-gray-100"
                    >
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      )}

      {(shouldShowInventoryMaterialSelect || shouldShowTipoMateriaInput) && (
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
                  (Disponibles: {stockDisponible.toLocaleString('es-CO', { maximumFractionDigits: 1 })} m³)
                </span>
              )}
            </Label>
          </div>
          
          {stockInsuficiente && shouldShowInventoryMaterialSelect && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 font-medium">
                <strong>Stock insuficiente:</strong> Cantidad solicitada ({cantidadM3?.toLocaleString('es-CO', { maximumFractionDigits: 1 })} m³) supera 
                el stock disponible ({stockDisponible.toLocaleString('es-CO', { maximumFractionDigits: 1 })} m³)
              </AlertDescription>
            </Alert>
          )}
          
          <Input 
            id="cantidad-m3"
            type="text"
            placeholder={esCargadorMachine ? "Ej: 6.5 (cantidad cargada)" : "Ej: 6.5"}
            value={cantidadM3 !== undefined ? formatNumber(cantidadM3.toString()) : ''}
            onChange={(e) => handleNumberChange(e.target.value)}
            className={`text-lg p-6 ${stockInsuficiente && shouldShowInventoryMaterialSelect ? 'border-red-300 focus:border-red-500' : ''}`}
            required
          />
        </div>
      )}
    </>
  );
};

export default MaterialInputs;
