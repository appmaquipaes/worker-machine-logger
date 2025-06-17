
import { useVentaCalculations } from './useVentaCalculations';
import { useVentaCreation } from './useVentaCreation';
import { useVentaProcessing } from './useVentaProcessing';

export const useAutoVentas = () => {
  const {
    extractClienteFromDestination,
    extractFincaFromDestination,
    determinarTipoVenta
  } = useVentaCalculations();

  const { crearVentaAutomatica } = useVentaCreation();
  const { procesarReporteParaVenta } = useVentaProcessing();

  return {
    procesarReporteParaVenta,
    crearVentaAutomatica,
    determinarTipoVenta,
    extractClienteFromDestination,
    extractFincaFromDestination
  };
};
