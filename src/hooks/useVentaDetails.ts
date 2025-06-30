
import { Report } from '@/types/report';
import { DetalleVenta, createDetalleVenta } from '@/models/Ventas';
import { loadTarifasCliente } from '@/models/TarifasCliente';
import { useTarifasCalculation } from '@/hooks/useTarifasCalculation';
import { getValorPorHoraPorDefecto, getValorFleteDefecto, getValorServicioDefecto } from '@/utils/ventaPricing';

export const useVentaDetails = () => {
  const { calcularTarifa } = useTarifasCalculation();

  const crearDetallesVenta = (report: Report, cliente: string, destino: string): DetalleVenta[] => {
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

    return detalles;
  };

  return {
    crearDetallesVenta
  };
};
