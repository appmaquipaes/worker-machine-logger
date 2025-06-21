
import { useState } from 'react';
import { validarOperacionInventario } from '@/utils/inventarioValidation';
import { 
  procesarEntradaInventario, 
  procesarSalidaInventario, 
  loadMovimientosInventario, 
  saveMovimientoInventario 
} from '@/utils/inventarioProcessing';
import { procesarReporteInventario } from '@/utils/inventarioReportProcessor';
import { esAcopio, esCargador } from '@/utils/inventarioDetection';

export const useInventarioOperations = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Wrapper para procesar entrada con estado de loading
  const procesarEntrada = async (
    material: string,
    cantidad: number,
    origen: string,
    reporteId?: string,
    maquinaId?: string,
    maquinaNombre?: string,
    usuario?: string
  ) => {
    setIsProcessing(true);
    try {
      return procesarEntradaInventario(material, cantidad, origen, reporteId, maquinaId, maquinaNombre, usuario);
    } finally {
      setIsProcessing(false);
    }
  };

  // Wrapper para procesar salida con estado de loading
  const procesarSalida = async (
    material: string,
    cantidad: number,
    destino: string,
    reporteId?: string,
    maquinaId?: string,
    maquinaNombre?: string,
    usuario?: string
  ) => {
    setIsProcessing(true);
    try {
      return procesarSalidaInventario(material, cantidad, destino, reporteId, maquinaId, maquinaNombre, usuario);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    // Estados
    isProcessing,
    
    // Funciones principales
    procesarEntrada,
    procesarSalida,
    procesarReporteInventario,
    validarOperacion: validarOperacionInventario,
    
    // Funciones de utilidad
    loadMovimientos: loadMovimientosInventario,
    saveMovimiento: saveMovimientoInventario,
    
    // Funciones auxiliares
    isAcopio: esAcopio,
    esCargador
  };
};
