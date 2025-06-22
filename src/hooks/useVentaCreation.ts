
import { Report } from '@/types/report';
import { Venta } from '@/models/Ventas';
import { useVentaValidation } from './useVentaValidation';
import { useVentaBaseCreation } from './useVentaBaseCreation';

export const useVentaCreation = () => {
  const { validateReportType, validateClienteExists, extractClienteInfo } = useVentaValidation();
  const { createBaseVenta, finalizeVenta } = useVentaBaseCreation();

  const crearVentaAutomatica = (report: Report): Venta | null => {
    try {
      console.log('🔄 Creando venta automática con lógica ampliada');
      console.log('📋 Reporte:', {
        machine: report.machineName,
        tipo: report.reportType,
        origen: report.origin,
        destino: report.destination,
        cantidad: report.cantidadM3,
        horas: report.hours,
        workSite: report.workSite
      });

      // Validar tipo de reporte
      if (!validateReportType(report.reportType)) {
        console.log('❌ Tipo de reporte no válido para venta automática');
        return null;
      }

      // Extraer información del cliente
      const { cliente } = extractClienteInfo(report);
      
      // Validar que el cliente existe
      const clienteData = validateClienteExists(cliente);
      if (!clienteData) {
        return null;
      }

      // Crear venta base
      const nuevaVenta = createBaseVenta(report, clienteData);
      
      // Finalizar venta con detalles y cálculos
      return finalizeVenta(nuevaVenta, report);

    } catch (error) {
      console.error('❌ Error creando venta automática:', error);
      return null;
    }
  };

  return {
    crearVentaAutomatica
  };
};
