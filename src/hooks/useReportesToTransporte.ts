
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
    console.log('🚛 Procesando reportes para Control de Transporte...');
    
    // Filtrar reportes de tipo 'Viajes' de volquetas y camiones
    const reportesViajes = reports.filter(report => 
      report.reportType === 'Viajes' && 
      (report.machineName.toLowerCase().includes('volqueta') || 
       report.machineName.toLowerCase().includes('camión') ||
       report.machineName.toLowerCase().includes('camion'))
    );

    console.log('🚛 Reportes de viajes encontrados:', reportesViajes.length);

    // Convertir reportes a formato de viajes MEJORADO
    const viajesConvertidos: ViajeFromReport[] = reportesViajes.map(report => {
      // Extraer información del destino para cliente
      const destino = report.destination || `${report.workSite || 'Destino no especificado'}`;
      
      // Determinar material - priorizar campo description, luego buscar en otros campos
      let material = 'Material no especificado';
      if (report.description && report.description.trim()) {
        material = report.description;
      }
      
      // Calcular valores de transporte basados en el valor del reporte
      const valorTotal = report.value || 0;
      const esDesdeAcopio = report.origin === 'Acopio Maquipaes';
      
      let valorTransporte = 0;
      let valorMaterial = 0;
      
      if (esDesdeAcopio) {
        // Si es desde acopio, todo es transporte
        valorTransporte = valorTotal;
      } else {
        // Si es desde proveedor, dividir entre material y transporte (aproximación)
        valorMaterial = valorTotal * 0.7; // 70% material
        valorTransporte = valorTotal * 0.3; // 30% transporte
      }

      const viajeConvertido: ViajeFromReport = {
        id: `report-${report.id}`,
        maquina: report.machineName,
        origen: report.origin || 'No especificado',
        destino: destino,
        distancia: report.kilometraje || 0,
        material: material,
        cantidadM3: report.cantidadM3 || 0,
        numeroViajes: report.trips || 1,
        valorTransporte: valorTransporte,
        valorMaterial: valorMaterial,
        conductor: report.userName,
        observaciones: `Generado desde reporte - ${material}`,
        fecha: report.reportDate,
        tipoVenta: determinarTipoVenta(report.origin || ''),
        consumoCombustible: 0,
        eficiencia: report.kilometraje && report.trips ? report.kilometraje * report.trips : 0,
        esDesdeReporte: true
      };

      console.log('🚛 Viaje convertido:', {
        id: viajeConvertido.id,
        maquina: viajeConvertido.maquina,
        origen: viajeConvertido.origen,
        destino: viajeConvertido.destino,
        material: viajeConvertido.material,
        valorTransporte: viajeConvertido.valorTransporte,
        valorMaterial: viajeConvertido.valorMaterial
      });

      return viajeConvertido;
    });

    setViajesFromReports(viajesConvertidos);
    console.log('✅ Viajes desde reportes procesados:', viajesConvertidos.length);
  }, [reports]);

  const determinarTipoVenta = (origen: string) => {
    return origen.toLowerCase().includes('acopio') ? 'Solo transporte' : 'Material + transporte';
  };

  return {
    viajesFromReports
  };
};
