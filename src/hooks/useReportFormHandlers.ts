
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
    setSelectedCliente(cliente);
    setSelectedFinca('');
    
    if (cliente) {
      const clienteData = getClienteByName(cliente);
      if (clienteData) {
        const fincas = getFincasByCliente(clienteData.id);
        if (fincas.length === 0) {
          setDestination(cliente);
        } else {
          setDestination('');
        }
      }
    } else {
      setDestination('');
    }
  };

  const handleFincaChangeForDestination = (finca: string) => {
    setSelectedFinca(finca);
    setDestination(finca);
  };

  return {
    handleClienteChangeForWorkSite,
    handleClienteChangeForDestination,
    handleFincaChangeForDestination
  };
};
