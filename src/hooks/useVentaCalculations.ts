
import { Report } from '@/types/report';
import { getPrecioVentaMaterial } from '@/models/Materiales';
import { loadTarifas } from '@/models/Tarifas';
import { loadProductosProveedores } from '@/models/Proveedores';
import { findTarifaCliente } from '@/models/TarifasCliente';

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
        'Material': /material/i,
        'Triturado': /triturado/i
      };
      
      for (const [material, pattern] of Object.entries(materialPatterns)) {
        if (pattern.test(report.description)) {
          console.log('📦 Tipo de material extraído de descripción:', material);
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

  const calcularPrecioMaterial = (tipoMaterial: string, proveedorId?: string, clienteNombre?: string, finca?: string, origen?: string): number => {
    console.log('🔍 Calculando precio material:', { tipoMaterial, proveedorId, clienteNombre, finca, origen });
    
    // 1. PRIORIDAD MÁXIMA: Tarifa específica del cliente
    if (clienteNombre && origen) {
      console.log('🎯 Buscando tarifa específica del cliente...');
      const tarifaCliente = findTarifaCliente(clienteNombre, finca, origen, `${clienteNombre} - ${finca || ''}`);
      
      if (tarifaCliente && tarifaCliente.valor_material_cliente_m3 && tarifaCliente.valor_material_cliente_m3 > 0) {
        console.log('✅ Precio específico de cliente encontrado:', tarifaCliente.valor_material_cliente_m3);
        console.log('📋 Tarifa utilizada:', tarifaCliente);
        return tarifaCliente.valor_material_cliente_m3;
      } else {
        console.log('⚠️ No se encontró tarifa específica del cliente');
      }
    }
    
    // 2. SEGUNDA PRIORIDAD: Precio específico del proveedor
    if (proveedorId) {
      console.log('🏭 Buscando precio específico del proveedor...');
      const productosProveedores = loadProductosProveedores();
      const productoProveedor = productosProveedores.find(producto => 
        producto.proveedor_id === proveedorId && 
        producto.tipo_insumo === 'Material' &&
        producto.nombre_producto.toLowerCase().includes(tipoMaterial.toLowerCase())
      );
      
      if (productoProveedor && productoProveedor.precio_unitario > 0) {
        console.log('✅ Precio específico de proveedor encontrado:', productoProveedor.precio_unitario);
        console.log('📋 Producto utilizado:', productoProveedor);
        return productoProveedor.precio_unitario;
      } else {
        console.log('⚠️ No se encontró precio específico del proveedor para:', tipoMaterial);
      }
    }
    
    // 3. FALLBACK: Precio genérico de materiales
    const precioGenerico = getPrecioVentaMaterial(tipoMaterial);
    console.log('📋 Usando precio genérico como fallback:', precioGenerico);
    console.log('⚠️ RECOMENDACIÓN: Configurar tarifa específica para el cliente para mejores precios');
    
    return precioGenerico;
  };

  const calcularPrecioFlete = (report: Report, cantidad: number, clienteNombre?: string, finca?: string): number => {
    console.log('🚚 Calculando precio de flete:', { clienteNombre, finca, origen: report.origin, destino: report.destination });
    
    // 1. PRIORIDAD: Tarifa específica del cliente
    if (clienteNombre && report.origin && report.destination) {
      console.log('🎯 Buscando tarifa de flete específica del cliente...');
      const tarifaCliente = findTarifaCliente(clienteNombre, finca, report.origin, report.destination);
      
      if (tarifaCliente && tarifaCliente.valor_flete_m3 && tarifaCliente.valor_flete_m3 > 0) {
        console.log('✅ Tarifa de flete específica encontrada:', tarifaCliente.valor_flete_m3);
        console.log('📋 Tarifa utilizada:', tarifaCliente);
        return tarifaCliente.valor_flete_m3;
      } else {
        console.log('⚠️ No se encontró tarifa de flete específica del cliente');
      }
    }
    
    // 2. FALLBACK: Tarifas genéricas
    const tarifas = loadTarifas();
    const tarifaFlete = tarifas.find(t => 
      t.origen.toLowerCase() === (report.origin || '').toLowerCase() &&
      t.destino.toLowerCase() === (report.destination || '').toLowerCase()
    );

    let precioFlete = 0;
    if (tarifaFlete) {
      precioFlete = tarifaFlete.valor_por_m3;
      console.log('📋 Usando tarifa genérica de flete:', precioFlete);
    } else if (report.value) {
      // Si no hay tarifa pero el reporte tiene valor, usar ese valor
      precioFlete = cantidad > 0 ? report.value / cantidad : 0;
      console.log('📋 Usando valor del reporte como flete:', precioFlete);
    } else {
      console.log('⚠️ No se encontró tarifa de flete - valor será 0');
      console.log('⚠️ RECOMENDACIÓN: Configurar tarifa de flete para esta ruta');
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
