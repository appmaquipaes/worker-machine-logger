
import { useState, useEffect } from 'react';
import { useReport } from '@/context/ReportContext';

interface ConsumoFromReport {
  id: string;
  maquina: string;
  horasTrabajadas: number;
  galones: number;
  valorTotal: number;
  fecha: Date;
  observaciones: string;
  esDesdeReporte: boolean;
  kilometraje?: number;
}

export const useReportesToCombustible = () => {
  const { reports } = useReport();
  const [consumosFromReports, setConsumosFromReports] = useState<ConsumoFromReport[]>([]);

  useEffect(() => {
    // Filtrar reportes de tipo 'Combustible'
    const reportesCombustible = reports.filter(report => 
      report.reportType === 'Combustible'
    );

    // Convertir reportes a formato de consumos
    const consumosConvertidos: ConsumoFromReport[] = reportesCombustible.map(report => ({
      id: `report-${report.id}`,
      maquina: report.machineName,
      horasTrabajadas: report.hours || 8, // Valor por defecto si no está especificado
      galones: calcularGalonesEstimados(report.value || 0),
      valorTotal: report.value || 0,
      fecha: report.reportDate,
      observaciones: `Generado desde reporte - ${report.description || 'Combustible'}`,
      esDesdeReporte: true,
      kilometraje: report.kilometraje
    }));

    setConsumosFromReports(consumosConvertidos);
  }, [reports]);

  const calcularGalonesEstimados = (valor: number) => {
    // Estimación basada en precio promedio del galón ($12,000)
    const precioPromedioPorGalon = 12000;
    return Math.round((valor / precioPromedioPorGalon) * 10) / 10;
  };

  return {
    consumosFromReports
  };
};
