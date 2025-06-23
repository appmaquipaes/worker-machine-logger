
import { Report } from '@/types/report';
import { ResultadoOperacionInventario } from '@/types/inventario';
import { esAcopio, esCargador } from './inventarioDetection';
import { procesarEntradaInventario, procesarSalidaInventario } from './inventarioProcessing';

// Detectar y procesar automáticamente según el reporte (MEJORADA CON LÓGICA DE CARGADOR)
export const procesarReporteInventario = (report: Report): ResultadoOperacionInventario => {
  console.log('=== PROCESANDO REPORTE PARA INVENTARIO ===');
  console.log('🚛 Reporte completo:', report);
  console.log('📋 Tipo reporte:', report.reportType);
  console.log('📍 Origen:', report.origin);
  console.log('📍 Destino:', report.destination);
  console.log('📦 Cantidad M3:', report.cantidadM3);
  console.log('🔨 Material:', report.description);
  console.log('🚜 Máquina:', report.machineName);

  // Solo procesar reportes de viajes y entregas de material con cantidad de m³
  if ((report.reportType !== 'Viajes' && report.reportType !== 'Entrega Material') || !report.cantidadM3 || report.cantidadM3 <= 0) {
    console.log('⚠️ Reporte no aplica para inventario (no es viaje/entrega o sin cantidad)');
    return { exito: false, mensaje: 'Reporte no aplica para inventario' };
  }

  const esOrigenAcopio = esAcopio(report.origin);
  const esDestinoAcopio = esAcopio(report.destination);
  const esMaquinaCargador = esCargador(report.machineName);
  
  console.log('🔍 Análisis detallado de ubicaciones y máquina:');
  console.log('- Origen original:', report.origin);
  console.log('- Destino original:', report.destination);
  console.log('- ¿Origen es acopio?:', esOrigenAcopio);
  console.log('- ¿Destino es acopio?:', esDestinoAcopio);
  console.log('- ¿Es cargador?:', esMaquinaCargador);

  // Determinar el material a procesar
  const material = report.description || 'Material sin especificar';
  console.log('📦 Material a procesar:', material);

  // NUEVA LÓGICA: Solo cargadores pueden descontar inventario
  if (esOrigenAcopio && !esDestinoAcopio) {
    // SALIDA: El origen es acopio, pero solo si es un cargador
    if (esMaquinaCargador) {
      console.log('✅ CARGADOR procesando SALIDA del acopio');
      console.log('📤 Parámetros de salida confirmados:');
      console.log('- Material:', material);
      console.log('- Cantidad:', report.cantidadM3);
      console.log('- Destino:', report.destination);
      
      const resultado = procesarSalidaInventario(
        material,
        report.cantidadM3,
        report.destination || 'Destino no especificado',
        report.id,
        report.machineId,
        report.machineName,
        report.userName
      );
      
      console.log('📋 Resultado del procesamiento de salida:', resultado);
      return resultado;
    } else {
      console.log('⚠️ VOLQUETA u otra máquina desde acopio - NO descontar inventario');
      console.log('- Motivo: Solo los cargadores pueden descontar inventario');
      console.log('- Máquina actual:', report.machineName);
      return { 
        exito: false, 
        mensaje: 'Solo los cargadores pueden descontar del inventario' 
      };
    }
  } else if (esDestinoAcopio && !esOrigenAcopio) {
    // ENTRADA: El destino es acopio (cualquier máquina puede agregar)
    console.log('➡️ Procesando ENTRADA al acopio');
    return procesarEntradaInventario(
      material,
      report.cantidadM3,
      report.origin || 'Origen no especificado',
      report.id,
      report.machineId,
      report.machineName,
      report.userName
    );
  } else {
    console.log('⚠️ No aplica para inventario:');
    console.log('- Motivo: No representa movimiento de inventario válido');
    console.log('- Es origen acopio:', esOrigenAcopio);
    console.log('- Es destino acopio:', esDestinoAcopio);
    console.log('- Es cargador:', esMaquinaCargador);
    return { exito: false, mensaje: 'El reporte no representa movimiento de inventario válido' };
  }
};
