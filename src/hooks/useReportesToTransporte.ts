
import { useState, useEffect } from 'react';
import { useReport } from '@/context/ReportContext';
import { Report } from '@/types/report';

interface ViajeFromReport {
  id: string;
  maquina: string;
  origen: string;
  destino: string;
  distancia: number;
  material: string;
  cantidadM3: number;
  numeroViajes: number;
  valorTransporte: number;
  valorMaterial: number;
  conductor: string;
  observaciones: string;
  fecha: Date;
  tipoVenta: string;
  consumoCombustible?: number;
  eficiencia?: number;
  esDesdeReporte: boolean; // Para identificar que viene de reportes
}

export const useReportesToTransporte = () => {
  const { reports } = useReport();
  const [viajesFromReports, setViajesFromReports] = useState<ViajeFromReport[]>([]);

  useEffect(() => {
    // Filtrar reportes de tipo 'Viajes' de volquetas y camiones
    const reportesViajes = reports.filter(report => 
      report.reportType === 'Viajes' && 
      (report.machineName.toLowerCase().includes('volqueta') || 
       report.machineName.toLowerCase().includes('camión') ||
       report.machineName.toLowerCase().includes('camion'))
    );

    // Convertir reportes a formato de viajes
    const viajesConvertidos: ViajeFromReport[] = reportesViajes.map(report => ({
      id: `report-${report.id}`,
      maquina: report.machineName,
      origen: report.origin || 'No especificado',
      destino: report.destination || 'No especificado',
      distancia: report.kilometraje || 0,
      material: report.description,
      cantidadM3: report.cantidadM3 || 0,
      numeroViajes: report.trips || 1,
      valorTransporte: report.value || 0,
      valorMaterial: 0, // Los reportes no separan valor de material
      conductor: report.userName,
      observaciones: `Generado desde reporte - ${report.description}`,
      fecha: report.reportDate,
      tipoVenta: determinarTipoVenta(report.origin || ''),
      consumoCombustible: 0,
      eficiencia: report.kilometraje && report.trips ? report.kilometraje * report.trips : 0,
      esDesdeReporte: true
    }));

    setViajesFromReports(viajesConvertidos);
  }, [reports]);

  const determinarTipoVenta = (origen: string) => {
    return origen.toLowerCase().includes('acopio') ? 'Solo transporte' : 'Material + transporte';
  };

  return {
    viajesFromReports
  };
};
