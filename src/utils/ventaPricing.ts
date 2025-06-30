
export const getValorPorHoraPorDefecto = (maquina: string): number => {
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

export const getValorFleteDefecto = (maquina: string, viajes: number): number => {
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

export const getValorServicioDefecto = (tipoReporte: string, maquina: string): number => {
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
