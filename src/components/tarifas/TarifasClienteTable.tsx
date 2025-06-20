
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
      case 'transporte': return <Truck className="h-4 w-4" />;
      case 'alquiler_maquina': return <Settings className="h-4 w-4" />;
      case 'recepcion_escombrera': return <MapPin className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
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

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-100">
            <TableHead className="font-bold text-slate-700">Cliente</TableHead>
            <TableHead className="font-bold text-slate-700">Finca</TableHead>
            <TableHead className="font-bold text-slate-700">Tipo Servicio</TableHead>
            <TableHead className="font-bold text-slate-700">Detalle</TableHead>
            <TableHead className="font-bold text-slate-700">Valores</TableHead>
            <TableHead className="font-bold text-slate-700">Estado</TableHead>
            <TableHead className="font-bold text-slate-700 text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tarifas.map((tarifa) => {
            const clienteObj = clientes.find(c => c.id === tarifa.cliente || c.nombre_cliente === tarifa.cliente);
            const clienteNombre = clienteObj?.nombre_cliente || tarifa.cliente || '';
            const margen = calcularMargen(tarifa);

            return (
              <TableRow key={tarifa.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-medium text-slate-800">{clienteNombre}</TableCell>
                <TableCell className="text-slate-600">{tarifa.finca || '-'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getServiceIcon(tarifa.tipo_servicio)}
                    </div>
                    <span className="font-medium text-slate-700">{getServiceLabel(tarifa.tipo_servicio)}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {tarifa.tipo_servicio === 'transporte' && (
                    <div className="space-y-1">
                      <div className="text-sm"><strong>Ruta:</strong> {tarifa.origen} → {tarifa.destino}</div>
                      {tarifa.tipo_material && (
                        <div className="text-sm"><strong>Material:</strong> {getMaterialName(tarifa.tipo_material)}</div>
                      )}
                    </div>
                  )}
                  {tarifa.tipo_servicio === 'alquiler_maquina' && (
                    <div className="text-sm">
                      <strong>Máquina:</strong> {getMachineName(tarifa.maquina_id)}
                    </div>
                  )}
                  {tarifa.tipo_servicio === 'recepcion_escombrera' && (
                    <div className="text-sm">
                      <strong>Escombrera:</strong> {getEscombreraName(tarifa.escombrera_id)}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {tarifa.tipo_servicio === 'transporte' && (
                      <>
                        <div className="text-sm"><strong>Flete:</strong> {formatCurrency(tarifa.valor_flete_m3 || 0)}/m³</div>
                        {tarifa.valor_material_cliente_m3 && (
                          <div className="text-sm">
                            <strong>Material:</strong> {formatCurrency(tarifa.valor_material_cliente_m3)}/m³
                            {margen && (
                              <span className={`ml-2 text-xs ${margen.margen >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                          <div className="text-sm"><strong>Por hora:</strong> {formatCurrency(tarifa.valor_por_hora)}</div>
                        )}
                        {tarifa.valor_por_dia && (
                          <div className="text-sm"><strong>Por día:</strong> {formatCurrency(tarifa.valor_por_dia)}</div>
                        )}
                        {tarifa.valor_por_mes && (
                          <div className="text-sm"><strong>Por mes:</strong> {formatCurrency(tarifa.valor_por_mes)}</div>
                        )}
                      </div>
                    )}
                    {tarifa.tipo_servicio === 'recepcion_escombrera' && (
                      <div className="space-y-1">
                        <div className="text-sm"><strong>Sencilla:</strong> {formatCurrency(tarifa.valor_volqueta_sencilla || 0)}</div>
                        <div className="text-sm"><strong>Doble Troque:</strong> {formatCurrency(tarifa.valor_volqueta_doble_troque || 0)}</div>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={tarifa.activa ? "default" : "secondary"} className="animate-fade-in">
                    {tarifa.activa ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(tarifa.id)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                    >
                      {tarifa.activa ? (
                        <ToggleRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(tarifa)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(tarifa.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
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
