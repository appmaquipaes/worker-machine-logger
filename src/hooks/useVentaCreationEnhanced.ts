
import { Report } from '@/types/report';
import { Venta, createVenta, createDetalleVenta, updateVentaTotal } from '@/models/Ventas';
import { getClienteByName } from '@/models/Clientes';
import { useVentaCalculations } from './useVentaCalculations';
import { useOperacionesComerciales } from './useOperacionesComerciales';

export const useVentaCreationEnhanced = () => {
  const {
    extractClienteFromDestination,
    extraerTipoMaterial,
    calcularPrecioMaterial,
    calcularPrecioFlete
  } = useVentaCalculations();

  const { obtenerOperacionPorId } = useOperacionesComerciales();

  const crearVentaDesdeOperacion = (report: Report, operacionId: string): Venta | null => {
    try {
      // Obtener la operación completa
      const operacion = obtenerOperacionPorId(operacionId);
      if (!operacion) {
        console.log('No se encontró la operación:', operacionId);
        return null;
      }

      console.log('=== CREANDO VENTA DESDE OPERACIÓN ===');
      console.log('Operación:', operacion);

      const cliente = operacion.cliente;
      
      // Verificar que el cliente existe
      const clienteData = getClienteByName(cliente);
      if (!clienteData) {
        console.log('Cliente no encontrado en la base de datos:', cliente);
        return null;
      }

      const tipoMaterial = operacion.material;
      const cantidad = operacion.cantidad_total || 0;
      
      if (cantidad <= 0) {
        console.log('Cantidad inválida para la venta');
        return null;
      }

      // Determinar tipo de venta basado en la operación
      let tipoVenta: 'Solo material' | 'Solo transporte' | 'Material + transporte' = 'Solo transporte';
      
      if (operacion.tipo_operacion === 'Acopio' && operacion.reportes_asociados.length >= 2) {
        tipoVenta = 'Material + transporte'; // Cargador + Volqueta
      } else if (operacion.tipo_operacion === 'Acopio') {
        tipoVenta = 'Solo material'; // Solo cargador por ahora
      } else {
        tipoVenta = 'Solo transporte'; // Desde cantera/proveedor
      }

      // Crear la venta base
      let nuevaVenta = createVenta(
        report.reportDate,
        cliente,
        clienteData.ciudad,
        tipoVenta,
        report.origin || '',
        report.destination || '',
        'Efectivo',
        `Venta automática - Operación ${operacionId} (${operacion.reportes_asociados.length} reportes)`
      );

      const detalles = [];

      // Agregar detalles según el tipo de venta
      if (tipoVenta === 'Solo material' || tipoVenta === 'Material + transporte') {
        // MEJORA: Usar proveedorId del reporte para calcular precio específico
        const precioMaterial = calcularPrecioMaterial(tipoMaterial, report.proveedorId);
        if (precioMaterial > 0) {
          const detalleMaterial = createDetalleVenta(
            'Material',
            tipoMaterial,
            cantidad,
            precioMaterial
          );
          detalles.push(detalleMaterial);
          
          console.log('💰 Precio material calculado:', {
            material: tipoMaterial,
            proveedor: report.proveedorNombre || 'Genérico',
            precio: precioMaterial
          });
        }
      }

      if (tipoVenta === 'Solo transporte' || tipoVenta === 'Material + transporte') {
        const precioFlete = calcularPrecioFlete(report, cantidad);
        if (precioFlete > 0) {
          const detalleFlete = createDetalleVenta(
            'Flete',
            `Transporte ${report.origin} → ${report.destination}`,
            cantidad,
            precioFlete
          );
          detalles.push(detalleFlete);
        }
      }

      // Agregar detalles y calcular total
      nuevaVenta.detalles = detalles;
      nuevaVenta = updateVentaTotal(nuevaVenta);

      if (nuevaVenta.total_venta > 0) {
        console.log('✓ Venta creada exitosamente:', {
          cliente,
          tipo: tipoVenta,
          total: nuevaVenta.total_venta,
          detalles: detalles.length,
          operacionId,
          proveedorUsado: report.proveedorNombre || 'No específico'
        });
        
        return nuevaVenta;
      }

      return null;
    } catch (error) {
      console.error('Error creando venta desde operación:', error);
      return null;
    }
  };

  return {
    crearVentaDesdeOperacion
  };
};
