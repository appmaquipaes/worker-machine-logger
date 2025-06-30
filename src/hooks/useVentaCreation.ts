
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
        actividadGeneradora,
        reportValue: report.value,
        reportHours: report.hours
      });

      // Crear venta base
      const ventaBase = createVenta(
        report.reportDate,
        cliente,
        'Villavicencio',
        tipoVenta,
        report.origin || 'Origen no especificado',
        destino,
        'Crédito',
        `Venta automática generada desde reporte ${report.reportType} - ${report.machineName}`,
        actividadGeneradora
      );

      // Agregar campos adicionales
      ventaBase.maquina_utilizada = report.machineName;
      if (report.hours) ventaBase.horas_trabajadas = report.hours;
      if (report.trips) ventaBase.viajes_realizados = report.trips;
      if (report.cantidadM3) ventaBase.cantidad_material_m3 = report.cantidadM3;

      // Crear detalles de venta - CORREGIDO
      const detalles: DetalleVenta[] = [];
      
      if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
        const horas = report.hours || 0;
        let valorPorHora = 0;
        
        // Si viene valor del reporte, usarlo para calcular valor por hora
        if (report.value && report.value > 0) {
          valorPorHora = report.value; // El valor del reporte ya es el valor por hora
          console.log(`💰 Usando valor del reporte: ${valorPorHora} por hora`);
        } else {
          // Si no viene valor del reporte, usar valor por defecto según tipo de máquina
          valorPorHora = getValorPorHoraPorDefecto(report.machineName);
          console.log(`💡 Usando valor por defecto: ${valorPorHora} por hora`);
        }
        
        const valorTotal = valorPorHora * horas;
        
        console.log(`💰 Creando detalle: ${horas} horas x ${valorPorHora} = ${valorTotal}`);
        
        const detalleHoras = createDetalleVenta(
          'Alquiler',
          `${report.reportType} ${report.machineName} - ${horas} horas`,
          horas,
          valorPorHora
        );
        detalles.push(detalleHoras);
        
      } else if (report.reportType === 'Viajes') {
        // Para viajes con material
        if (report.cantidadM3 && report.cantidadM3 > 0) {
          const tarifas = loadTarifasCliente();
          const tarifaCliente = tarifas.find(t => 
            t.cliente === cliente && 
            t.tipo_material === report.description
          );
          
          let valorUnitarioMaterial = 0;
          
          if (tarifaCliente) {
            valorUnitarioMaterial = tarifaCliente.valor_material_cliente_m3 || 0;
          } else {
            const tarifaCalculada = calcularTarifa(
              report.description || 'Material',
              report.origin || '',
              destino,
              report.cantidadM3
            );
            valorUnitarioMaterial = tarifaCalculada.precio_venta_total / report.cantidadM3;
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
        
        // Agregar flete
        const viajes = report.trips || 1;
        let valorFlete = report.value || 0;
        
        if (valorFlete === 0) {
          valorFlete = getValorFleteDefecto(report.machineName, viajes);
        }
        
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
      } else {
        // Para otros tipos de reporte
        let valorServicio = report.value || 0;
        
        if (valorServicio === 0) {
          valorServicio = getValorServicioDefecto(report.reportType, report.machineName);
        }
        
        if (valorServicio > 0) {
          const detalleServicio = createDetalleVenta(
            'Servicio',
            `${report.reportType} ${report.machineName}`,
            1,
            valorServicio
          );
          detalles.push(detalleServicio);
        }
      }

      // Asignar detalles y calcular total
      ventaBase.detalles = detalles;
      ventaBase.total_venta = detalles.reduce((total, detalle) => total + detalle.subtotal, 0);
      
      console.log('✅ Venta creada:', {
        totalDetalles: detalles.length,
        totalVenta: ventaBase.total_venta,
        detalles: detalles.map(d => ({
          producto: d.producto_servicio,
          cantidad: d.cantidad_m3,
          valorUnitario: d.valor_unitario,
          subtotal: d.subtotal
        }))
      });
      
      return ventaBase;
      
    } catch (error) {
      console.error('❌ Error creando venta automática:', error);
      return null;
    }
  };

  // Función para obtener valor por hora por defecto según tipo de máquina
  const getValorPorHoraPorDefecto = (maquina: string): number => {
    const maquinaLower = maquina.toLowerCase();
    
    // Valores por hora según tipo de máquina
    if (maquinaLower.includes('315') || maquinaLower.includes('excavat')) {
      return 80000; // Retroexcavadoras
    } else if (maquinaLower.includes('vibro') || maquinaLower.includes('compact')) {
      return 60000; // Compactadores
    } else if (maquinaLower.includes('bulldozer')) {
      return 100000; // Bulldozers
    } else if (maquinaLower.includes('cargador')) {
      return 70000; // Cargadores
    } else {
      return 50000; // Valor genérico
    }
  };

  // Función para obtener valor de flete por defecto
  const getValorFleteDefecto = (maquina: string, viajes: number): number => {
    const maquinaLower = maquina.toLowerCase();
    
    let valorPorViaje = 0;
    
    if (maquinaLower.includes('volqueta')) {
      valorPorViaje = 50000;
    } else if (maquinaLower.includes('camión')) {
      valorPorViaje = 60000;
    } else {
      valorPorViaje = 40000;
    }
    
    return valorPorViaje * viajes;
  };

  // Función para obtener valor de servicio por defecto
  const getValorServicioDefecto = (tipoReporte: string, maquina: string): number => {
    switch (tipoReporte) {
      case 'Mantenimiento':
        return 200000;
      case 'Combustible':
        return 150000;
      case 'Recepción Escombrera':
        return 100000;
      default:
        return 50000;
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
