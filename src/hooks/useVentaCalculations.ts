
import { Report } from '@/types/report';
import { getPrecioVentaMaterial } from '@/models/Materiales';
import { loadTarifas } from '@/models/Tarifas';

export const useVentaCalculations = () => {
  
  const extractClienteFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[0] || '';
  };

  const extractFincaFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[1] || '';
  };

  const determinarTipoVenta = (report: Report): 'Solo material' | 'Solo transporte' | 'Material + transporte' => {
    // Si es recepción de escombrera, es "Solo transporte" (servicio de recepción)
    if (report.reportType === 'Recepción Escombrera') {
      return 'Solo transporte';
    }
    
    // Cargador siempre es "Solo material" desde Acopio
    if (report.machineName.toLowerCase().includes('cargador')) {
      return 'Solo material';
    }
    
    // Volquetas desde Acopio es "Material + transporte"
    if (report.origin && report.origin.toLowerCase().includes('acopio')) {
      return 'Material + transporte';
    }
    
    // Volquetas desde otros orígenes es "Solo transporte"
    return 'Solo transporte';
  };

  const extraerTipoMaterial = (report: Report): string => {
    // Intentar extraer de la descripción
    if (report.description) {
      const materialPatterns = {
        'Arena': /arena/i,
        'Recebo': /recebo/i,
        'Gravilla': /gravilla/i,
        'Material': /material/i
      };
      
      for (const [material, pattern] of Object.entries(materialPatterns)) {
        if (pattern.test(report.description)) {
          return material;
        }
      }
    }
    
    // Si es desde acopio, asumir material genérico
    if (report.origin?.toLowerCase().includes('acopio')) {
      return 'Material';
    }
    
    return 'Material'; // Por defecto
  };

  const calcularPrecioMaterial = (tipoMaterial: string): number => {
    return getPrecioVentaMaterial(tipoMaterial);
  };

  const calcularPrecioFlete = (report: Report, cantidad: number): number => {
    const tarifas = loadTarifas();
    const tarifaFlete = tarifas.find(t => 
      t.origen.toLowerCase() === (report.origin || '').toLowerCase() &&
      t.destino.toLowerCase() === (report.destination || '').toLowerCase()
    );

    let precioFlete = 0;
    if (tarifaFlete) {
      precioFlete = tarifaFlete.valor_por_m3;
    } else if (report.value) {
      // Si no hay tarifa pero el reporte tiene valor, usar ese valor
      precioFlete = cantidad > 0 ? report.value / cantidad : 0;
    }

    return precioFlete;
  };

  return {
    extractClienteFromDestination,
    extractFincaFromDestination,
    determinarTipoVenta,
    extraerTipoMaterial,
    calcularPrecioMaterial,
    calcularPrecioFlete
  };
};
