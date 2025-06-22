
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
    
    // Normalizar el nombre del cliente para búsqueda más flexible
    const clienteNormalizado = cliente.toLowerCase().trim();
    console.log('🔍 Cliente normalizado:', clienteNormalizado);
    
    // Cargar todos los clientes
    const todosClientes = loadClientes();
    console.log('📋 Total clientes en sistema:', todosClientes.length);
    console.log('📋 Nombres de clientes disponibles:', todosClientes.map(c => c.nombre_cliente));
    
    // 1. Búsqueda exacta
    let clienteData = todosClientes.find(c => c.nombre_cliente === cliente);
    
    if (clienteData) {
      console.log('✅ Cliente encontrado con búsqueda exacta:', clienteData.nombre_cliente);
      return clienteData;
    }
    
    // 2. Búsqueda case-insensitive
    console.log('🔍 Búsqueda exacta fallida, intentando case-insensitive...');
    clienteData = todosClientes.find(c => 
      c.nombre_cliente.toLowerCase().trim() === clienteNormalizado
    );
    
    if (clienteData) {
      console.log('✅ Cliente encontrado con búsqueda case-insensitive:', clienteData.nombre_cliente);
      return clienteData;
    }
    
    // 3. Búsqueda parcial (contiene)
    console.log('🔍 Búsqueda case-insensitive fallida, intentando búsqueda parcial...');
    clienteData = todosClientes.find(c => {
      const nombreClienteNormalizado = c.nombre_cliente.toLowerCase().trim();
      return nombreClienteNormalizado.includes(clienteNormalizado) ||
             clienteNormalizado.includes(nombreClienteNormalizado);
    });
    
    if (clienteData) {
      console.log('✅ Cliente encontrado con búsqueda parcial:', clienteData.nombre_cliente);
      return clienteData;
    }

    // 4. Búsqueda por palabras clave
    console.log('🔍 Búsqueda parcial fallida, intentando por palabras clave...');
    const palabrasCliente = clienteNormalizado.split(/\s+/).filter(p => p.length > 2);
    console.log('🔍 Palabras del cliente:', palabrasCliente);
    
    clienteData = todosClientes.find(c => {
      const nombreClienteNormalizado = c.nombre_cliente.toLowerCase().trim();
      return palabrasCliente.some(palabra => nombreClienteNormalizado.includes(palabra));
    });
    
    if (clienteData) {
      console.log('✅ Cliente encontrado con búsqueda por palabras clave:', clienteData.nombre_cliente);
      return clienteData;
    }

    console.log('❌ Cliente no encontrado con ningún método de búsqueda');
    console.log('📋 Búsquedas realizadas:');
    console.log('  1. Exacta:', cliente);
    console.log('  2. Case-insensitive:', clienteNormalizado);
    console.log('  3. Parcial: contiene o está contenido');
    console.log('  4. Palabras clave:', palabrasCliente.join(', '));
    
    return null;
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
    // Extraer la primera parte antes del primer " - "
    const parts = destination.split(' - ');
    const cliente = parts[0] || '';
    console.log('🔍 Extrayendo cliente de destino:', destination, '→', cliente);
    return cliente.trim();
  };

  return {
    validateReportType,
    validateClienteExists,
    extractClienteInfo,
    extractClienteFromDestination
  };
};
