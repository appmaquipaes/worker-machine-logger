
import { Report } from '@/types/report';
import { createVenta, createDetalleVenta, DetalleVenta } from '@/models/Ventas';
import { useVentaCalculations } from '@/hooks/useVentaCalculations';
import { useTarifasCalculation } from '@/hooks/useTarifasCalculation';
import { loadTarifasCliente } from '@/models/TarifasCliente';

export const useVentaCreation = () => {
  const { 
    extractClienteFromDestination, 
    extractFincaFromDestination,
    determinarTipoVenta 
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

      // Determinar tipo de venta y actividad generadora
      const tipoVenta = determinarTipoVenta(report);
      const actividadGeneradora = getActividadGeneradora(report);
      
      console.log('📋 Datos de venta:', {
        cliente,
        destino,
        tipoVenta,
        actividadGeneradora
      });

      // Crear venta base
      const ventaBase = createVenta(
        report.reportDate,
        cliente,
        'Villavicencio', // Ciudad por defecto
        tipoVenta,
        report.origin || 'Origen no especificado',
        destino,
        'Crédito', // Forma de pago por defecto
        `Venta automática generada desde reporte ${report.reportType} - ${report.machineName}`,
        actividadGeneradora
      );

      // Crear detalles de venta
      const detalles: DetalleVenta[] = [];
      
      if (report.reportType === 'Horas Trabajadas') {
        // Para horas trabajadas
        const horas = report.hours || 0;
        const valorHora = report.value || 0;
        
        const detalleHoras = createDetalleVenta(
          'Flete',
          `Alquiler ${report.machineName} - ${horas} horas`,
          horas,
          valorHora,
        );
        detalles.push(detalleHoras);
        
      } else if (report.reportType === 'Viajes') {
        // Para viajes con material
        if (report.cantidadM3 && report.cantidadM3 > 0) {
          // Buscar tarifa del cliente
          const tarifas = loadTarifasCliente();
          const tarifaCliente = tarifas.find(t => 
            t.cliente === cliente && 
            t.tipo_material === report.description
          );
          
          let valorUnitario = 0;
          
          if (tarifaCliente) {
            valorUnitario = tarifaCliente.valor_material_cliente_m3 || 0;
            console.log('💰 Tarifa encontrada:', valorUnitario);
          } else {
            // Calcular tarifa automáticamente
            const tarifaCalculada = calcularTarifa(
              report.description || 'Material',
              report.origin || '',
              destino,
              report.cantidadM3
            );
            valorUnitario = tarifaCalculada.precio_venta_total / report.cantidadM3;
            console.log('🧮 Tarifa calculada:', valorUnitario);
          }
          
          const detalleMaterial = createDetalleVenta(
            'Material',
            `${report.description} - ${report.cantidadM3} m³`,
            report.cantidadM3,
            valorUnitario
          );
          detalles.push(detalleMaterial);
        }
        
        // Agregar flete si aplica
        const viajes = report.trips || 1;
        if (viajes > 0) {
          const detalleFlete = createDetalleVenta(
            'Flete',
            `Transporte ${report.machineName} - ${viajes} viajes`,
            viajes,
            report.value || 0
          );
          detalles.push(detalleFlete);
        }
      }

      // Asignar detalles y calcular total
      ventaBase.detalles = detalles;
      ventaBase.total_venta = detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
      
      console.log('✅ Venta creada:', ventaBase);
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
      case 'Viajes':
        if (maquina.toLowerCase().includes('cargador')) {
          return `Carga y transporte - ${maquina}`;
        } else if (maquina.toLowerCase().includes('volqueta') || maquina.toLowerCase().includes('camión')) {
          return `Transporte material - ${maquina}`;
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
