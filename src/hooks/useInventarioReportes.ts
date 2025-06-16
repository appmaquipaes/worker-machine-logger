
import { useCallback } from 'react';
import { Report } from '@/types/report';
import { ResultadoOperacionInventario } from '@/types/inventario';
import { isAcopio } from '@/constants/inventario';
import { useInventarioEntradas } from './useInventarioEntradas';
import { useInventarioSalidas } from './useInventarioSalidas';

export const useInventarioReportes = () => {
  const { procesarEntrada } = useInventarioEntradas();
  const { procesarSalida } = useInventarioSalidas();

  const procesarReporteInventario = useCallback((report: Report): ResultadoOperacionInventario => {
    console.log('=== PROCESANDO REPORTE PARA INVENTARIO ===');
    console.log('Reporte:', report);

    // Solo procesar reportes de viajes con cantidad de m³
    if (report.reportType !== 'Viajes' || !report.cantidadM3 || report.cantidadM3 <= 0) {
      return { exito: false, mensaje: 'Reporte no aplica para inventario' };
    }

    const esOrigenAcopio = isAcopio(report.origin || '');
    const esDestinoAcopio = isAcopio(report.destination || '');
    
    console.log('Origen es acopio:', esOrigenAcopio);
    console.log('Destino es acopio:', esDestinoAcopio);

    // Determinar el material a procesar
    const material = report.description || 'Material sin especificar';

    if (esDestinoAcopio && !esOrigenAcopio) {
      // ENTRADA: El destino es acopio
      console.log('→ Procesando ENTRADA al acopio');
      return procesarEntrada(
        material,
        report.cantidadM3,
        report.origin || 'Origen no especificado',
        report.id,
        report.machineId,
        report.machineName,
        report.userName
      );
    } else if (esOrigenAcopio && !esDestinoAcopio) {
      // SALIDA: El origen es acopio
      console.log('→ Procesando SALIDA del acopio');
      return procesarSalida(
        material,
        report.cantidadM3,
        report.destination || 'Destino no especificado',
        report.id,
        report.machineId,
        report.machineName,
        report.userName
      );
    } else {
      console.log('→ No aplica para inventario (ni entrada ni salida válida)');
      return { exito: false, mensaje: 'El reporte no representa movimiento de inventario válido' };
    }
  }, [procesarEntrada, procesarSalida]);

  return {
    procesarReporteInventario
  };
};
