
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Zap, User, Calendar, MapPin, CreditCard, Activity } from 'lucide-react';
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
    return venta.observaciones?.includes('Venta automática') || venta.tipo_registro === 'Automática';
  };

  const getTipoVentaStyle = (tipo: string) => {
    const styles = {
      'Solo material': 'bg-blue-100 text-blue-800 border border-blue-200',
      'Solo transporte': 'bg-green-100 text-green-800 border border-green-200',
      'Material + transporte': 'bg-purple-100 text-purple-800 border border-purple-200'
    };
    return styles[tipo as keyof typeof styles] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const getFormaPagoStyle = (forma: string) => {
    const styles = {
      'Efectivo': 'bg-green-100 text-green-800',
      'Transferencia': 'bg-blue-100 text-blue-800',
      'Cheque': 'bg-yellow-100 text-yellow-800',
      'Crédito': 'bg-orange-100 text-orange-800',
      'Mixto': 'bg-purple-100 text-purple-800'
    };
    return styles[forma as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <Card className="bg-white border border-slate-200 shadow-lg rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <Calendar className="h-7 w-7 text-slate-600" />
              Historial de Ventas
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 mt-2">
              {ventasFiltradas.length} venta(s) registrada(s)
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-xl border border-green-200">
              <Zap className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Automática</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-200">
              <User className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Manual</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {ventasFiltradas.length === 0 ? (
          <div className="text-center py-16 px-8">
            <div className="p-6 bg-slate-100 rounded-2xl inline-block mb-6">
              <Calendar className="h-12 w-12 text-slate-400 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-slate-600 mb-2">No hay ventas registradas</h3>
            <p className="text-lg text-slate-500">
              No se encontraron ventas con los filtros aplicados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 border-b border-slate-200">
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Fecha</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Cliente</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Finca/Destino</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Tipo de Venta</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Actividad</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Origen</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Forma de Pago</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Total</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Tipo</TableHead>
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventasFiltradas.map((venta, idx) => (
                  <TableRow 
                    key={venta.id}
                    className={`
                      ${idx % 2 === 1 ? "bg-slate-50/50" : "bg-white"} 
                      hover:bg-blue-50 transition-colors duration-200
                      ${esVentaAutomatica(venta) ? "border-l-4 border-l-green-500" : "border-l-4 border-l-blue-500"}
                    `}
                  >
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-base font-medium text-slate-700">
                          {new Date(venta.fecha).toLocaleDateString('es-CO')}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <span className="text-base font-semibold text-slate-800">
                        {venta.cliente}
                      </span>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="text-base text-slate-700">
                          {getFincaFromDestino(venta.destino_material) || venta.destino_material}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold ${getTipoVentaStyle(venta.tipo_venta)}`}>
                        {venta.tipo_venta}
                      </span>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-slate-500" />
                        <span className="text-base text-slate-700">
                          {venta.actividad_generadora || 'Venta manual'}
                        </span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <span className="text-base text-slate-700">{venta.origen_material}</span>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <span className={`px-3 py-2 rounded-lg text-sm font-semibold ${getFormaPagoStyle(venta.forma_pago)}`}>
                        {venta.forma_pago}
                      </span>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <span className="text-base font-bold text-green-600">
                        {formatCurrency(venta.total_venta)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <div className="flex items-center gap-2">
                        {esVentaAutomatica(venta) ? (
                          <>
                            <Zap className="h-5 w-5 text-green-600" />
                            <span className="px-3 py-2 rounded-lg text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                              Automática
                            </span>
                          </>
                        ) : (
                          <>
                            <User className="h-5 w-5 text-blue-600" />
                            <span className="px-3 py-2 rounded-lg text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                              Manual
                            </span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          // Mostrar detalles de la venta
                          console.log('Ver detalles de venta:', venta);
                          alert(`Detalles de venta:\n\nCliente: ${venta.cliente}\nTotal: ${formatCurrency(venta.total_venta)}\nFecha: ${new Date(venta.fecha).toLocaleDateString('es-CO')}\n\nFuncionalidad de vista detallada próximamente...`);
                        }}
                        className="h-10 px-4 text-sm font-medium border-2 border-slate-300 hover:bg-slate-50 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VentasTable;
