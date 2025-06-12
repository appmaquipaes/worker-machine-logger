
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp } from 'lucide-react';

interface ReportDataTableProps {
  reportData: any[];
  extractClienteFromDestination: (destination: string) => string;
  extractFincaFromDestination: (destination: string) => string;
}

const ReportDataTable: React.FC<ReportDataTableProps> = ({
  reportData,
  extractClienteFromDestination,
  extractFincaFromDestination
}) => {
  if (reportData.length === 0) return null;

  return (
    <Card className="corporate-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-responsive-lg">
          <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
            <TrendingUp className="mobile-icon text-white" />
          </div>
          Datos del Reporte
        </CardTitle>
        <CardDescription className="text-responsive-base">
          Detalle de los reportes generados ({reportData.length} registros)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border-2 overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="font-semibold">Fecha</TableHead>
                <TableHead className="font-semibold">Usuario</TableHead>
                <TableHead className="font-semibold">Máquina</TableHead>
                <TableHead className="font-semibold">Tipo</TableHead>
                <TableHead className="font-semibold">Cliente</TableHead>
                <TableHead className="font-semibold">Finca</TableHead>
                <TableHead className="font-semibold">Horas</TableHead>
                <TableHead className="font-semibold">Viajes</TableHead>
                <TableHead className="font-semibold">M³</TableHead>
                <TableHead className="font-semibold">Valor</TableHead>
                <TableHead className="font-semibold">Comisión</TableHead>
                <TableHead className="font-semibold">Cálculo</TableHead>
                <TableHead className="font-semibold w-48">Novedades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((report) => (
                <TableRow key={report.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{report.reportDate.toLocaleDateString()}</TableCell>
                  <TableCell>{report.userName}</TableCell>
                  <TableCell>{report.machineName}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {report.reportType}
                    </span>
                  </TableCell>
                  <TableCell>{report.workSite || extractClienteFromDestination(report.destination) || '-'}</TableCell>
                  <TableCell>{extractFincaFromDestination(report.destination) || '-'}</TableCell>
                  <TableCell>{report.hours || '-'}</TableCell>
                  <TableCell>{report.trips || '-'}</TableCell>
                  <TableCell>{report.cantidadM3 || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={report.value ? 'font-semibold text-green-600' : 'text-slate-400'}>
                        {report.value ? `$${report.value.toLocaleString()}` : '-'}
                      </span>
                      {report.tarifaEncontrada !== undefined && (
                        <span className={`text-xs ${report.tarifaEncontrada ? 'text-green-600' : 'text-orange-600'}`}>
                          {report.tarifaEncontrada ? '✓ Con tarifa' : '⚠ Sin tarifa'}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-orange-600">
                        {report.comisionTotal ? `$${report.comisionTotal.toLocaleString()}` : '-'}
                      </span>
                      {report.comisionPorHora > 0 && (
                        <span className="text-xs text-slate-500">
                          ${report.comisionPorHora.toLocaleString()}/h
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="w-48 max-w-48">
                    <div className="truncate text-sm" title={report.detalleCalculo || ''}>
                      {report.detalleCalculo || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="w-48 max-w-48">
                    <div className="truncate text-sm" title={report.reportType === 'Novedades' ? report.description : ''}>
                      {report.reportType === 'Novedades' ? report.description : '-'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportDataTable;
