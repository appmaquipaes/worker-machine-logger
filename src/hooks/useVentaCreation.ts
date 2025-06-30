
import { Report } from '@/types/report';
import { createVenta, createDetalleVenta, DetalleVenta, determinarTipoVentaPorActividad } from '@/models/Ventas';
import { useVentaCalculations } from '@/hooks/useVentaCalculations';
import { useTarifasCalculation } from '@/hooks/useTarifasCalculation';
import { loadTarifasCliente } from '@/models/TarifasCliente';

export const useVentaCreation = () => {
  const { 
    extractClienteFromDestination, 
    extractFincaFromDestination 
  } = useVentaCalculations();
  
  const { calcularTarifa } = useTarifasCalculation();

  const crearVentaAutomatica = (report: Report) => {
    console.log('🔥 Creando venta automática desde reporte:', report.reportType, report.machineName);
    
    try {
      // Determinar cliente y destino
      let cliente = '';
      let destino = '';
      
      if (report.reportType === 'Horas Trabajadas') {
        cliente = report.workSite || 'Cliente no especificado';
        destino = `${cliente} - Sitio de trabajo`;
      } else if (report.destination) {
        cliente = extractClienteFromDestination(report.destination);
        const finca = extractFincaFromDestination(report.destination);
        destino = report.destination;
      } else {
        console.log('❌ No se puede determinar cliente/destino');
        return null;
      }

      // Determinar actividad generadora
      const actividadGeneradora = getActividadGeneradora(report);
      
      // Determinar tipo de venta usando la función actualizada
      const tipoVenta = determinarTipoVentaPorActividad(
        actividadGeneradora,
        report.reportType,
        report.machineName
      );
      
      console.log('📋 Datos de venta:', {
        cliente,
        destino,
        tipoVenta,
        actividadGeneradora
      });

      // Crear venta base con forma de pago por defecto para ventas automáticas
      const ventaBase = createVenta(
        report.reportDate,
        cliente,
        'Villavicencio', // Ciudad por defecto
        tipoVenta,
        report.origin || 'Origen no especificado',
        destino,
        'Crédito', // Forma de pago por defecto para ventas automáticas
        `Venta automática generada desde reporte ${report.reportType} - ${report.machineName}`,
        actividadGeneradora
      );

      // Agregar campos adicionales para enriquecer el reporte
      ventaBase.maquina_utilizada = report.machineName;
      if (report.hours) ventaBase.horas_trabajadas = report.hours;
      if (report.trips) ventaBase.viajes_realizados = report.trips;
      if (report.cantidadM3) ventaBase.cantidad_material_m3 = report.cantidadM3;

      // Crear detalles de venta MEJORADOS
      const detalles: DetalleVenta[] = [];
      
      if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
        // Para horas trabajadas - CORREGIDO
        const horas = report.hours || 0;
        const valorTotal = report.value || 0;
        const valorPorHora = horas > 0 ? valorTotal / horas : valorTotal;
        
        const detalleHoras = createDetalleVenta(
          'Alquiler',
          `${report.reportType} ${report.machineName} - ${horas} horas`,
          horas,
          valorPorHora
        );
        detalles.push(detalleHoras);
        
      } else if (report.reportType === 'Viajes') {
        // Para viajes con material - CORREGIDO
        if (report.cantidadM3 && report.cantidadM3 > 0) {
          // Buscar tarifa del cliente
          const tarifas = loadTarifasCliente();
          const tarifaCliente = tarifas.find(t => 
            t.cliente === cliente && 
            t.tipo_material === report.description
          );
          
          let valorUnitarioMaterial = 0;
          
          if (tarifaCliente) {
            valorUnitarioMaterial = tarifaCliente.valor_material_cliente_m3 || 0;
            console.log('💰 Tarifa encontrada:', valorUnitarioMaterial);
          } else {
            // Calcular tarifa automáticamente
            const tarifaCalculada = calcularTarifa(
              report.description || 'Material',
              report.origin || '',
              destino,
              report.cantidadM3
            );
            valorUnitarioMaterial = tarifaCalculada.precio_venta_total / report.cantidadM3;
            console.log('🧮 Tarifa calculada:', valorUnitarioMaterial);
          }
          
          if (valorUnitarioMaterial > 0) {
            const detalleMaterial = createDetalleVenta(
              'Material',
              `${report.description} - ${report.cantidadM3} m³`,
              report.cantidadM3,
              valorUnitarioMaterial
            );
            detalles.push(detalleMaterial);
          }
        }
        
        // Agregar flete si aplica - CORREGIDO
        const viajes = report.trips || 1;
        const valorFlete = report.value || 0;
        if (viajes > 0 && valorFlete > 0) {
          const valorPorViaje = valorFlete / viajes;
          const detalleFlete = createDetalleVenta(
            'Flete',
            `Transporte ${report.machineName} - ${viajes} viajes`,
            viajes,
            valorPorViaje
          );
          detalles.push(detalleFlete);
        }
      } else if (report.reportType === 'Mantenimiento') {
        const valorMantenimiento = report.value || 0;
        if (valorMantenimiento > 0) {
          const detalleMantenimiento = createDetalleVenta(
            'Servicio',
            `Mantenimiento ${report.machineName}`,
            1,
            valorMantenimiento
          );
          detalles.push(detalleMantenimiento);
        }
      } else if (report.reportType === 'Combustible') {
        const valorCombustible = report.value || 0;
        const kilometraje = report.kilometraje || 1;
        if (valorCombustible > 0) {
          const detalleCombustible = createDetalleVenta(
            'Servicio',
            `Combustible ${report.machineName} - ${kilometraje} km`,
            kilometraje,
            valorCombustible / kilometraje
          );
          detalles.push(detalleCombustible);
        }
      }

      // ASEGURAR que siempre haya al menos un detalle si hay valor en el reporte
      if (detalles.length === 0 && report.value && report.value > 0) {
        console.log('🔧 Creando detalle genérico para asegurar que el total no sea cero');
        const detalleGenerico = createDetalleVenta(
          'Servicio',
          `${report.reportType} - ${report.machineName}`,
          1,
          report.value
        );
        detalles.push(detalleGenerico);
      }

      // Asignar detalles y calcular total CORRECTAMENTE
      ventaBase.detalles = detalles;
      ventaBase.total_venta = detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
      
      console.log('✅ Venta creada con detalles:', {
        totalDetalles: detalles.length,
        totalVenta: ventaBase.total_venta,
        formaPago: ventaBase.forma_pago
      });
      
      return ventaBase;
      
    } catch (error) {
      console.error('❌ Error creando venta automática:', error);
      return null;
    }
  };

  const getActividadGeneradora = (report: Report): string => {
    const maquina = report.machineName;
    const tipo = report.reportType;
    
    switch (tipo) {
      case 'Horas Trabajadas':
        return `Alquiler ${maquina}`;
      case 'Horas Extras':
        return `Horas extras ${maquina}`;
      case 'Mantenimiento':
        return `Mantenimiento ${maquina}`;
      case 'Combustible':
        return `Combustible ${maquina}`;
      case 'Viajes':
        if (maquina.toLowerCase().includes('cargador')) {
          return `Carga y transporte - ${maquina}`;
        } else if (maquina.toLowerCase().includes('volqueta') || maquina.toLowerCase().includes('camión')) {
          return `Transporte material - ${maquina}`;
        } else if (maquina.toLowerCase().includes('camabaja')) {
          return `Transporte - ${maquina}`;
        } else {
          return `Transporte - ${maquina}`;
        }
      case 'Recepción Escombrera':
        return `Recepción escombrera - ${maquina}`;
      default:
        return `${tipo} - ${maquina}`;
    }
  };

  return {
    crearVentaAutomatica
  };
};
