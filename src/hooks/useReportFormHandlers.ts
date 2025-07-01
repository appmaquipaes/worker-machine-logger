
import { getClienteByName } from '@/models/Clientes';
import { getFincasByCliente } from '@/models/Fincas';

export const useReportFormHandlers = (
  setWorkSite: (value: string) => void,
  setSelectedCliente: (value: string) => void,
  setSelectedFinca: (value: string) => void,
  setDestination: (value: string) => void
) => {
  const handleClienteChangeForWorkSite = (cliente: string) => {
    setWorkSite(cliente);
  };

  const handleClienteChangeForDestination = (cliente: string) => {
    console.log('🔄 Cliente seleccionado para destino:', cliente);
    setSelectedCliente(cliente);
    setSelectedFinca('');
    
    if (cliente) {
      const clienteData = getClienteByName(cliente);
      if (clienteData) {
        const fincas = getFincasByCliente(clienteData.id);
        console.log('🏠 Fincas encontradas para cliente:', fincas.length);
        
        if (fincas.length === 0) {
          // Si no hay fincas, usar el cliente como destino
          console.log('✅ Sin fincas, usando cliente como destino:', cliente);
          setDestination(cliente);
        } else if (fincas.length === 1) {
          // Si solo hay una finca, seleccionarla automáticamente
          console.log('✅ Solo una finca, seleccionando automáticamente:', fincas[0].nombre_finca);
          setSelectedFinca(fincas[0].nombre_finca);
          setDestination(`${cliente} - ${fincas[0].nombre_finca}`);
        } else {
          // Si hay múltiples fincas, esperar selección del usuario
          console.log('⏳ Múltiples fincas, esperando selección del usuario');
          setDestination('');
        }
      }
    } else {
      setDestination('');
    }
  };

  const handleFincaChangeForDestination = (finca: string) => {
    console.log('🔄 Finca seleccionada para destino:', finca);
    setSelectedFinca(finca);
    // El destination se actualiza en el useEffect del hook principal
  };

  return {
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination,
  };
};
