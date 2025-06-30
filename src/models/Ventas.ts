
// Main Ventas model - re-exports for backward compatibility
export type { Venta, DetalleVenta } from '@/types/venta';

export { 
  tiposVenta, 
  formasPago, 
  origenesMaterial 
} from '@/constants/ventaConstants';

export { 
  createVenta, 
  createDetalleVenta 
} from '@/utils/ventaFactory';

export { 
  calculateVentaTotal, 
  updateVentaTotal 
} from '@/utils/ventaCalculations';

export { 
  determinarTipoVentaPorActividad 
} from '@/utils/ventaTypeMapping';

export { 
  saveVentas, 
  loadVentas 
} from '@/utils/ventaStorage';
