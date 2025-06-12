
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Report } from '@/types/report';
import { loadMateriales } from '@/models/Materiales';
import { loadTarifas } from '@/models/Tarifas';

interface ProfitCalculatorProps {
  report: Report;
}

const ProfitCalculator = ({ report }: ProfitCalculatorProps) => {
  // Helper function to safely format numbers
  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString();
  };

  // Datos
  const materiales = loadMateriales();
  const tarifas = loadTarifas();

  // Buscar material
  const material = materiales.find(m => 
    m.nombre_material.toLowerCase() === report.description.toLowerCase()
  );

  // Buscar tarifa de transporte
  const tarifa = tarifas.find(t => 
    t.origen.toLowerCase() === report.origin?.toLowerCase() && 
    t.destino.toLowerCase() === report.destination?.toLowerCase()
  );

  // Precio de compra del material (desde tipos_material)
  const precioCompra = material ? material.valor_por_m3 : 0;
  
  // Costo del flete por m³ (desde tarifas_transporte)
  const costoFlete = tarifa ? tarifa.valor_por_m3 : 0;
  
  // Precio de venta por m³ (actualmente usamos el valor del reporte dividido por la cantidad)
  const precioVenta = report.value && report.cantidadM3 ? report.value / report.cantidadM3 : 0;
  
  // Cálculos
  const costoTotalPorM3 = precioCompra + costoFlete;
  const utilidadPorM3 = precioVenta - costoTotalPorM3;
  const utilidadTotal = utilidadPorM3 * (report.cantidadM3 || 0);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Análisis de Utilidad</CardTitle>
        <CardDescription>
          Cálculo de rentabilidad para la venta de material
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concepto</TableHead>
              <TableHead className="text-right">Valor por m³</TableHead>
              <TableHead className="text-right">Valor Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Precio de compra material</TableCell>
              <TableCell className="text-right">${formatNumber(precioCompra)}</TableCell>
              <TableCell className="text-right">${formatNumber(precioCompra * (report.cantidadM3 || 0))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Costo de flete</TableCell>
              <TableCell className="text-right">${formatNumber(costoFlete)}</TableCell>
              <TableCell className="text-right">${formatNumber(costoFlete * (report.cantidadM3 || 0))}</TableCell>
            </TableRow>
            <TableRow className="bg-muted/50">
              <TableCell className="font-medium">Costo total</TableCell>
              <TableCell className="text-right font-medium">${formatNumber(costoTotalPorM3)}</TableCell>
              <TableCell className="text-right font-medium">${formatNumber(costoTotalPorM3 * (report.cantidadM3 || 0))}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Precio de venta</TableCell>
              <TableCell className="text-right">${formatNumber(precioVenta)}</TableCell>
              <TableCell className="text-right">${formatNumber(report.value || 0)}</TableCell>
            </TableRow>
            <TableRow className={utilidadPorM3 > 0 ? "bg-green-100 dark:bg-green-900/20" : "bg-red-100 dark:bg-red-900/20"}>
              <TableCell className="font-bold">Utilidad</TableCell>
              <TableCell className="text-right font-bold">${formatNumber(utilidadPorM3)}</TableCell>
              <TableCell className="text-right font-bold">${formatNumber(utilidadTotal)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProfitCalculator;
