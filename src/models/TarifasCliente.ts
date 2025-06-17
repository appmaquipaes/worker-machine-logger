
export interface TarifaCliente {
  id: string;
  cliente: string;
  finca?: string;
  origen: string;
  destino: string;
  valor_flete_m3: number;
  fechaRegistro: string;
}

export const findTarifaCliente = (
  cliente: string,
  finca: string,
  origen: string,
  destino: string
): TarifaCliente | undefined => {
  try {
    const stored = localStorage.getItem('tarifas_cliente');
    const tarifas: TarifaCliente[] = stored ? JSON.parse(stored) : [];
    
    return tarifas.find(tarifa => 
      tarifa.cliente === cliente &&
      tarifa.finca === finca &&
      tarifa.origen === origen &&
      tarifa.destino === destino
    );
  } catch (error) {
    console.error('Error finding tarifa cliente:', error);
    return undefined;
  }
};
