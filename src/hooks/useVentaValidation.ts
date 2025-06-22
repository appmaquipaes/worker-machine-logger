
import { Report } from '@/types/report';
import { getClienteByName } from '@/models/Clientes';

export const useVentaValidation = () => {
  const validateReportType = (reportType: string): boolean => {
    const tiposValidos = ['Viajes', 'Recepción Escombrera', 'Horas Trabajadas', 'Horas Extras'];
    return tiposValidos.includes(reportType);
  };

  const validateClienteExists = (cliente: string) => {
    if (!cliente) {
      console.log('❌ No se pudo extraer cliente del reporte');
      return null;
    }

    const clienteData = getClienteByName(cliente);
    if (!clienteData) {
      console.log('❌ Cliente no encontrado en la base de datos:', cliente);
      return null;
    }

    console.log('✅ Cliente encontrado:', clienteData);
    return clienteData;
  };

  const extractClienteInfo = (report: Report): { cliente: string; destino: string } => {
    let cliente = '';
    let destino = '';
    
    if (report.reportType === 'Recepción Escombrera') {
      cliente = report.clienteEscombrera || report.destination || '';
      destino = 'Escombrera MAQUIPAES';
    } else if (report.reportType === 'Horas Trabajadas' || report.reportType === 'Horas Extras') {
      // Para horas trabajadas, extraer cliente del workSite
      cliente = extractClienteFromDestination(report.workSite || '');
      destino = report.workSite || '';
    } else {
      cliente = extractClienteFromDestination(report.destination || '');
      destino = report.destination || '';
    }
    
    console.log('👤 Cliente extraído:', cliente);
    console.log('📍 Destino asignado:', destino);
    
    return { cliente, destino };
  };

  const extractClienteFromDestination = (destination: string): string => {
    if (!destination) return '';
    return destination.split(' - ')[0] || '';
  };

  return {
    validateReportType,
    validateClienteExists,
    extractClienteInfo,
    extractClienteFromDestination
  };
};
