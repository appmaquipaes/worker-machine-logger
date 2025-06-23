
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ToggleLeft, ToggleRight, DollarSign, Truck, Settings, MapPin } from 'lucide-react';
import { TarifaCliente } from '@/models/TarifasCliente';
import { loadProductosProveedores } from '@/models/Proveedores';

interface TarifasClienteTableProps {
  tarifas: TarifaCliente[];
  clientes: any[];
  machines: any[];
  materiales: any[];
  onEdit: (tarifa: TarifaCliente) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  calcularMargen: (tarifa: TarifaCliente) => any;
  formatCurrency: (amount: number) => string;
  getMaterialName: (id?: string) => string;
  getMachineName: (id?: string) => string;
}

const TarifasClienteTable: React.FC<TarifasClienteTableProps> = ({
  tarifas,
  clientes,
  machines,
  materiales,
  onEdit,
  onDelete,
  onToggleStatus,
  calcularMargen,
  formatCurrency,
  getMachineName
}) => {
  const getEscombreraName = (id?: string) => {
    if (!id) return '-';
    const escombrera = machines.find(m => m.id === id);
    return escombrera ? escombrera.name : id;
  };

  const getMaterialName = (id?: string) => {
    if (!id) return '-';
    
    // First try to find in general materials
    const material = materiales.find(m => m.id === id);
    if (material) {
      return material.nombre_material;
    }
    
    // Then try to find in provider products
    const productosProveedores = loadProductosProveedores();
    const producto = productosProveedores.find(p => p.id === id);
    if (producto) {
      return producto.nombre_producto;
    }
    
    return id;
  };

  const getServiceIcon = (tipo: string) => {
    switch (tipo) {
      case 'transporte': return <Truck className="h-5 w-5" />;
      case 'alquiler_maquina': return <Settings className="h-5 w-5" />;
      case 'recepcion_escombrera': return <MapPin className="h-5 w-5" />;
      default: return <DollarSign className="h-5 w-5" />;
    }
  };

  const getServiceLabel = (tipo: string) => {
    switch (tipo) {
      case 'transporte': return 'Transporte';
      case 'alquiler_maquina': return 'Alquiler';
      case 'recepcion_escombrera': return 'Escombrera';
      default: return tipo;
    }
  };

  const getServiceColor = (tipo: string) => {
    switch (tipo) {
      case 'transporte': return 'text-green-600 bg-green-100';
      case 'alquiler_maquina': return 'text-purple-600 bg-purple-100';
      case 'recepcion_escombrera': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-100 border-b-2 border-slate-200">
            <TableHead className="font-bold text-slate-800 text-base py-4">Cliente</TableHead>
            <TableHead className="font-bold text-slate-800 text-base py-4">Finca</TableHead>
            <TableHead className="font-bold text-slate-800 text-base py-4">Tipo Servicio</TableHead>
            <TableHead className="font-bold text-slate-800 text-base py-4">Detalle</TableHead>
            <TableHead className="font-bold text-slate-800 text-base py-4">Valores</TableHead>
            <TableHead className="font-bold text-slate-800 text-base py-4">Estado</TableHead>
            <TableHead className="font-bold text-slate-800 text-base py-4 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tarifas.map((tarifa) => {
            const clienteObj = clientes.find(c => c.id === tarifa.cliente || c.nombre_cliente === tarifa.cliente);
            const clienteNombre = clienteObj?.nombre_cliente || tarifa.cliente || '';
            const margen = calcularMargen(tarifa);

            return (
              <TableRow key={tarifa.id} className="hover:bg-slate-50 transition-colors border-b border-slate-200">
                <TableCell className="font-bold text-slate-800 text-base py-6">{clienteNombre}</TableCell>
                <TableCell className="text-slate-600 text-base py-6">{tarifa.finca || '-'}</TableCell>
                <TableCell className="py-6">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getServiceColor(tarifa.tipo_servicio)}`}>
                      {getServiceIcon(tarifa.tipo_servicio)}
                    </div>
                    <span className="font-bold text-slate-700 text-base">{getServiceLabel(tarifa.tipo_servicio)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 py-6">
                  {tarifa.tipo_servicio === 'transporte' && (
                    <div className="space-y-2">
                      <div className="text-base"><strong>Ruta:</strong> {tarifa.origen} → {tarifa.destino}</div>
                      {tarifa.tipo_material && (
                        <div className="text-base"><strong>Material:</strong> {getMaterialName(tarifa.tipo_material)}</div>
                      )}
                    </div>
                  )}
                  {tarifa.tipo_servicio === 'alquiler_maquina' && (
                    <div className="text-base">
                      <strong>Máquina:</strong> {getMachineName(tarifa.maquina_id)}
                    </div>
                  )}
                  {tarifa.tipo_servicio === 'recepcion_escombrera' && (
                    <div className="text-base">
                      <strong>Escombrera:</strong> {getEscombreraName(tarifa.escombrera_id)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-6">
                  <div className="space-y-2">
                    {tarifa.tipo_servicio === 'transporte' && (
                      <>
                        <div className="text-base font-semibold">
                          <strong>Flete:</strong> {formatCurrency(tarifa.valor_flete_m3 || 0)}/m³
                        </div>
                        {tarifa.valor_material_cliente_m3 && (
                          <div className="text-base">
                            <strong>Material:</strong> {formatCurrency(tarifa.valor_material_cliente_m3)}/m³
                            {margen && (
                              <span className={`ml-2 text-sm font-bold px-2 py-1 rounded ${margen.margen >= 0 ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                ({margen.porcentaje}%)
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {tarifa.tipo_servicio === 'alquiler_maquina' && (
                      <div className="space-y-1">
                        {tarifa.valor_por_hora && (
                          <div className="text-base font-semibold">
                            <strong>Por hora:</strong> {formatCurrency(tarifa.valor_por_hora)}
                          </div>
                        )}
                        {tarifa.valor_por_dia && (
                          <div className="text-base font-semibold">
                            <strong>Por día:</strong> {formatCurrency(tarifa.valor_por_dia)}
                          </div>
                        )}
                        {tarifa.valor_por_mes && (
                          <div className="text-base font-semibold">
                            <strong>Por mes:</strong> {formatCurrency(tarifa.valor_por_mes)}
                          </div>
                        )}
                      </div>
                    )}
                    {tarifa.tipo_servicio === 'recepcion_escombrera' && (
                      <div className="space-y-1">
                        <div className="text-base font-semibold">
                          <strong>Sencilla:</strong> {formatCurrency(tarifa.valor_volqueta_sencilla || 0)}
                        </div>
                        <div className="text-base font-semibold">
                          <strong>Doble Troque:</strong> {formatCurrency(tarifa.valor_volqueta_doble_troque || 0)}
                        </div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-6">
                  <Badge 
                    variant={tarifa.activa ? "default" : "secondary"} 
                    className={`text-base font-bold px-4 py-2 ${
                      tarifa.activa 
                        ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {tarifa.activa ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell className="py-6">
                  <div className="flex justify-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(tarifa.id)}
                      className="h-10 w-10 p-0 hover:bg-blue-100 transition-colors rounded-lg"
                    >
                      {tarifa.activa ? (
                        <ToggleRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tarifa)}
                      className="h-10 w-10 p-0 hover:bg-blue-100 transition-colors rounded-lg"
                    >
                      <Edit className="h-5 w-5 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(tarifa.id)}
                      className="h-10 w-10 p-0 hover:bg-red-100 transition-colors rounded-lg"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TarifasClienteTable;
