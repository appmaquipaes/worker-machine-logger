
// Función para determinar el tipo de venta basado en la actividad - ACTUALIZADA
export const determinarTipoVentaPorActividad = (
  actividad: string,
  reportType: string,
  maquina: string
): string => {
  const maquinaLower = maquina.toLowerCase();
  const tipoMaquina = getTipoMaquinaFromName(maquina);
  
  // Mapeo específico por tipo de máquina según las especificaciones
  switch (tipoMaquina) {
    case 'Retroexcavadora de Oruga':
    case 'Retroexcavadora de Llanta':
    case 'Vibrocompactador':
    case 'Paladraga':
    case 'Bulldozer':
    case 'Motoniveladora':
      return 'Alquiler por horas';
    
    case 'Cargador':
      return 'Solo material';
    
    case 'Camabaja':
      return 'Solo transporte';
    
    case 'Escombrera':
      return 'Escombrera';
    
    case 'Volqueta':
    case 'Camión':
      // Para volquetas y camiones, determinar según el contexto
      if (reportType === 'Viajes') {
        return 'Solo transporte';
      }
      return 'Solo transporte';
    
    case 'Semirremolque':
    case 'Tractomula':
      return 'Solo transporte';
    
    default:
      return 'Otros';
  }
};

// Función auxiliar para determinar el tipo de máquina desde el nombre
const getTipoMaquinaFromName = (nombreMaquina: string): string => {
  const nombre = nombreMaquina.toLowerCase();
  
  // Mapeo basado en palabras clave en el nombre
  if (nombre.includes('cat') || nombre.includes('komatsu') || nombre.includes('excavator')) {
    return 'Retroexcavadora de Oruga';
  }
  if (nombre.includes('cargador')) {
    return 'Cargador';
  }
  if (nombre.includes('vibro')) {
    return 'Vibrocompactador';
  }
  if (nombre.includes('bulldozer') || nombre.includes('d6')) {
    return 'Bulldozer';
  }
  if (nombre.includes('motoniveladora')) {
    return 'Motoniveladora';
  }
  if (nombre.includes('paladraga')) {
    return 'Paladraga';
  }
  if (nombre.includes('camabaja')) {
    return 'Camabaja';
  }
  if (nombre.includes('volqueta') || nombre.includes('mack')) {
    return 'Volqueta';
  }
  if (nombre.includes('camión')) {
    return 'Camión';
  }
  if (nombre.includes('escombrera')) {
    return 'Escombrera';
  }
  if (nombre.includes('semirremolque')) {
    return 'Semirremolque';
  }
  if (nombre.includes('tractomula')) {
    return 'Tractomula';
  }
  
  return 'Otros';
};
