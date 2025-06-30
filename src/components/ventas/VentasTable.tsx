
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Zap, User, Calendar, MapPin, Activity, Clock, Truck, Package } from 'lucide-react';
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
      'Material + transporte': 'bg-purple-100 text-purple-800 border border-purple-200',
      'Alquiler por horas': 'bg-orange-100 text-orange-800 border border-orange-200',
      'Horas extras': 'bg-red-100 text-red-800 border border-red-200',
      'Mantenimiento': 'bg-gray-100 text-gray-800 border border-gray-200',
      'Combustible': 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      'Escombrera': 'bg-pink-100 text-pink-800 border border-pink-200'
    };
    return styles[tipo as keyof typeof styles] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('es-CO');
  };

  const getDetallesVenta = (venta: Venta): string => {
    const detalles = [];
    
    if (venta.horas_trabajadas) {
      detalles.push(`${formatNumber(venta.horas_trabajadas)} horas`);
    }
    
    if (venta.viajes_realizados) {
      detalles.push(`${formatNumber(venta.viajes_realizados)} viajes`);
    }
    
    if (venta.cantidad_material_m3) {
      detalles.push(`${formatNumber(venta.cantidad_material_m3)} m³`);
    }
    
    if (venta.maquina_utilizada) {
      detalles.push(venta.maquina_utilizada);
    }
    
    return detalles.join(' • ') || 'Ver detalles';
  };

  const mostrarDetallesVenta = (venta: Venta) => {
    const detallesTexto = venta.detalles.map(detalle => 
      `• ${detalle.producto_servicio}: ${formatCurrency(detalle.subtotal)}`
    ).join('\n');
    
    const resumen = `
DETALLES DE LA VENTA

Cliente: ${venta.cliente}
Fecha: ${new Date(venta.fecha).toLocaleDateString('es-CO')}
Tipo de Venta: ${venta.tipo_venta}
Actividad: ${venta.actividad_generadora || 'No especificada'}

${venta.maquina_utilizada ? `Máquina: ${venta.maquina_utilizada}` : ''}
${venta.horas_trabajadas ? `Horas: ${formatNumber(venta.horas_trabajadas)}` : ''}
${venta.viajes_realizados ? `Viajes: ${formatNumber(venta.viajes_realizados)}` : ''}
${venta.cantidad_material_m3 ? `Material: ${formatNumber(venta.cantidad_material_m3)} m³` : ''}

DETALLES DE FACTURACIÓN:
${detallesTexto}

TOTAL: ${formatCurrency(venta.total_venta)}

${venta.observaciones ? `Observaciones: ${venta.observaciones}` : ''}
    `;
    
    alert(resumen.trim());
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
                  <TableHead className="text-base font-bold text-slate-700 py-4 px-6">Total</TableHead>
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
                        {esVentaAutomatica(venta) && (
                          <Zap className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <span className="text-base text-slate-700">{venta.origen_material}</span>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <span className="text-base font-bold text-green-600">
                        {formatCurrency(venta.total_venta)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="py-5 px-6">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => mostrarDetallesVenta(venta)}
                        className="h-10 px-4 text-sm font-medium border-2 border-slate-300 hover:bg-slate-50 rounded-lg transition-colors duration-200 flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {getDetallesVenta(venta)}
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
