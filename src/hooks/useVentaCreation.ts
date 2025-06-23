
import { Report } from '@/types/report';
import { Venta, createVenta, createDetalleVenta, updateVentaTotal } from '@/models/Ventas';
import { findTarifaCliente, findTarifaEscombrera } from '@/models/TarifasCliente';
import { extractClienteFromDestination, extractFincaFromDestination } from '@/utils/reportUtils';

export const useVentaCreation = () => {
  const crearVentaAutomatica = (report: Report): Venta | null => {
    console.log('🔄 Iniciando creación de venta automática para reporte:', report);
    
    try {
      // Determinar cliente y finca según el tipo de reporte
      let cliente = '';
      let finca = '';
      let tipoVenta: 'Solo material' | 'Solo transporte' | 'Material + transporte' = 'Material + transporte';
      let origenMaterial = '';
      let destinoMaterial = '';

      if (report.reportType === 'Viajes') {
        cliente = extractClienteFromDestination(report.destination || '');
        finca = extractFincaFromDestination(report.destination || '');
        origenMaterial = report.origin || 'No especificado';
        destinoMaterial = report.destination || 'No especificado';
        
        // Determinar tipo de venta basado en origen
        if (report.origin?.toLowerCase().includes('acopio')) {
          tipoVenta = 'Material + transporte';
        } else {
          tipoVenta = 'Solo transporte';
        }
      } else if (report.reportType === 'Horas Trabajadas') {
        cliente = report.workSite || 'Cliente no especificado';
        finca = 'N/A';
        tipoVenta = 'Solo transporte'; // Horas trabajadas es servicio de transporte
        origenMaterial = 'Servicio de maquinaria';
        destinoMaterial = cliente;
      } else if (report.reportType === 'Recepción Escombrera') {
        cliente = report.clienteEscombrera || 'Cliente no especificado';
        finca = 'N/A';
        tipoVenta = 'Solo transporte';
        origenMaterial = 'Escombrera MAQUIPAES';
        destinoMaterial = cliente;
      }

      if (!cliente || cliente === 'Cliente no especificado') {
        console.log('⚠️ No se puede crear venta sin cliente válido');
        return null;
      }

      console.log('📋 Datos de venta a crear:');
      console.log('- Cliente:', cliente);
      console.log('- Finca:', finca);
      console.log('- Tipo venta:', tipoVenta);
      console.log('- Origen:', origenMaterial);
      console.log('- Destino:', destinoMaterial);

      // Crear la venta base
      const nuevaVenta = createVenta(
        report.reportDate,
        cliente,
        finca || 'No especificada',
        tipoVenta,
        origenMaterial,
        destinoMaterial,
        'Crédito', // Forma de pago por defecto
        `Venta automática generada desde reporte de ${report.machineName} - ${report.reportType}`
      );

      // Crear detalles según el tipo de reporte
      if (report.reportType === 'Viajes' && report.cantidadM3) {
        // Buscar tarifa específica
        const tarifa = findTarifaCliente(cliente, finca, origenMaterial, destinoMaterial);
        
        if (tarifa) {
          console.log('💰 Tarifa encontrada:', tarifa);
          
          // Agregar detalle de material si aplica
          if (tarifa.valor_material_cliente_m3 && report.origin?.toLowerCase().includes('acopio')) {
            const detalleMaterial = createDetalleVenta(
              'Material',
              report.description || 'Material no especificado',
              report.cantidadM3,
              tarifa.valor_material_cliente_m3
            );
            nuevaVenta.detalles.push(detalleMaterial);
          }
          
          // Agregar detalle de flete
          if (tarifa.valor_flete_m3) {
            const detalleFlete = createDetalleVenta(
              'Flete',
              `Transporte ${report.machineName}`,
              report.cantidadM3,
              tarifa.valor_flete_m3
            );
            nuevaVenta.detalles.push(detalleFlete);
          }
        } else {
          console.log('⚠️ No se encontró tarifa específica, usando valores del reporte');
          
          // Usar valor calculado del reporte
          const valorUnitario = report.value && report.cantidadM3 
            ? report.value / report.cantidadM3 
            : 0;
          
          if (valorUnitario > 0) {
            const detalleGenerico = createDetalleVenta(
              tipoVenta === 'Solo transporte' ? 'Flete' : 'Material',
              report.description || 'Servicio de transporte',
              report.cantidadM3,
              valorUnitario
            );
            nuevaVenta.detalles.push(detalleGenerico);
          }
        }
      } else if (report.reportType === 'Horas Trabajadas' && report.hours) {
        // Para horas trabajadas, crear detalle de servicio
        const valorPorHora = report.value && report.hours ? report.value / report.hours : 0;
        
        if (valorPorHora > 0) {
          const detalleHoras = createDetalleVenta(
            'Flete',
            `Servicio de ${report.machineName} - ${report.hours} horas`,
            report.hours,
            valorPorHora
          );
          nuevaVenta.detalles.push(detalleHoras);
        }
      } else if (report.reportType === 'Recepción Escombrera' && report.cantidadVolquetas) {
        // Para escombrera
        const tarifa = findTarifaEscombrera(cliente, 'escombrera_maquipaes', finca);
        
        if (tarifa) {
          const valorPorVolqueta = report.tipoVolqueta === 'Doble Troque' 
            ? tarifa.valor_volqueta_doble_troque || 0
            : tarifa.valor_volqueta_sencilla || 0;
          
          if (valorPorVolqueta > 0) {
            const detalleEscombrera = createDetalleVenta(
              'Flete',
              `Recepción escombrera - ${report.cantidadVolquetas} volquetas ${report.tipoVolqueta}`,
              report.cantidadVolquetas,
              valorPorVolqueta
            );
            nuevaVenta.detalles.push(detalleEscombrera);
          }
        }
      }

      // Actualizar total de la venta
      const ventaFinal = updateVentaTotal(nuevaVenta);
      
      console.log('✅ Venta automática creada:', ventaFinal);
      return ventaFinal;
      
    } catch (error) {
      console.error('❌ Error creando venta automática:', error);
      return null;
    }
  };

  return {
    crearVentaAutomatica
  };
};
