
import { Report } from '@/types/report';
import { getPrecioVentaMaterial } from '@/models/Materiales';
import { loadTarifas } from '@/models/Tarifas';
import { loadProductosProveedores } from '@/models/Proveedores';

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
    
    // IMPORTANTE: Cargadores NO generan ventas directas
    // Solo son parte de operaciones que se completan con volquetas
    if (report.machineName.toLowerCase().includes('cargador')) {
      // Los cargadores no deberían llegar aquí en ventas automáticas
      console.log('⚠️ Cargador detectado en venta automática - esto no debería pasar');
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

  const calcularPrecioMaterial = (tipoMaterial: string, proveedorId?: string): number => {
    console.log('🔍 Calculando precio material:', { tipoMaterial, proveedorId });
    
    // Si tenemos proveedor, buscar precio específico del proveedor
    if (proveedorId) {
      const productosProveedores = loadProductosProveedores();
      const productoProveedor = productosProveedores.find(producto => 
        producto.proveedor_id === proveedorId && 
        producto.tipo_insumo === 'Material' &&
        producto.nombre_producto.toLowerCase().includes(tipoMaterial.toLowerCase())
      );
      
      if (productoProveedor && productoProveedor.precio_unitario > 0) {
        console.log('✅ Precio específico de proveedor encontrado:', productoProveedor.precio_unitario);
        return productoProveedor.precio_unitario;
      } else {
        console.log('⚠️ No se encontró precio específico del proveedor para:', tipoMaterial);
      }
    }
    
    // Fallback: usar precio genérico de materiales
    const precioGenerico = getPrecioVentaMaterial(tipoMaterial);
    console.log('📋 Usando precio genérico:', precioGenerico);
    return precioGenerico;
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
