
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
            <TableHeader className="bg-gradient-to-r from-slate-100 to-slate-200">
              <TableRow className="border-b-2 border-slate-300">
                <TableHead className="font-bold text-slate-800 text-sm">Fecha</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Usuario</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Máquina</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Tipo</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Cliente</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Finca</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Horas</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Viajes</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">M³</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Valor</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Comisión</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm">Cálculo</TableHead>
                <TableHead className="font-bold text-slate-800 text-sm w-48">Novedades</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.map((report, index) => (
                <TableRow 
                  key={report.id} 
                  className={`hover:bg-slate-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                  }`}
                >
                  <TableCell className="font-medium text-slate-700">{report.reportDate.toLocaleDateString()}</TableCell>
                  <TableCell className="text-slate-600">{report.userName}</TableCell>
                  <TableCell className="text-slate-600">{report.machineName}</TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      {report.reportType}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">{report.workSite || extractClienteFromDestination(report.destination) || '-'}</TableCell>
                  <TableCell className="text-slate-600">{extractFincaFromDestination(report.destination) || '-'}</TableCell>
                  <TableCell className="text-slate-600">{report.hours || '-'}</TableCell>
                  <TableCell className="text-slate-600">{report.trips || '-'}</TableCell>
                  <TableCell className="text-slate-600">{report.cantidadM3 || '-'}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={report.value ? 'font-semibold text-green-700' : 'text-slate-400'}>
                        {report.value ? `$${report.value.toLocaleString()}` : '-'}
                      </span>
                      {report.tarifaEncontrada !== undefined && (
                        <span className={`text-xs font-medium ${
                          report.tarifaEncontrada 
                            ? 'text-green-700 bg-green-100 px-2 py-0.5 rounded' 
                            : 'text-amber-700 bg-amber-100 px-2 py-0.5 rounded'
                        }`}>
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
                    <div className="truncate text-sm text-slate-600" title={report.detalleCalculo || ''}>
                      {report.detalleCalculo || '-'}
                    </div>
                  </TableCell>
                  <TableCell className="w-48 max-w-48">
                    <div className="truncate text-sm text-slate-600" title={report.reportType === 'Novedades' ? report.description : ''}>
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
