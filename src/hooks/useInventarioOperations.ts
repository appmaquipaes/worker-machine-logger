
import { useInventarioValidation } from './useInventarioValidation';
import { useInventarioMovimientos } from './useInventarioMovimientos';
import { useInventarioEntradas } from './useInventarioEntradas';
import { useInventarioSalidas } from './useInventarioSalidas';
import { useInventarioReportes } from './useInventarioReportes';
import { isAcopio } from '@/constants/inventario';

export const useInventarioOperations = () => {
  const { validarOperacion } = useInventarioValidation();
  const { saveMovimiento, loadMovimientos } = useInventarioMovimientos();
  const { procesarEntrada, isProcessing: isProcessingEntrada } = useInventarioEntradas();
  const { procesarSalida, isProcessing: isProcessingSalida } = useInventarioSalidas();
  const { procesarReporteInventario } = useInventarioReportes();

  const isProcessing = isProcessingEntrada || isProcessingSalida;

  return {
    // Estados
    isProcessing,
    
    // Funciones principales
    procesarEntrada,
    procesarSalida,
    procesarReporteInventario,
    validarOperacion,
    
    // Funciones de utilidad
    loadMovimientos,
    saveMovimiento,
    
    // Funciones auxiliares
    isAcopio
  };
};
