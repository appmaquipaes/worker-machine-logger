
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

  const { obtenerReportesDeOperacion } = useOperacionesComerciales();

  const crearVentaDesdeOperacion = (report: Report, operacionId: string): Venta | null => {
    try {
      // Obtener todos los reportes de la operación
      const reportesIds = obtenerReportesDeOperacion(operacionId);
      
      console.log('=== CREANDO VENTA DESDE OPERACIÓN ===');
      console.log('Operación ID:', operacionId);
      console.log('Reportes asociados:', reportesIds);

      const cliente = extractClienteFromDestination(report.destination || '');
      if (!cliente) {
        console.log('No se pudo extraer cliente del reporte');
        return null;
      }

      // Verificar que el cliente existe
      const clienteData = getClienteByName(cliente);
      if (!clienteData) {
        console.log('Cliente no encontrado en la base de datos:', cliente);
        return null;
      }

      const tipoMaterial = extraerTipoMaterial(report);
      const cantidad = report.cantidadM3 || 0;
      
      if (cantidad <= 0) {
        console.log('Cantidad inválida para la venta');
        return null;
      }

      // Crear la venta base
      let nuevaVenta = createVenta(
        report.reportDate,
        cliente,
        clienteData.ciudad,
        'Material + transporte', // Siempre será completa cuando hay operaciones múltiples
        report.origin || '',
        report.destination || '',
        'Efectivo',
        `Venta automática - Operación ${operacionId}`
      );

      const detalles = [];

      // Si es operación desde Acopio (múltiples reportes), agregar Material + Flete
      if (reportesIds.length >= 2 || report.origin?.toLowerCase().includes('acopio')) {
        // Detalle de Material
        const precioMaterial = calcularPrecioMaterial(tipoMaterial);
        if (precioMaterial > 0) {
          const detalleMaterial = createDetalleVenta(
            'Material',
            tipoMaterial,
            cantidad,
            precioMaterial
          );
          detalles.push(detalleMaterial);
        }

        // Detalle de Flete
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
      } else {
        // Operación desde cantera/proveedor - solo flete
        const precioFlete = calcularPrecioFlete(report, cantidad);
        if (precioFlete > 0) {
          const detalleFlete = createDetalleVenta(
            'Flete',
            `Transporte ${report.origin} → ${report.destination}`,
            cantidad,
            precioFlete
          );
          detalles.push(detalleFlete);
          nuevaVenta.tipo_venta = 'Solo transporte';
        }
      }

      // Agregar detalles y calcular total
      nuevaVenta.detalles = detalles;
      nuevaVenta = updateVentaTotal(nuevaVenta);

      if (nuevaVenta.total_venta > 0) {
        console.log('✓ Venta creada exitosamente:', {
          cliente,
          total: nuevaVenta.total_venta,
          detalles: detalles.length,
          operacionId
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
