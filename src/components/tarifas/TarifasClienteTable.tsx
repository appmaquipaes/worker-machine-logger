
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Settings, Truck, DollarSign, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { TarifaCliente } from "@/models/TarifasCliente";

interface TarifasClienteTableProps {
  tarifas: TarifaCliente[];
  clientes: any[];
  machines: any[];
  materiales: any[];
  onEdit: (tarifa: TarifaCliente) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  calcularMargen: (tarifa: TarifaCliente) => { margen: number; porcentaje: string } | null;
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
  getMaterialName,
  getMachineName
}) => (
  <div className="rounded-xl border border-slate-200 overflow-x-auto shadow-lg">
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead className="font-bold text-slate-700 h-14">Tipo</TableHead>
          <TableHead className="font-bold text-slate-700 h-14">Cliente</TableHead>
          <TableHead className="font-bold text-slate-700 h-14">Detalle</TableHead>
          <TableHead className="font-bold text-slate-700 h-14">Origen/Destino</TableHead>
          <TableHead className="font-bold text-slate-700 h-14">Tarifas</TableHead>
          <TableHead className="font-bold text-slate-700 h-14">Material</TableHead>
          <TableHead className="font-bold text-slate-700 h-14">Margen</TableHead>
          <TableHead className="font-bold text-slate-700 h-14">Estado</TableHead>
          <TableHead className="w-32 font-bold text-slate-700 h-14">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tarifas.map((tarifa) => {
          const margen = calcularMargen(tarifa);
          return (
            <TableRow key={tarifa.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {tarifa.tipo_servicio === "transporte" ? (
                    <Truck className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Settings className="h-4 w-4 text-orange-600" />
                  )}
                  <span className="text-xs">
                    {tarifa.tipo_servicio === "transporte" ? "Transporte" : "Alquiler"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {clientes.find((c) => c.id === tarifa.cliente)?.nombre_cliente || tarifa.cliente}
              </TableCell>
              <TableCell>
                {tarifa.tipo_servicio === "transporte" ? (
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
                {tarifa.tipo_servicio === "transporte" ? (
                  <div className="text-sm">
                    <div>De: {tarifa.origen}</div>
                    <div>A: {tarifa.destino}</div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                {tarifa.tipo_servicio === "transporte" ? (
                  <div className="text-sm">
                    <div>{formatCurrency(tarifa.valor_flete_m3 ?? 0)}/m³</div>
                    <div className="text-muted-foreground">Flete</div>
                  </div>
                ) : (
                  <div className="text-sm">
                    {tarifa.valor_por_hora && <span>{formatCurrency(tarifa.valor_por_hora)}/h</span>}
                    {tarifa.valor_por_dia && <span> | {formatCurrency(tarifa.valor_por_dia)}/d</span>}
                    {tarifa.valor_por_mes && <span> | {formatCurrency(tarifa.valor_por_mes)}/m</span>}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {tarifa.tipo_servicio === "transporte" ? (
                  <div className="text-sm">
                    <div>{getMaterialName(tarifa.tipo_material)}</div>
                    {tarifa.valor_material_cliente_m3 && (
                      <div className="text-muted-foreground">
                        {formatCurrency(tarifa.valor_material_cliente_m3)}/m³
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
                    <div className="font-medium text-green-600">{formatCurrency(margen.margen)}</div>
                    <div className="text-muted-foreground">({margen.porcentaje}%)</div>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tarifa.activa ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {tarifa.activa ? "Activa" : "Inactiva"}
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
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white shadow-2xl border-0">
                      <DialogHeader className="text-center space-y-4 pb-4">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <AlertTriangle className="h-8 w-8 text-white" />
                        </div>
                        <div className="space-y-2">
                          <DialogTitle className="text-2xl font-bold text-slate-800">
                            ¿Confirmar Eliminación?
                          </DialogTitle>
                          <DialogDescription className="text-base text-slate-600 leading-relaxed">
                            Esta acción eliminará permanentemente la tarifa de <span className="font-bold text-slate-800">{tarifa.cliente}</span>.
                            <br />No se puede deshacer.
                          </DialogDescription>
                        </div>
                      </DialogHeader>
                      <div className="flex gap-3 pt-6 border-t border-slate-200">
                        <Button
                          variant="outline"
                          className="flex-1 h-12 font-semibold border-slate-300 text-slate-700 hover:bg-slate-50"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => onDelete(tarifa.id)}
                          className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar Tarifa
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onToggleStatus(tarifa.id)}
                    className="h-8 w-8 p-0"
                  >
                    <span className={`inline-block w-3 h-3 rounded-full mr-1 ${tarifa.activa ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="sr-only">Activar/Desactivar</span>
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

export default TarifasClienteTable;
