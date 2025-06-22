
import { Report } from '@/types/report';
import { getClienteByName, loadClientes } from '@/models/Clientes';

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

    console.log('🔍 Buscando cliente:', cliente);
    
    // Primero búsqueda exacta
    let clienteData = getClienteByName(cliente);
    
    // Si no encuentra, buscar case-insensitive
    if (!clienteData) {
      console.log('🔍 Búsqueda exacta fallida, intentando case-insensitive...');
      const todosClientes = loadClientes();
      clienteData = todosClientes.find(c => 
        c.nombre_cliente.toLowerCase() === cliente.toLowerCase()
      );
      
      if (clienteData) {
        console.log('✅ Cliente encontrado con búsqueda case-insensitive:', clienteData.nombre_cliente);
      }
    }
    
    // Si aún no encuentra, buscar por similitud parcial
    if (!clienteData) {
      console.log('🔍 Búsqueda case-insensitive fallida, intentando búsqueda parcial...');
      const todosClientes = loadClientes();
      clienteData = todosClientes.find(c => 
        c.nombre_cliente.toLowerCase().includes(cliente.toLowerCase()) ||
        cliente.toLowerCase().includes(c.nombre_cliente.toLowerCase())
      );
      
      if (clienteData) {
        console.log('✅ Cliente encontrado con búsqueda parcial:', clienteData.nombre_cliente);
      }
    }

    if (!clienteData) {
      console.log('❌ Cliente no encontrado en la base de datos:', cliente);
      console.log('📋 Clientes disponibles:', loadClientes().map(c => c.nombre_cliente));
      return null;
    }

    console.log('✅ Cliente validado exitosamente:', clienteData);
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
