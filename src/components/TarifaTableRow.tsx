
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { TableCell, TableRow } from '@/components/ui/table';
import { Pencil, Trash, Truck, Settings } from 'lucide-react';
import { TarifaCliente } from '@/models/TarifasCliente';

interface TarifaTableRowProps {
  tarifa: TarifaCliente;
  materiales: any[];
  machines: any[];
  onEdit: (tarifa: TarifaCliente) => void;
  onDelete: (tarifa: TarifaCliente) => void;
  onToggleStatus: (id: string) => void;
}

const TarifaTableRow: React.FC<TarifaTableRowProps> = ({
  tarifa,
  materiales,
  machines,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const getMaterialName = (materialId?: string) => {
    if (!materialId) return '-';
    const material = materiales.find(m => m.id === materialId);
    return material ? material.nombre_material : materialId;
  };

  const getMachineName = (machineId?: string) => {
    if (!machineId) return '-';
    const machine = machines.find(m => m.id === machineId);
    return machine ? `${machine.name} (${machine.plate})` : machineId;
  };

  const calcularMargenGanancia = (tarifa: TarifaCliente) => {
    if (!tarifa.valor_material_m3 || !tarifa.valor_material_cliente_m3) return null;
    const margen = tarifa.valor_material_cliente_m3 - tarifa.valor_material_m3;
    const porcentaje = ((margen / tarifa.valor_material_m3) * 100).toFixed(1);
    return { margen, porcentaje };
  };

  const formatearValoresAlquiler = (tarifa: TarifaCliente) => {
    const valores = [];
    if (tarifa.valor_por_hora) valores.push(`$${tarifa.valor_por_hora.toLocaleString()}/h`);
    if (tarifa.valor_por_dia) valores.push(`$${tarifa.valor_por_dia.toLocaleString()}/d`);
    if (tarifa.valor_por_mes) valores.push(`$${tarifa.valor_por_mes.toLocaleString()}/m`);
    return valores.join(' | ');
  };

  const margen = calcularMargenGanancia(tarifa);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          {tarifa.tipo_servicio === 'transporte' ? (
            <Truck className="h-4 w-4 text-blue-600" />
          ) : (
            <Settings className="h-4 w-4 text-orange-600" />
          )}
          <span className="text-xs">
            {tarifa.tipo_servicio === 'transporte' ? 'Transporte' : 'Alquiler'}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-medium">{tarifa.cliente}</TableCell>
      <TableCell>
        {tarifa.tipo_servicio === 'transporte' ? (
          <div className="text-sm">
            <div>Servicio de transporte</div>
            {tarifa.finca && <div className="text-muted-foreground">Finca: {tarifa.finca}</div>}
          </div>
        ) : (
          <div className="text-sm">
            <div>{tarifa.tipo_maquina}</div>
            <div className="text-muted-foreground">{getMachineName(tarifa.maquina_id)}</div>
          </div>
        )}
      </TableCell>
      <TableCell>
        {tarifa.tipo_servicio === 'transporte' ? (
          <div className="text-sm">
            <div>De: {tarifa.origen}</div>
            <div>A: {tarifa.destino}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {tarifa.tipo_servicio === 'transporte' ? (
          <div className="text-sm">
            <div>${tarifa.valor_flete_m3?.toLocaleString()}/m³</div>
            <div className="text-muted-foreground">Flete</div>
          </div>
        ) : (
          <div className="text-sm">
            {formatearValoresAlquiler(tarifa)}
          </div>
        )}
      </TableCell>
      <TableCell>
        {tarifa.tipo_servicio === 'transporte' ? (
          <div className="text-sm">
            <div>{getMaterialName(tarifa.tipo_material)}</div>
            {tarifa.valor_material_cliente_m3 && (
              <div className="text-muted-foreground">
                ${tarifa.valor_material_cliente_m3.toLocaleString()}/m³
              </div>
            )}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      <TableCell>
        {margen ? (
          <div className="text-sm">
            <div className="font-medium text-green-600">${margen.margen.toLocaleString()}</div>
            <div className="text-muted-foreground">({margen.porcentaje}%)</div>
          </div>
        ) : '-'}
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          tarifa.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {tarifa.activa ? 'Activa' : 'Inactiva'}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(tarifa)}
            className="h-8 w-8 p-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(tarifa)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
          <Switch
            checked={tarifa.activa}
            onCheckedChange={() => onToggleStatus(tarifa.id)}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};

export default TarifaTableRow;
