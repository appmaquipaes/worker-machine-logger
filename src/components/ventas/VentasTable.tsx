
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Zap, User } from 'lucide-react';
import { Venta } from '@/models/Ventas';

interface VentasTableProps {
  ventasFiltradas: Venta[];
}

const VentasTable: React.FC<VentasTableProps> = ({ ventasFiltradas }) => {
  const getFincaFromDestino = (destino: string): string => {
    if (!destino) return '';
    return destino.split(' - ')[1] || '';
  };

  const esVentaAutomatica = (venta: Venta): boolean => {
    return venta.observaciones?.includes('Venta automática') || false;
  };

  return (
    <Card className="shadow-xs border border-muted">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Listado de Ventas
          <div className="flex gap-2 ml-4">
            <div className="flex items-center gap-1 text-xs">
              <Zap className="h-3 w-3 text-green-600" />
              <span className="text-green-600">Automática</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <User className="h-3 w-3 text-blue-600" />
              <span className="text-blue-600">Manual</span>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          <span className="text-sm">{ventasFiltradas.length} venta(s) encontrada(s)</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-accent/30">
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Finca/Destino</TableHead>
                <TableHead>Tipo de Venta</TableHead>
                <TableHead>Ciudad Entrega</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead>Forma de Pago</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Tipo Registro</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventasFiltradas.map((venta, idx) => (
                <TableRow 
                  key={venta.id}
                  className={`${idx % 2 === 1 ? "bg-muted/20" : ""} ${
                    esVentaAutomatica(venta) ? "border-l-4 border-l-green-500" : "border-l-4 border-l-blue-500"
                  }`}
                  tabIndex={0}
                  aria-label={`Ver detalle de venta del ${new Date(venta.fecha).toLocaleDateString()}`}
                >
                  <TableCell>{new Date(venta.fecha).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{venta.cliente}</TableCell>
                  <TableCell>{getFincaFromDestino(venta.destino_material) || venta.destino_material}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium transition
                      ${
                        venta.tipo_venta === 'Solo material' ? 'bg-blue-100 text-blue-800' :
                        venta.tipo_venta === 'Solo transporte' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {venta.tipo_venta}
                    </span>
                  </TableCell>
                  <TableCell>{venta.ciudad_entrega}</TableCell>
                  <TableCell>{venta.origen_material}</TableCell>
                  <TableCell>{venta.forma_pago}</TableCell>
                  <TableCell className="font-semibold">
                    ${venta.total_venta.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {esVentaAutomatica(venta) ? (
                        <>
                          <Zap className="h-4 w-4 text-green-600" />
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Automática
                          </span>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4 text-blue-600" />
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Manual
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {ventasFiltradas.length === 0 && (
          <div className="text-center py-8 text-muted-foreground animate-fade-in">
            No se encontraron ventas con los filtros aplicados.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VentasTable;
